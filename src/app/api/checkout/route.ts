import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession } from "@/lib/stripe";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://ffb67c3dcb7e043dcddde26b2c8fe4dc.ctonew.app";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured. Please contact the site owner." },
        { status: 500 },
      );
    }

    const body = await req.json();
    const {
      items,
      shippingAddress,
      shippingMethod,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      coupon,
    }: {
      items: Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
        variantName?: string;
      }>;
      shippingAddress: {
        email: string;
        firstName: string;
        lastName: string;
        line1: string;
        line2?: string;
        city: string;
        state: string;
        zip: string;
        country?: string;
        phone?: string;
      };
      shippingMethod: string;
      subtotal: number;
      discount: number;
      shipping: number;
      tax: number;
      total: number;
      coupon: string | null;
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 },
      );
    }

    // Store cart/order details in session metadata so we can recreate on success
    const metadata: Record<string, string> = {
      shippingAddress: JSON.stringify(shippingAddress),
      shippingMethod: String(shippingMethod),
      subtotal: String(subtotal),
      discount: String(discount),
      shipping: String(shipping),
      tax: String(tax),
      total: String(total),
      coupon: coupon || "",
      items: JSON.stringify(items),
    };

    const lineItems = items.map((item) => ({
      name: item.name,
      unitAmount: Math.round(item.price * 100), // dollars → cents
      quantity: item.quantity,
      image: item.image,
      variantName: item.variantName,
    }));

    const session = await createCheckoutSession({
      lineItems,
      successUrl: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${SITE_URL}/checkout`,
      metadata,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err);
    return NextResponse.json(
      { error: "An error occurred. Please try again." },
      { status: 500 },
    );
  }
}
