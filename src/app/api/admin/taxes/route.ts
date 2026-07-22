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

/* ── GET all tax rates ──────────────────────────────────── */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const taxRates = await prisma.taxRate.findMany({
      orderBy: { createdAt: "desc" },
    });

    const data = taxRates.map((t) => ({
      id: t.id,
      name: t.name,
      country: t.country,
      state: t.state,
      rate: Number(t.rate),
      isActive: t.isActive,
      createdAt: t.createdAt.toISOString(),
    }));

    return NextResponse.json({ taxes: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch taxes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── POST create tax rate ───────────────────────────────── */
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, country, state, rate, isActive } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (rate == null || isNaN(Number(rate)) || Number(rate) < 0) {
      return NextResponse.json({ error: "Valid rate is required" }, { status: 400 });
    }

    const taxRate = await prisma.taxRate.create({
      data: {
        name: name.trim(),
        country: country?.trim() || "US",
        state: state?.trim() || null,
        rate: Number(rate),
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(
      {
        tax: {
          id: taxRate.id,
          name: taxRate.name,
          country: taxRate.country,
          state: taxRate.state,
          rate: Number(taxRate.rate),
          isActive: taxRate.isActive,
          createdAt: taxRate.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create tax rate";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
