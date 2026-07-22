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

/* ── PUT update tax rate ────────────────────────────────── */
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
    const { name, country, state, rate, isActive } = body;

    const existing = await prisma.taxRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Tax rate not found" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name.trim();
    if (country !== undefined) data.country = country.trim() || "US";
    if (state !== undefined) data.state = state?.trim() || null;
    if (rate !== undefined) data.rate = Number(rate);
    if (isActive !== undefined) data.isActive = isActive;

    const updated = await prisma.taxRate.update({ where: { id }, data });

    return NextResponse.json({
      tax: {
        id: updated.id,
        name: updated.name,
        country: updated.country,
        state: updated.state,
        rate: Number(updated.rate),
        isActive: updated.isActive,
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update tax rate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── DELETE tax rate ────────────────────────────────────── */
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

    const existing = await prisma.taxRate.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Tax rate not found" }, { status: 404 });
    }

    await prisma.taxRate.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete tax rate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
