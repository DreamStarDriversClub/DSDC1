import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dsdc_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const session = await verifyToken(sessionCookie);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Get top products by order item quantity sold
    const items = await prisma.orderItem.groupBy({
      by: ["productId", "name", "sku"],
      _sum: { quantity: true },
      _count: true,
      orderBy: { _sum: { quantity: "desc" } },
      take: 10,
      where: {
        order: { status: { not: "CANCELLED" } },
        productId: { not: null },
      },
    });

    const topProducts = items.map((item) => ({
      productId: item.productId,
      name: item.name,
      sku: item.sku,
      quantity: item._sum.quantity ?? 0,
      orders: item._count,
    }));

    return NextResponse.json({ products: topProducts });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
