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

/* ── GET all zones with rates ───────────────────────────── */
export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const zones = await prisma.shippingZone.findMany({
      include: { rates: true },
      orderBy: { createdAt: "desc" },
    });

    const data = zones.map((z) => ({
      id: z.id,
      name: z.name,
      countries: z.countries,
      isActive: z.isActive,
      createdAt: z.createdAt.toISOString(),
      rates: z.rates.map((r) => ({
        id: r.id,
        zoneId: r.zoneId,
        name: r.name,
        rate: Number(r.rate),
        minOrder: r.minOrder ? Number(r.minOrder) : null,
        estimatedDays: r.estimatedDays,
        isActive: r.isActive,
      })),
    }));

    return NextResponse.json({ zones: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch zones";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── POST create zone ───────────────────────────────────── */
export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, countries, isActive } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const zone = await prisma.shippingZone.create({
      data: {
        name: name.trim(),
        countries: countries ?? [],
        isActive: isActive ?? true,
      },
      include: { rates: true },
    });

    return NextResponse.json(
      {
        zone: {
          id: zone.id,
          name: zone.name,
          countries: zone.countries,
          isActive: zone.isActive,
          createdAt: zone.createdAt.toISOString(),
          rates: [],
        },
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create zone";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
