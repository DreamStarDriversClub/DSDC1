import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createOrderAction } from "@/lib/cart-actions";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Missing session_id" }, { status: 400 });
    }

    // Retrieve the Stripe Checkout Session
    const session: any = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ success: false, error: "Payment not completed" }, { status: 400 });
    }

    // Parse items from metadata
    let items: Array<{ name: string; price: number; quantity: number; variantName?: string }> = [];
    try {
      items = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
    } catch {}

    if (items.length === 0) {
      return NextResponse.json({ success: false, error: "No items found in session" }, { status: 400 });
    }

    // Get shipping/customer details from the session
    const shipping = session.shipping_details || session.shipping;
    const customerEmail = session.customer_details?.email || session.customer?.email || "";

    // Create the order in our database
    const result = await createOrderAction({
      items: items.map((item: any) => ({
        productId: "",
        variantId: undefined,
        name: item.name,
        slug: "",
        sku: "",
        price: item.price,
        quantity: item.quantity,
        variantName: item.variantName,
      })),
      coupon: null,
      shippingMethod: "standard",
      shippingAddress: {
        email: customerEmail,
        firstName: shipping?.name?.split(" ")[0] || "",
        lastName: shipping?.name?.split(" ").slice(1).join(" ") || "",
        line1: shipping?.address?.line1 || "",
        line2: shipping?.address?.line2 || "",
        city: shipping?.address?.city || "",
        state: shipping?.address?.state || "",
        zip: shipping?.address?.postal_code || "",
        country: shipping?.address?.country || "US",
      },
      subtotal: (session.amount_subtotal || 0) / 100,
      discount: 0,
      shipping: (session.total_details?.amount_shipping || 0) / 100,
      tax: (session.total_details?.amount_tax || 0) / 100,
      total: (session.amount_total || 0) / 100,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Verify checkout error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Verification failed" },
      { status: 500 },
    );
  }
}
