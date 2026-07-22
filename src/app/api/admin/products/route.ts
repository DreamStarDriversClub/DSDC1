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

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        variants: { select: { id: true, inventory: true } },
      },
    }),
    prisma.product.count(),
  ]);

  const data = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    category: p.category?.name ?? "Uncategorized",
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    inventory: p.inventory,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    variantCount: p.variants.length,
    createdAt: p.createdAt.toISOString(),
  }));

  return NextResponse.json({
    products: data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(request: Request) {
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

    // Validate required
    if (!name || !slug || !sku || !description || price === undefined || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields: name, slug, sku, description, price, categoryId" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
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

    return NextResponse.json({ product }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
