import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStoreProducts, getProductVariants } from "@/lib/printful";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/printful/sync
 *
 * Fetches all Printful store products (with variants/pricing),
 * upserts them into PrintfulProduct & PrintfulVariant tables,
 * and returns the count of synced products.
 *
 * Protected: requires admin session (ADMIN role).
 */
export async function POST() {
  // ── Auth check ─────────────────────────────────────
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dsdc_session")?.value;

  if (!sessionCookie) {
    return NextResponse.json(
      { success: false, error: "Authentication required." },
      { status: 401 }
    );
  }

  const session = await verifyToken(sessionCookie);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Admin access required." },
      { status: 403 }
    );
  }

  // ── Fetch all Printful store products ─────────────
  try {
    let allProducts: Awaited<ReturnType<typeof getStoreProducts>>["result"] = [];
    let offset = 0;
    const limit = 50;
    let total = 0;

    // Paginate through all products
    do {
      const page = await getStoreProducts(offset, limit);
      allProducts = allProducts.concat(page.result);
      total = page.paging.total;
      offset += limit;
    } while (offset < total);

    // ── Upsert products one by one ──────────────────
    let syncedCount = 0;

    for (const sp of allProducts) {
      // Fetch full product details (includes variants with pricing)
      let variants: Awaited<ReturnType<typeof getProductVariants>>["result"]["sync_variants"] =
        [];

      try {
        const detail = await getProductVariants(sp.id);
        variants = detail.result.sync_variants ?? [];
      } catch (err) {
        console.warn(
          `[printful/sync] Could not fetch variants for product ${sp.id} (${sp.name}):`,
          (err as Error).message
        );
        // Continue without variants — still upsert the product
      }

      // Upsert the product
      await prisma.printfulProduct.upsert({
        where: { printfulId: String(sp.id) },
        update: {
          name: sp.name,
          thumbnailUrl: sp.thumbnail_url,
          variantCount: sp.variants,
          syncedAt: new Date(),
        },
        create: {
          id: sp.id,
          printfulId: String(sp.id),
          name: sp.name,
          thumbnailUrl: sp.thumbnail_url,
          variantCount: sp.variants,
        },
      });

      // Upsert variants
      for (const sv of variants) {
        const price =
          sv.retail_price !== null && sv.retail_price !== undefined
            ? parseFloat(sv.retail_price)
            : 0;

        await prisma.printfulVariant.upsert({
          where: { printfulId: String(sv.id) },
          update: {
            name: sv.name,
            size: sv.size,
            color: sv.color,
            price,
            syncedAt: new Date(),
          },
          create: {
            printfulId: String(sv.id),
            productId: String(sv.sync_product_id),
            name: sv.name,
            size: sv.size,
            color: sv.color,
            price,
          },
        });
      }

      syncedCount++;
    }

    return NextResponse.json(
      {
        success: true,
        syncedCount,
        totalProducts: allProducts.length,
        message: `Synced ${syncedCount} products from Printful.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[printful/sync] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          "Failed to sync Printful products: " +
          (error instanceof Error ? error.message : "Unknown error"),
      },
      { status: 500 }
    );
  }
}
