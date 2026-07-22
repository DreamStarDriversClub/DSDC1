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

/* ── POST create rate in zone ───────────────────────────── */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id: zoneId } = await params;
    const body = await request.json();
    const { name, rate, minOrder, estimatedDays, isActive } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (rate == null || isNaN(Number(rate)) || Number(rate) < 0) {
      return NextResponse.json({ error: "Valid rate is required" }, { status: 400 });
    }

    const zone = await prisma.shippingZone.findUnique({ where: { id: zoneId } });
    if (!zone) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });
    }

    const shippingRate = await prisma.shippingRate.create({
      data: {
        zoneId,
        name: name.trim(),
        rate: Number(rate),
        minOrder: minOrder != null && minOrder !== "" ? Number(minOrder) : null,
        estimatedDays: estimatedDays?.trim() || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        rate: {
          id: shippingRate.id,
          zoneId: shippingRate.zoneId,
          name: shippingRate.name,
          rate: Number(shippingRate.rate),
          minOrder: shippingRate.minOrder ? Number(shippingRate.minOrder) : null,
          estimatedDays: shippingRate.estimatedDays,
          isActive: shippingRate.isActive,
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create rate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
