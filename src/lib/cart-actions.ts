"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createPrintfulOrder } from "@/lib/printful";

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
      // Map order items to Printful variants via SKU or variantId
      const printfulItems = [];
      for (const item of input.items) {
        // Try to find Printful variant — first by variantId, then by SKU
        let printfulVariant = null;
        
        if (item.variantId) {
          printfulVariant = await prisma.printfulVariant.findFirst({
            where: { productId: item.variantId },
          });
        }
        
        if (!printfulVariant && item.sku) {
          // Try matching by SKU on the product-level PrintfulVariant
          printfulVariant = await prisma.printfulVariant.findFirst({
            where: { name: { contains: item.sku } },
          });
        }

        if (printfulVariant) {
          printfulItems.push({
            printfulVariantId: String(printfulVariant.printfulId),
            quantity: item.quantity,
            retailPrice: item.price,
            name: item.name,
          });
        }
      }

      if (printfulItems.length > 0) {
        const fullName = `${input.shippingAddress.firstName} ${input.shippingAddress.lastName}`;
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
