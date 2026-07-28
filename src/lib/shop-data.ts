import { prisma } from "@/lib/prisma";
import type { Product, ProductVariant, Review, Category } from "@prisma/client";

/* ── Types ───────────────────────────────────────────────── */

interface ShopProductVariant {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

interface ShopProductReview {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  verified: boolean;
  createdAt: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  inventory: number;
  images: string[];
  specifications: { label: string; value: string }[];
  compatibleVehicles: string[];
  isActive: boolean;
  isFeatured: boolean;
  category: {
    name: string;
    slug: string;
    parent: { name: string; slug: string } | null;
  };
  variants: ShopProductVariant[];
  reviews: ShopProductReview[];
  source: "database" | "printful";
}

export interface ShopProductCard {
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  category: { name: string; slug: string };
  images: string[];
  isFeatured: boolean;
  source: "database" | "printful";
}

/* ── Data fetchers ──────────────────────────────────────── */

export async function getProductBySlug(
  slug: string
): Promise<ShopProduct | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          include: {
            parent: { select: { name: true, slug: true } },
          },
        },
        variants: {
          select: { id: true, name: true, price: true, inventory: true },
        },
        reviews: {
          where: { published: true },
          select: {
            id: true,
            rating: true,
            title: true,
            body: true,
            authorName: true,
            verified: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) return null;

    return {
      ...product,
      price: parseFloat(product.price.toString()),
      salePrice: product.salePrice
        ? parseFloat(product.salePrice.toString())
        : null,
      images: Array.isArray(product.images) ? (product.images as string[]) : [],
      specifications: Array.isArray(product.specifications) ? (product.specifications as { label: string; value: string }[]) : [],
      compatibleVehicles: Array.isArray(product.compatibleVehicles) ? (product.compatibleVehicles as string[]) : [],
      variants: product.variants.map((v) => ({
        ...v,
        price: parseFloat(v.price.toString()),
      })),
      reviews: product.reviews.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
      source: "database" as const,
    };
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
}

export async function getRelatedProducts(
  categorySlug: string,
  currentSlug: string,
  source: string,
  limit: number = 4
): Promise<ShopProductCard[]> {
  try {
    if (source === "printful") return [];

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        slug: { not: currentSlug },
        category: { slug: categorySlug },
      },
      take: limit,
      include: {
        category: { select: { name: true, slug: true } },
      },
    });

    return products.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: parseFloat(p.price.toString()),
      salePrice: p.salePrice ? parseFloat(p.salePrice.toString()) : null,
      category: p.category,
      images: (p.images as string[]) || [],
      isFeatured: p.isFeatured,
      source: "database" as const,
    }));
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
}

/* ── Printful helpers ──────────────────────────────────── */

/** Classify a Printful product by name into apparel or accessories */
function categorizePrintful(name: string): { name: string; slug: string; parent: null } {
  const lower = name.toLowerCase();
  if (
    lower.includes("hat") ||
    lower.includes("cap") ||
    lower.includes("bag") ||
    lower.includes("backpack")
  ) {
    return { name: "Accessories", slug: "accessories", parent: null };
  }
  return { name: "Apparel", slug: "apparel", parent: null };
}

export async function hasPrintfulProducts(): Promise<boolean> {
  try {
    const count = await prisma.printfulProduct.count();
    return count > 0;
  } catch {
    return false;
  }
}

/**
 * Batch-fetch the minimum variant price for a list of Printful product IDs.
 * Returns a map of printfulId → minPriceInDollars.
 */
async function getMinPricesByPrintfulId(
  printfulIds: string[]
): Promise<Record<string, number>> {
  if (printfulIds.length === 0) return {};
  const priceMap: Record<string, number> = {};
  try {
    const variants = await prisma.printfulVariant.findMany({
      where: { productId: { in: printfulIds } },
      select: { productId: true, price: true },
    });
    for (const v of variants) {
      const current = priceMap[v.productId];
      if (current === undefined || v.price < current) {
        priceMap[v.productId] = v.price;
      }
    }
  } catch (error) {
    console.error("Failed to fetch Printful variant prices:", error);
  }
  return priceMap;
}

export async function getAllPrintfulProducts(): Promise<ShopProductCard[]> {
  try {
    const products = await prisma.printfulProduct.findMany({
      orderBy: { name: "asc" },
    });

    const ids = products.map((p) => p.printfulId);
    const priceMap = await getMinPricesByPrintfulId(ids);

    return products.map((p) => ({
      slug: `printful-${p.printfulId}`,
      name: p.name,
      price: priceMap[p.printfulId] ?? 29.99,
      salePrice: null,
      category: categorizePrintful(p.name),
      images: p.thumbnailUrl ? [p.thumbnailUrl] : [],
      isFeatured: false,
      source: "printful" as const,
    }));
  } catch (error) {
    console.error("Failed to fetch Printful products:", error);
    return [];
  }
}

export async function getPrintfulProductsByCategory(
  category: string
): Promise<ShopProductCard[]> {
  try {
    const products = await prisma.printfulProduct.findMany({
      orderBy: { name: "asc" },
    });

    const ids = products.map((p) => p.printfulId);
    const priceMap = await getMinPricesByPrintfulId(ids);

    return products
      .map((p) => ({
        slug: `printful-${p.printfulId}`,
        name: p.name,
        price: priceMap[p.printfulId] ?? 29.99,
        salePrice: null,
        category: categorizePrintful(p.name),
        images: p.thumbnailUrl ? [p.thumbnailUrl] : [],
        isFeatured: false,
        source: "printful" as const,
      }))
      .filter((p) => p.category.slug === category);
  } catch (error) {
    console.error("Failed to fetch Printful products by category:", error);
    return [];
  }
}

export async function getPrintfulProductBySlug(
  slug: string
): Promise<ShopProduct | null> {
  try {
    // Parse the printful-<id> slug format used by existing stubs
    if (!slug.startsWith("printful-")) return null;
    const printfulId = slug.slice("printful-".length);

    const product = await prisma.printfulProduct.findUnique({
      where: { printfulId },
    });

    if (!product) return null;

    // Fetch variants for this Printful product
    const variants = await prisma.printfulVariant.findMany({
      where: { productId: printfulId },
    });

    // Map variants to ShopProductVariant format
    const mappedVariants: ShopProductVariant[] = variants.map((v) => ({
      id: String(v.id),
      name: v.name || `${v.size ?? ""} / ${v.color ?? ""}`.trim() || "Default",
      price: v.price,
      inventory: 999, // Printful manages stock externally
    }));

    // Use min variant price as base, or fallback
    const basePrice =
      variants.length > 0
        ? Math.min(...variants.map((v) => v.price))
        : 29.99;

    const totalInventory = variants.length > 0 ? variants.length * 999 : 999;

    return {
      id: `printful-${product.printfulId}`,
      name: product.name,
      slug,
      sku: product.printfulId,
      description: `${product.name} — premium print-on-demand apparel from Dream Star Drivers Club. Each piece is printed to order with high-quality materials.`,
      price: basePrice,
      salePrice: null,
      inventory: totalInventory,
      images: product.thumbnailUrl ? [product.thumbnailUrl] : [],
      specifications: [],
      compatibleVehicles: [],
      isActive: true,
      isFeatured: false,
      category: categorizePrintful(product.name),
      variants: mappedVariants,
      reviews: [],
      source: "printful" as const,
    };
  } catch (error) {
    console.error("Failed to fetch Printful product by slug:", error);
    return null;
  }
}

export async function getPrintfulFeaturedProducts(): Promise<ShopProductCard[]> {
  try {
    const products = await prisma.printfulProduct.findMany({
      take: 6,
      orderBy: { syncedAt: "desc" },
    });

    const ids = products.map((p) => p.printfulId);
    const priceMap = await getMinPricesByPrintfulId(ids);

    return products.map((p) => ({
      slug: `printful-${p.printfulId}`,
      name: p.name,
      price: priceMap[p.printfulId] ?? 29.99,
      salePrice: null,
      category: categorizePrintful(p.name),
      images: p.thumbnailUrl ? [p.thumbnailUrl] : [],
      isFeatured: true,
      source: "printful" as const,
    }));
  } catch {
    return [];
  }
}
