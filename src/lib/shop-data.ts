import { prisma } from "@/lib/prisma";
import type { Product, ProductVariant, Review, Category, User } from "@prisma/client";

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
  body: string | null;
  user: {
    firstName: string;
  };
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
          where: { isApproved: true },
          select: {
            id: true,
            rating: true,
            title: true,
            body: true,
            user: { select: { firstName: true } },
          },
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
      images: product.images as string[],
      specifications: product.specifications as { label: string; value: string }[],
      compatibleVehicles: product.compatibleVehicles as string[],
      variants: product.variants.map((v) => ({
        ...v,
        price: parseFloat(v.price.toString()),
      })),
      reviews: product.reviews,
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

/* ── Printful stubs ─────────────────────────────────────── */

export async function hasPrintfulProducts(): Promise<boolean> {
  try {
    const count = await prisma.printfulProduct.count();
    return count > 0;
  } catch {
    return false;
  }
}

export async function getAllPrintfulProducts(): Promise<ShopProductCard[]> {
  try {
    const products = await prisma.printfulProduct.findMany({
      orderBy: { name: "asc" },
    });

    return products.map((p) => ({
      slug: `printful-${p.printfulId}`,
      name: p.name,
      price: 29.99, // Default price, would come from variant
      salePrice: null,
      category: { name: "Apparel", slug: "apparel" },
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

    // Simple category mapping — in production this would come from Printful metadata
    return products.map((p) => ({
      slug: `printful-${p.printfulId}`,
      name: p.name,
      price: 29.99,
      salePrice: null,
      category: { name: category === "accessories" ? "Accessories" : "Apparel", slug: category },
      images: p.thumbnailUrl ? [p.thumbnailUrl] : [],
      isFeatured: false,
      source: "printful" as const,
    }));
  } catch (error) {
    console.error("Failed to fetch Printful products by category:", error);
    return [];
  }
}
