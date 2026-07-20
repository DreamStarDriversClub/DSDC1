"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { DiscountType } from "@prisma/client";

/* ── Types ───────────────────────────────────────────────── */

export interface ValidatedCartItem {
  productId: string;
  variantId: string | null;
  name: string;
  slug: string;
  sku: string;
  price: number;
  quantity: number;
  variantName?: string;
}

export interface ValidatedCoupon {
  code: string;
  discountType: DiscountType;
  discountValue: number;
}

export interface CouponValidationResult {
  valid: boolean;
  coupon?: ValidatedCoupon;
  error?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CreateOrderInput {
  items: ValidatedCartItem[];
  coupon?: ValidatedCoupon | null;
  shippingMethod: string;
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CreateOrderResult {
  success: boolean;
  orderId?: string;
  error?: string;
}

/* ── Coupon Validation ───────────────────────────────────── */

export async function validateCouponAction(
  code: string,
  subtotal: number,
): Promise<CouponValidationResult> {
  "use server";

  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return { valid: false, error: "Please enter a coupon code." };
  }

  const normalized = code.trim().toUpperCase();

  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalized },
    });

    if (!coupon) {
      return { valid: false, error: `Coupon "${normalized}" not found.` };
    }

    if (!coupon.isActive) {
      return { valid: false, error: "This coupon is no longer active." };
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { valid: false, error: "This coupon has expired." };
    }

    if (
      coupon.maxUses !== null &&
      coupon.currentUses >= coupon.maxUses
    ) {
      return { valid: false, error: "This coupon has reached its usage limit." };
    }

    if (
      coupon.minOrderAmount &&
      subtotal < Number(coupon.minOrderAmount)
    ) {
      return {
        valid: false,
        error: `Minimum order of $${Number(coupon.minOrderAmount).toFixed(2)} required.`,
      };
    }

    return {
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
      },
    };
  } catch (err) {
    console.error("Coupon validation error:", err);
    return { valid: false, error: "Failed to validate coupon. Please try again." };
  }
}

/* ── Price Verification ──────────────────────────────────── */

export async function verifyProductPriceAction(
  productId: string,
  variantId: string | null,
): Promise<{ valid: boolean; price: number; name: string; slug: string; sku: string; variantName?: string } | null> {
  "use server";

  try {
    if (variantId) {
      const variant = await prisma.productVariant.findUnique({
        where: { id: variantId },
        include: {
          product: { select: { id: true, name: true, slug: true, isActive: true } },
        },
      });

      if (!variant || !variant.product.isActive || variant.product.id !== productId) {
        return null;
      }

      return {
        valid: true,
        price: Number(variant.price),
        name: variant.product.name,
        slug: variant.product.slug,
        sku: variant.sku,
        variantName: variant.name,
      };
    } else {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product || !product.isActive) {
        return null;
      }

      const effectivePrice = product.salePrice
        ? Number(product.salePrice)
        : Number(product.price);

      return {
        valid: true,
        price: effectivePrice,
        name: product.name,
        slug: product.slug,
        sku: product.sku,
      };
    }
  } catch (err) {
    console.error("Price verification error:", err);
    return null;
  }
}

/* ── Order Creation ──────────────────────────────────────── */

export async function createOrderAction(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  "use server";

  try {
    // Verify all items have valid prices (server-side price check)
    for (const item of input.items) {
      const verified = await verifyProductPriceAction(
        item.productId,
        item.variantId,
      );
      if (!verified) {
        return {
          success: false,
          error: `Product "${item.name}" is no longer available at the expected price.`,
        };
      }
      if (Math.abs(verified.price - item.price) > 0.01) {
        return {
          success: false,
          error: `Price for "${item.name}" has changed. Please refresh and try again.`,
        };
      }
    }

    // Create the order
    const order = await prisma.$transaction(async (tx) => {
      // Create shipping address
      const address = await tx.address.create({
        data: {
          userId: "guest", // Will be replaced with real user ID when auth is implemented
          line1: input.shippingAddress.line1,
          line2: input.shippingAddress.line2 || null,
          city: input.shippingAddress.city,
          state: input.shippingAddress.state,
          zip: input.shippingAddress.zip,
          country: input.shippingAddress.country || "US",
        },
      });

      // Create order
      const newOrder = await tx.order.create({
        data: {
          subtotal: input.subtotal,
          tax: input.tax,
          shipping: input.shipping,
          total: input.total,
          shippingAddressId: address.id,
          billingAddressId: address.id, // Same as shipping for now
          notes: input.shippingAddress.email, // Store email in notes for guest checkout
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              name: item.name,
              sku: item.sku,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // Increment coupon usage if applied
      if (input.coupon) {
        await tx.coupon.update({
          where: { code: input.coupon.code },
          data: { currentUses: { increment: 1 } },
        });
      }

      return newOrder;
    });

    revalidatePath("/checkout");

    return {
      success: true,
      orderId: order.id,
    };
  } catch (err) {
    console.error("Order creation error:", err);
    return {
      success: false,
      error: "Failed to create order. Please try again.",
    };
  }
}
