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

/* ── GET single product (for edit form) ──────────────────── */

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...product,
      price: Number(product.price),
      salePrice: product.salePrice ? Number(product.salePrice) : null,
      cost: product.cost ? Number(product.cost) : null,
      weight: product.weight ? Number(product.weight) : null,
      variants: product.variants.map((v) => ({
        ...v,
        price: Number(v.price),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

/* ── PUT update product ──────────────────────────────────── */

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      price,
      salePrice,
      cost,
      inventory,
      weight,
      dimensions,
      images,
      specifications,
      compatibleVehicles,
      isActive,
      isFeatured,
      categoryId,
      variants,
    } = body;

    // Delete existing variants and recreate
    await prisma.productVariant.deleteMany({ where: { productId: params.id } });

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        sku,
        description,
        price,
        salePrice: salePrice ?? null,
        cost: cost ?? null,
        inventory: inventory ?? 0,
        weight: weight ?? null,
        dimensions: dimensions ?? null,
        images: images ?? [],
        specifications: specifications ?? [],
        compatibleVehicles: compatibleVehicles ?? [],
        isActive: isActive ?? true,
        isFeatured: isFeatured ?? false,
        categoryId,
        variants: variants && variants.length > 0
          ? {
              create: variants.map((v: { name: string; sku: string; price: number; inventory: number }) => ({
                name: v.name,
                sku: v.sku,
                price: v.price,
                inventory: v.inventory ?? 0,
              })),
            }
          : undefined,
      },
      include: { category: true, variants: true },
    });

    return NextResponse.json({ product });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── DELETE product ──────────────────────────────────────── */

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await prisma.product.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
}
