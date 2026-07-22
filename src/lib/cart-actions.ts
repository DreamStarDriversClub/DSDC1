"use server";

import { prisma } from "@/lib/prisma";

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
    const order = await prisma.order.create({
      data: {
        subtotal: input.subtotal,
        tax: input.tax,
        shipping: input.shipping,
        total: input.total,
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

    // Increment coupon usage if applicable
    if (input.coupon) {
      try {
        await prisma.coupon.update({
          where: { code: input.coupon.code },
          data: { currentUses: { increment: 1 } },
        });
      } catch {}
    }

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order creation error:", error);
    return { success: false, error: "Failed to create order." };
  }
}
