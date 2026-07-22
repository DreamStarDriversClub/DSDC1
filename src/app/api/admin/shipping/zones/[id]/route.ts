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

/* ── PUT update zone ────────────────────────────────────── */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { name, countries, isActive } = body;

    const existing = await prisma.shippingZone.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });
    }

    const zone = await prisma.shippingZone.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(countries !== undefined && { countries }),
        ...(isActive !== undefined && { isActive }),
      },
      include: { rates: true },
    });

    return NextResponse.json({
      zone: {
        id: zone.id,
        name: zone.name,
        countries: zone.countries,
        isActive: zone.isActive,
        createdAt: zone.createdAt.toISOString(),
        rates: zone.rates.map((r) => ({
          id: r.id,
          zoneId: r.zoneId,
          name: r.name,
          rate: Number(r.rate),
          minOrder: r.minOrder ? Number(r.minOrder) : null,
          estimatedDays: r.estimatedDays,
          isActive: r.isActive,
        })),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update zone";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── DELETE zone ────────────────────────────────────────── */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const existing = await prisma.shippingZone.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Zone not found" }, { status: 404 });
    }

    await prisma.shippingZone.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete zone";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
