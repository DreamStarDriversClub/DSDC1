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

/* ── PUT update rate ────────────────────────────────────── */
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
    const { name, rate, minOrder, estimatedDays, isActive } = body;

    const existing = await prisma.shippingRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Rate not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name.trim();
    if (rate !== undefined) data.rate = Number(rate);
    if (minOrder !== undefined) {
      data.minOrder = minOrder != null && minOrder !== "" ? Number(minOrder) : null;
    }
    if (estimatedDays !== undefined) {
      data.estimatedDays = estimatedDays?.trim() || null;
    }
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await prisma.shippingRate.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      rate: {
        id: updated.id,
        zoneId: updated.zoneId,
        name: updated.name,
        rate: Number(updated.rate),
        minOrder: updated.minOrder ? Number(updated.minOrder) : null,
        estimatedDays: updated.estimatedDays,
        isActive: updated.isActive,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update rate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── DELETE rate ────────────────────────────────────────── */
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

    const existing = await prisma.shippingRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Rate not found" }, { status: 404 });
    }

    await prisma.shippingRate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete rate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
