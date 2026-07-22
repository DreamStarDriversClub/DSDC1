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

const LOW_STOCK_THRESHOLD = 5;

/* ── GET inventory / low-stock ────────────────────────────── */
export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const lowStock = searchParams.get("lowStock") === "true";
    const search = searchParams.get("search") ?? "";

    const where: Record<string, unknown> = {};

    if (lowStock) {
      where.inventory = { lte: LOW_STOCK_THRESHOLD };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        {
          variants: {
            some: {
              sku: { contains: search, mode: "insensitive" },
            },
          },
        },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { inventory: "asc" },
      include: {
        variants: {
          select: { id: true, name: true, sku: true, price: true },
        },
        category: { select: { id: true, name: true } },
      },
    });

    const data = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      inventory: p.inventory,
      category: p.category?.name ?? "—",
      isLowStock: p.inventory <= LOW_STOCK_THRESHOLD,
      variants: p.variants.map((v) => ({
        id: v.id,
        name: v.name,
        sku: v.sku,
        price: Number(v.price),
      })),
    }));

    const lowStockCount = await prisma.product.count({
      where: { inventory: { lte: LOW_STOCK_THRESHOLD } },
    });

    return NextResponse.json({ items: data, lowStockCount });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch inventory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── PATCH update stock ──────────────────────────────────── */
export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { productId, inventory } = body;

    if (!productId || typeof inventory !== "number" || inventory < 0) {
      return NextResponse.json(
        { error: "productId and valid inventory count required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: { inventory },
    });

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        inventory: product.inventory,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update inventory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
