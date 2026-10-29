"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createPrintfulOrder } from "@/lib/printful";
import type { PrintfulVariant } from "@prisma/client";

/* ── Types ───────────────────────────────────────────────── */

export interface ShippingAddress {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrderItemInput {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  quantity: number;
  variantName?: string;
}

interface CreateOrderInput {
  items: OrderItemInput[];
  coupon?: { code: string; discountType: string; discountValue: number } | null;
  shippingMethod: string;
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

/* ── Printful fulfillment mapping ────────────────────────── */

/**
 * How a cart item points at a Printful variant
 * --------------------------------------------
 * Storefront Printful products are exposed by `shop-data.getPrintfulProductBySlug`
 * with synthetic identifiers:
 *   product.id       → `printful-<PrintfulProduct.printfulId>`  (cart `productId`)
 *   product.sku      → `PrintfulProduct.printfulId`             (cart `sku`)
 *   variant.id       → `String(PrintfulVariant.id)`             (cart `variantId`)
 *   variant.name     → `PrintfulVariant.name`                   (cart `variantName`)
 *
 * So the authoritative join is the local `PrintfulVariant` row primary key — NOT
 * `PrintfulVariant.productId` (that holds Printful's *product* id) and NOT a SKU
 * match against Printful variant names (Printful names look like
 * "Rotary Blueprint / Black / 2XL", never a SKU).
 *
 * `createPrintfulOrder` wants `printfulVariantId`, which is `PrintfulVariant.printfulId`
 * — Printful's own sync-variant id (what `syncPrintfulProducts` stores as `printfulId`).
 */
const PRINTFUL_PRODUCT_ID_PREFIX = "printful-";

/** Statuses written to `Order.printfulStatus` when Printful fulfillment needs a human. */
const PRINTFUL_MANUAL_REVIEW_STATUS = "MANUAL_REVIEW";
const PRINTFUL_FAILED_STATUS = "PRINTFUL_FAILED";

/** Printful's product id for a storefront item, or null when the item isn't a Printful product. */
function printfulProductIdFromItem(item: OrderItemInput): string | null {
  if (!item.productId || !item.productId.startsWith(PRINTFUL_PRODUCT_ID_PREFIX)) {
    return null;
  }
  const id = item.productId.slice(PRINTFUL_PRODUCT_ID_PREFIX.length).trim();
  return id || null;
}

function isPrintfulItem(item: OrderItemInput): boolean {
  return printfulProductIdFromItem(item) !== null;
}

/**
 * `PrintfulVariant.id` / `catalogVariantId` are Postgres INT4 columns. A cart value
 * such as Printful's 10-digit sync variant id must NOT be fed to them as-is:
 * Prisma/Postgres throws "Unable to fit integer value into an INT4" instead of
 * returning null, which would abort the whole mapping.
 */
const INT4_MAX = 2147483647;

function asInt4(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > INT4_MAX) return null;
  return parsed;
}

/**
 * Resolve a cart/order line to the `PrintfulVariant` row that Printful should print.
 * Returns null for items that aren't Printful-fulfilled (locally stocked goods).
 */
async function resolvePrintfulVariant(
  item: OrderItemInput
): Promise<PrintfulVariant | null> {
  const printfulProductId = printfulProductIdFromItem(item);

  if (item.variantId) {
    // 1. Primary path: `variantId` is a local PrintfulVariant.id (autoincrement Int,
    //    stringified by the storefront). Guard against a stale id belonging to a
    //    different Printful product.
    const rowId = asInt4(item.variantId);
    if (rowId !== null) {
      const byRowId = await prisma.printfulVariant.findUnique({
        where: { id: rowId },
      });
      if (
        byRowId &&
        (!printfulProductId || byRowId.productId === printfulProductId)
      ) {
        return byRowId;
      }
    }

    // 2. Carts saved by older code may carry Printful's sync variant id, or the
    //    catalog variant id, instead of our row id.
    const byPrintfulId = await prisma.printfulVariant.findUnique({
      where: { printfulId: item.variantId },
    });
    if (
      byPrintfulId &&
      (!printfulProductId || byPrintfulId.productId === printfulProductId)
    ) {
      return byPrintfulId;
    }

    const catalogVariantId = asInt4(item.variantId);
    if (catalogVariantId !== null) {
      const byCatalogId = await prisma.printfulVariant.findFirst({
        where: { catalogVariantId },
      });
      if (
        byCatalogId &&
        (!printfulProductId || byCatalogId.productId === printfulProductId)
      ) {
        return byCatalogId;
      }
    }
  }

  if (!printfulProductId) return null;

  // 3. Last resort: scope to the Printful product and use the variant label the
  //    customer actually picked (single-variant products need no label at all).
  const variants = await prisma.printfulVariant.findMany({
    where: { productId: printfulProductId },
  });
  if (variants.length === 1) return variants[0];

  if (item.variantName) {
    const wanted = item.variantName.trim().toLowerCase();
    const byName = variants.find(
      (v) => v.name.trim().toLowerCase() === wanted
    );
    if (byName) return byName;
  }

  return null;
}

/* ── Coupon validation ──────────────────────────────────── */

export async function validateCouponAction(code: string, subtotal: number) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) {
      return { valid: false, error: "Invalid coupon code." };
    }

    if (!coupon.isActive) {
      return { valid: false, error: "This coupon is no longer active." };
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { valid: false, error: "This coupon has expired." };
    }

    if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) {
      return { valid: false, error: "This coupon has reached its usage limit." };
    }

    if (
      coupon.minOrderAmount &&
      subtotal < parseFloat(coupon.minOrderAmount.toString())
    ) {
      return {
        valid: false,
        error: `Minimum order amount of $${parseFloat(coupon.minOrderAmount.toString()).toFixed(2)} required.`,
      };
    }

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: parseFloat(coupon.discountValue.toString()),
      },
    };
  } catch (error) {
    console.error("Coupon validation error:", error);
    return { valid: false, error: "Failed to validate coupon." };
  }
}

/* ── Create order ───────────────────────────────────────── */

export async function createOrderAction(
  input: CreateOrderInput
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Create shipping address (only for authenticated users)
    let shippingAddressId: string | null = null;
    const session = await getSession();
    if (session) {
      try {
        const address = await prisma.address.create({
          data: {
            userId: session.userId,
            line1: input.shippingAddress.line1,
            line2: input.shippingAddress.line2 || null,
            city: input.shippingAddress.city,
            state: input.shippingAddress.state,
            zip: input.shippingAddress.zip,
            country: input.shippingAddress.country || "US",
          },
        });
        shippingAddressId = address.id;
      } catch (addrError) {
        console.error("Address creation error:", addrError);
      }
    }

    let order;
    try {
      order = await prisma.order.create({
        data: {
          email: input.shippingAddress.email || null,
          subtotal: input.subtotal,
          tax: input.tax,
          shipping: input.shipping,
          discount: input.discount,
          total: input.total,
          shippingAddressId,
          items: {
            create: input.items.map((item) => ({
              productId: item.productId || null,
              variantId: item.variantId || null,
              name: item.name,
              sku: item.sku,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      });
    } catch (createError) {
      console.error("Prisma order.create error:", createError);
      const message =
        createError instanceof Error ? createError.message : "Unknown database error";
      return { success: false, error: `Failed to create order: ${message}` };
    }

    // Increment coupon usage if applicable
    if (input.coupon) {
      try {
        await prisma.coupon.update({
          where: { code: input.coupon.code },
          data: { currentUses: { increment: 1 } },
        });
      } catch {}
    }

    // Push order to Printful for fulfillment
    try {
      const printfulItems: Array<{
        printfulVariantId: string;
        quantity: number;
        retailPrice: number;
        name?: string;
      }> = [];
      const unresolved: Array<{ item: OrderItemInput; reason: string }> = [];

      for (const item of input.items) {
        const printfulVariant = await resolvePrintfulVariant(item);

        if (printfulVariant) {
          printfulItems.push({
            printfulVariantId: printfulVariant.printfulId,
            quantity: item.quantity,
            retailPrice: item.price,
            name: item.name,
          });
          continue;
        }

        if (isPrintfulItem(item)) {
          // A Printful-fulfilled product we cannot map is a real fulfillment failure:
          // never drop it silently.
          const reason = `no PrintfulVariant matches variantId=${item.variantId ?? "none"} / variantName=${item.variantName ?? "none"} for Printful product ${printfulProductIdFromItem(item)}`;
          console.error(
            `[printful] Order ${order.id}: unmapped Printful item "${item.name}" (sku ${item.sku || "n/a"}) — ${reason}`
          );
          unresolved.push({ item, reason });
        } else {
          // Locally stocked / manually fulfilled product — Printful is not involved.
          console.info(
            `[printful] Order ${order.id}: item "${item.name}" (sku ${item.sku || "n/a"}) is not Printful-fulfilled, skipping.`
          );
        }
      }

      if (unresolved.length > 0) {
        // Partially fulfilling a paid order would under-ship it, so hold the whole
        // Printful order and hand it to a human instead of guessing.
        const detail = unresolved
          .map(
            ({ item, reason }) =>
              `"${item.name}" (sku ${item.sku || "n/a"}, variant ${item.variantId ?? "n/a"}): ${reason}`
          )
          .join("; ");
        const note = `[PRINTFUL MAPPING FAILED] ${unresolved.length} line item(s) could not be matched to a Printful variant, so no Printful order was created. Fulfill manually or re-sync Printful products. Details: ${detail}`;

        console.error(`[printful] Order ${order.id}: ${note}`);

        await prisma.order
          .update({
            where: { id: order.id },
            data: {
              printfulStatus: PRINTFUL_MANUAL_REVIEW_STATUS,
              notes: note,
            },
          })
          .catch((updateError) => {
            console.error(
              `[printful] Order ${order.id}: failed to flag order for manual review:`,
              updateError
            );
          });
      } else if (printfulItems.length > 0) {
        const fullName = `${input.shippingAddress.firstName} ${input.shippingAddress.lastName}`;
        try {
          const pfResult = await createPrintfulOrder({
            externalId: order.id,
            shippingAddress: {
              name: fullName,
              line1: input.shippingAddress.line1,
              line2: input.shippingAddress.line2,
              city: input.shippingAddress.city,
              state: input.shippingAddress.state,
              zip: input.shippingAddress.zip,
              country: input.shippingAddress.country || "US",
              email: input.shippingAddress.email,
            },
            items: printfulItems,
            retailCosts: {
              subtotal: input.subtotal,
              shipping: input.shipping,
              tax: input.tax,
              discount: input.discount,
              total: input.total,
            },
            shippingMethod: input.shippingMethod || "standard",
          });

          await prisma.order.update({
            where: { id: order.id },
            data: {
              printfulOrderId: pfResult.printfulOrderId,
              printfulStatus: pfResult.status,
            },
          });
        } catch (pfError) {
          const message =
            pfError instanceof Error ? pfError.message : String(pfError);
          console.error(
            `[printful] Order ${order.id}: paid order saved but Printful order creation failed: ${message}`
          );
          await prisma.order
            .update({
              where: { id: order.id },
              data: {
                printfulStatus: PRINTFUL_FAILED_STATUS,
                notes: `[PRINTFUL ORDER FAILED] ${message} — manual fulfillment required.`,
              },
            })
            .catch((updateError) => {
              console.error(
                `[printful] Order ${order.id}: failed to record Printful failure:`,
                updateError
              );
            });
        }
      } else {
        console.info(
          `[printful] Order ${order.id}: no Printful-fulfilled items, nothing to send.`
        );
      }
    } catch (pfError) {
      console.error("Printful order creation failed:", pfError);
      // Order is still saved — don't fail the whole checkout
    }

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order creation error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `Failed to create order: ${message}` };
  }
}
