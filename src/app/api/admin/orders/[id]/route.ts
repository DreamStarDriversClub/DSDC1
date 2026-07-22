import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dsdc_session")?.value;
  if (!sessionCookie) return null;
  const session = await verifyToken(sessionCookie);
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/* ── GET single order with items and customer ─────────────── */
export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        items: true,
        shippingAddress: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        status: order.status,
        subtotal: Number(order.subtotal),
        shipping: Number(order.shipping),
        tax: Number(order.tax),
        discount: order.discount ? Number(order.discount) : null,
        total: Number(order.total),
        trackingNumber: order.trackingNumber,
        notes: order.notes,
        createdAt: order.createdAt.toISOString(),
        customer: order.user
          ? {
              id: order.user.id,
              name: `${order.user.firstName} ${order.user.lastName}`,
              email: order.user.email,
            }
          : null,
        shippingAddress: order.shippingAddress
          ? {
              line1: order.shippingAddress.line1,
              line2: order.shippingAddress.line2,
              city: order.shippingAddress.city,
              state: order.shippingAddress.state,
              zip: order.shippingAddress.zip,
              country: order.shippingAddress.country,
            }
          : null,
        items: order.items.map((i) => ({
          id: i.id,
          name: i.name,
          sku: i.sku,
          price: Number(i.price),
          quantity: i.quantity,
          productId: i.productId,
          variantId: i.variantId,
        })),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── PATCH update order (tracking, notes) ─────────────────── */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { trackingNumber, notes } = body;

    const order = await prisma.order.update({
      where: { id: params.id },
      data: {
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({
      order: {
        id: order.id,
        trackingNumber: order.trackingNumber,
        notes: order.notes,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
