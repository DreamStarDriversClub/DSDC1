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

/* ── GET all coupons ──────────────────────────────────────── */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });

    const data = coupons.map((c) => ({
      id: c.id,
      code: c.code,
      discountType: c.discountType,
      discountValue: Number(c.discountValue),
      minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
      maxUses: c.maxUses,
      currentUses: c.currentUses,
      expiresAt: c.expiresAt?.toISOString() ?? null,
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
    }));

    return NextResponse.json({ coupons: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch coupons";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── POST create coupon ──────────────────────────────────── */
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxUses,
      expiresAt,
      isActive,
    } = body;

    if (!code || !discountType || discountValue == null) {
      return NextResponse.json(
        { error: "Code, discountType, and discountValue are required" },
        { status: 400 }
      );
    }

    if (!["PERCENTAGE", "FIXED"].includes(discountType)) {
      return NextResponse.json(
        { error: "discountType must be PERCENTAGE or FIXED" },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount ?? null,
        maxUses: maxUses ?? null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        coupon: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discountType,
          discountValue: Number(coupon.discountValue),
          minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
          maxUses: coupon.maxUses,
          currentUses: coupon.currentUses,
          expiresAt: coupon.expiresAt?.toISOString() ?? null,
          isActive: coupon.isActive,
          createdAt: coupon.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create coupon";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
