import { NextRequest, NextResponse } from "next/server";
import { retrieveCheckoutSession } from "@/lib/stripe";
import { createOrderAction } from "@/lib/cart-actions";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session ID." },
        { status: 400 },
      );
    }

    const session = await retrieveCheckoutSession(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment has not been completed." },
        { status: 400 },
      );
    }

    // Parse metadata back from Stripe session
    const metadata = session.metadata;
    if (!metadata || !metadata.items || !metadata.shippingAddress) {
      return NextResponse.json(
        { error: "Invalid session metadata." },
        { status: 400 },
      );
    }

    const items = JSON.parse(metadata.items);
    const shippingAddress = JSON.parse(metadata.shippingAddress);
    const shippingMethod = metadata.shippingMethod || "standard";
    const subtotal = parseFloat(metadata.subtotal || "0");
    const discount = parseFloat(metadata.discount || "0");
    const shipping = parseFloat(metadata.shipping || "0");
    const tax = parseFloat(metadata.tax || "0");
    const total = parseFloat(metadata.total || "0");
    const couponCode = metadata.coupon || null;

    // Build coupon object if used
    let coupon: { code: string; discountType: string; discountValue: number } | null = null;
    if (couponCode) {
      // We save just the code; discount is already baked into prices
      coupon = {
        code: couponCode,
        discountType: "percentage",
        discountValue: 0,
      };
    }

    const result = await createOrderAction({
      items: items.map((item: Record<string, unknown>) => ({
        productId: String(item.productId || ""),
        variantId: item.variantId ? String(item.variantId) : undefined,
        name: String(item.name || ""),
        slug: item.slug ? String(item.slug) : "",
        sku: item.sku ? String(item.sku) : "",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        variantName: item.variantName ? String(item.variantName) : undefined,
      })),
      coupon,
      shippingMethod,
      shippingAddress,
      subtotal,
      discount,
      shipping,
      tax,
      total,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to create order." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
    });
  } catch (err) {
    console.error("Verify session error:", err);
    return NextResponse.json(
      { error: "Failed to verify payment." },
      { status: 500 },
    );
  }
}
