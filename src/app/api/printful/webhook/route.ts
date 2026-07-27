import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Printful webhook receiver.
 * Printful sends POST requests for order status changes (fulfilled, shipped, etc).
 * Webhook URL to configure in Printful: https://dreamstardc.com/api/printful/webhook
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Printful sends events as { type: string, data: { order: {...} } }
    const eventType = body.type;
    const orderData = body.data?.order;

    if (!eventType || !orderData) {
      return NextResponse.json({ received: true });
    }

    const printfulOrderId = orderData.id;
    const printfulStatus = orderData.status;

    // Find our order by Printful order ID
    const order = await prisma.order.findFirst({
      where: { printfulOrderId },
    });

    if (!order) {
      console.warn(`Printful webhook: no local order found for PF#${printfulOrderId}`);
      return NextResponse.json({ received: true });
    }

    // Handle different event types
    switch (eventType) {
      case "order_updated":
      case "order_put_on_hold":
      case "order_remove_hold":
        await prisma.order.update({
          where: { id: order.id },
          data: { printfulStatus },
        });
        break;

      case "package_shipped": {
        const shipment = body.data?.shipment;
        const trackingNumber = shipment?.tracking_number || null;
        await prisma.order.update({
          where: { id: order.id },
          data: {
            printfulStatus,
            trackingNumber,
            status: "SHIPPED",
          },
        });
        break;
      }

      case "package_returned":
        await prisma.order.update({
          where: { id: order.id },
          data: { printfulStatus },
        });
        break;

      default:
        // Log unknown event types for monitoring
        console.log(`Printful webhook: unhandled event type "${eventType}" for PF#${printfulOrderId}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Printful webhook error:", err);
    // Always return 200 to Printful so they don't retry
    return NextResponse.json({ received: true });
  }
}
