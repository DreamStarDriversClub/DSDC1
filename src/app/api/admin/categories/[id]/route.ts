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

/* ── PUT update category ─────────────────────────────────── */

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
    const { name, slug, description, parentId } = body;

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description: description ?? null,
        parentId: parentId || null,
      },
    });

    return NextResponse.json({ category });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update category";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── DELETE category ─────────────────────────────────────── */

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    // Check for existing products
    const productCount = await prisma.product.count({
      where: { categoryId: params.id },
    });

    if (productCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${productCount} existing products` },
        { status: 400 }
      );
    }

    // Also check child categories with products
    const childCategories = await prisma.category.findMany({
      where: { parentId: params.id },
      select: { id: true },
    });
    const childIds = childCategories.map((c) => c.id);
    if (childIds.length > 0) {
      const childProductCount = await prisma.product.count({
        where: { categoryId: { in: childIds } },
      });
      if (childProductCount > 0) {
        return NextResponse.json(
          { error: `Cannot delete category: subcategories have ${childProductCount} existing products` },
          { status: 400 }
        );
      }
      // Delete child categories first
      await prisma.category.deleteMany({ where: { parentId: params.id } });
    }

    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Category not found";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}
