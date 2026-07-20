import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Auth check
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dsdc_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const session = await verifyToken(sessionCookie);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
        items: {
          select: { id: true, name: true, quantity: true, price: true },
        },
      },
    }),
    prisma.order.count(),
  ]);

  const data = orders.map((o) => ({
    id: o.id,
    customerName: o.user ? `${o.user.firstName} ${o.user.lastName}` : "Guest",
    customerEmail: o.user?.email ?? "—",
    status: o.status,
    total: Number(o.total),
    itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: o.createdAt.toISOString(),
  }));

  return NextResponse.json({
    orders: data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
