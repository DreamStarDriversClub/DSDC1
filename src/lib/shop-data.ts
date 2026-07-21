/**
 * Shared data access functions for shop pages.
 *
 * Bridges Printful-synced products into the existing ProductCard/ProductGrid
 * display format so shop pages can pull from PrintfulProduct/PrintfulVariant
 * tables instead of hardcoded data.
 *
 * Also provides unified product-detail lookup that handles both
 * regular DB products and Printful products via getProductBySlug().
 */

import { prisma } from "./prisma";
import { productGradient } from "./utils";
import React from "react";

// ── Types ──────────────────────────────────────────────

/** Format compatible with ProductCard and ProductGrid components */
export interface ShopProduct {
  slug: string;
  name: string;
  price: number;
  salePrice: null;
  category: { name: string; slug: string };
  images?: { thumbnailUrl: string } | null;
  isFeatured: boolean;
}

/** Format compatible with the homepage ProductHighlights carousel */
export interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryBadge: "red" | "gold";
  gradient: string;
  icon: React.ReactNode;
}

/** Unified variant for product detail pages (DB + Printful) */
export interface ProductDetailVariant {
  id: string;
  name: string;
  size: string | null;
  color: string | null;
  price: number;
  inventory: number;
  sku?: string;
}

/** Unified product detail (DB or Printful) */
export interface ProductDetail {
  source: "db" | "printful";
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  salePrice: number | null;
  images: string[];
  category: {
    name: string;
    slug: string;
    parentId?: string | null;
    parent?: { name: string; slug: string } | null;
  };
  variants: ProductDetailVariant[];
  sku: string;
  inventory: number;
  specifications: { label: string; value: string }[];
  compatibleVehicles: string[];
  isActive: boolean;
  reviews: {
    id: string;
    rating: number;
    title: string | null;
    body: string | null;
    createdAt: Date;
    user: { firstName: string };
  }[];
  // Printful-specific
  thumbnailUrl?: string | null;
}

// ── Helpers ────────────────────────────────────────────

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Determine category from product name using keyword heuristics */
function getCategory(name: string): { name: string; slug: string } {
  const lower = name.toLowerCase();

  // Accessories: hats, caps, bags
  if (
    lower.includes("hat") ||
    lower.includes("cap") ||
    lower.includes("bag")
  ) {
    return { name: "Accessories", slug: "accessories" };
  }

  // Apparel: all clothing types
  if (
    lower.includes("tee") ||
    lower.includes("hoodie") ||
    lower.includes("shirt") ||
    lower.includes("jacket") ||
    lower.includes("windbreaker") ||
    lower.includes("sweatshirt") ||
    lower.includes("tank") ||
    lower.includes("crewneck") ||
    lower.includes("jogger") ||
    lower.includes("longsleeve") ||
    lower.includes("long sleeve") ||
    lower.includes("pant") ||
    lower.includes("fleece") ||
    lower.includes("pullover") ||
    lower.includes("zip") ||
    lower.includes("polo")
  ) {
    return { name: "Apparel", slug: "apparel" };
  }

  return { name: "Apparel", slug: "apparel" }; // default
}

function getCategoryBadge(
  name: string,
): "red" | "gold" {
  return getCategory(name).slug === "accessories" ? "gold" : "red";
}

// ── SVG Icons ──────────────────────────────────────────

function AccessoriesIcon() {
  return React.createElement(
    "svg",
    {
      className: "h-8 w-8 text-ds-gold/40",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 1,
    },
    React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z",
    }),
    React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M6 6h.008v.008H6V6z",
    }),
  );
}

function ApparelIcon() {
  return React.createElement(
    "svg",
    {
      className: "h-8 w-8 text-ds-red/40",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      strokeWidth: 1,
    },
    React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
    }),
  );
}

function iconForName(name: string): React.ReactNode {
  const cat = getCategory(name);
  return cat.slug === "accessories"
    ? React.createElement(AccessoriesIcon)
    : React.createElement(ApparelIcon);
}

// ── Core Queries ───────────────────────────────────────

/**
 * Fetch all Printful products with their variants.
 * Each Printful product now gets a unique slug (pf- prefix) so
 * product cards link to individual detail pages instead of category pages.
 */
export async function getAllPrintfulProducts(): Promise<ShopProduct[]> {
  let products: { name: string; printfulId: string; thumbnailUrl: string | null }[];
  let allVariants: { productId: string; name: string; price: number; size: string | null; color: string | null; printfulId: string }[] = [];
  try {
    products = await prisma.printfulProduct.findMany({
      orderBy: { name: "asc" },
    });
    if (products.length === 0) return [];
    // Fetch all variants separately since variant.productId is unreliable
    allVariants = await prisma.printfulVariant.findMany();
  } catch {
    // Tables may not exist yet — return empty gracefully
    return [];
  }

  return products.map((product) => {
    // Match variants: try printfulId first, fall back to name
    const productVariants = allVariants.filter(
      (v) =>
        v.productId === product.printfulId ||
        v.name.toLowerCase().includes(product.name.toLowerCase()) ||
        product.name.toLowerCase().includes(v.name.toLowerCase()),
    );

    const lowestPrice =
      productVariants.length > 0
        ? Math.min(...productVariants.map((v) => v.price))
        : 0;

    const category = getCategory(product.name);
    // Unique slug per Printful product so each gets its own detail page
    const slug = "pf-" + slugify(product.name);

    return {
      slug,
      name: product.name,
      price: lowestPrice,
      salePrice: null,
      category,
      images: product.thumbnailUrl
        ? { thumbnailUrl: product.thumbnailUrl }
        : null,
      isFeatured: false,
    };
  });
}

/**
 * Get Printful products filtered by category keyword.
 */
export async function getPrintfulProductsByCategory(
  category: string,
): Promise<ShopProduct[]> {
  const all = await getAllPrintfulProducts();
  const lower = category.toLowerCase();
  return all.filter((p) => p.category.slug === lower);
}

/**
 * Get Printful products formatted for the homepage
 * ProductHighlights carousel and New Arrivals section.
 */
export async function getPrintfulFeaturedProducts(): Promise<
  FeaturedProduct[]
> {
  const products = await getAllPrintfulProducts();
  return products.map((p) => ({
    id: `pf-${slugify(p.name)}`,
    name: p.name,
    price: p.price,
    category: p.category.name,
    categoryBadge: getCategoryBadge(p.name),
    gradient: productGradient(`pf-${slugify(p.name)}`),
    icon: iconForName(p.name),
  }));
}

/**
 * Check whether any Printful products exist in the database.
 * Gracefully returns false if the Printful tables don't exist (e.g. in production
 * before the Printful sync migration has run).
 */
export async function hasPrintfulProducts(): Promise<boolean> {
  try {
    const count = await prisma.printfulProduct.count();
    return count > 0;
  } catch {
    // Table may not exist yet — that's fine, just no Printful products available
    return false;
  }
}

// ── Product Detail (Unified: DB + Printful) ────────────

/**
 * Look up a single product by slug for the product detail page.
 * Tries the regular Product table first; if not found, checks
 * Printful products (slugs prefixed with "pf-").
 */
export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  // 1. Try regular DB product
  const dbProduct = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: {
        select: {
          name: true,
          slug: true,
          parentId: true,
          parent: { select: { name: true, slug: true } },
        },
      },
      variants: { orderBy: { name: "asc" } },
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { firstName: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (dbProduct && dbProduct.isActive) {
    const dbVariants: ProductDetailVariant[] = dbProduct.variants.map((v) => {
      const parts = v.name.split(" / ");
      return {
        id: v.id,
        name: v.name,
        size: parts[0]?.trim() || null,
        color: parts[1]?.trim() || null,
        price: parseFloat(v.price.toString()),
        inventory: v.inventory,
        sku: v.sku,
      };
    });

    return {
      source: "db",
      id: dbProduct.id,
      slug: dbProduct.slug,
      name: dbProduct.name,
      description: dbProduct.description,
      price: parseFloat(dbProduct.price.toString()),
      salePrice: dbProduct.salePrice
        ? parseFloat(dbProduct.salePrice.toString())
        : null,
      images: (dbProduct.images as string[]) || [],
      category: dbProduct.category,
      variants: dbVariants,
      sku: dbProduct.sku,
      inventory: dbProduct.inventory,
      specifications:
        (dbProduct.specifications as { label: string; value: string }[]) || [],
      compatibleVehicles:
        (dbProduct.compatibleVehicles as string[]) || [],
      isActive: dbProduct.isActive,
      reviews: dbProduct.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        createdAt: r.createdAt,
        user: { firstName: r.user.firstName },
      })),
    };
  }

  // 2. Try Printful product (slugs start with "pf-")
  if (slug.startsWith("pf-")) {
    try {
      const nameSlug = slug.replace("pf-", "");

      // Find the Printful product whose slugified name matches
      const pfProducts = await prisma.printfulProduct.findMany();
      const pfProduct = pfProducts.find(
        (p) => slugify(p.name) === nameSlug,
      );

      if (pfProduct) {
        const pfVariants = await prisma.printfulVariant.findMany({
          where: { productId: pfProduct.printfulId },
        });

      const category = getCategory(pfProduct.name);

      const variants: ProductDetailVariant[] = pfVariants.map((v) => ({
        id: v.printfulId,
        name: v.name,
        size: v.size,
        color: v.color,
        price: v.price,
        inventory: 999, // print-on-demand, effectively unlimited
      }));

      const lowestPrice =
        variants.length > 0
          ? Math.min(...variants.map((v) => v.price))
          : 0;

      return {
        source: "printful",
        id: `pf-${pfProduct.id}`,
        slug,
        name: pfProduct.name,
        description: `Premium ${pfProduct.name} from Dream Star Drivers Club. High-quality print-on-demand apparel for the true JDM enthusiast. Designed with passion, worn with pride.`,
        price: lowestPrice,
        salePrice: null,
        images: pfProduct.thumbnailUrl ? [pfProduct.thumbnailUrl] : [],
        category: {
          name: category.name,
          slug: category.slug,
        },
        variants,
        sku: pfProduct.printfulId,
        inventory: 999,
        specifications: [],
        compatibleVehicles: [],
        isActive: true,
        reviews: [],
        thumbnailUrl: pfProduct.thumbnailUrl,
      };
      }
    } catch {
      // Printful tables may not exist yet — just fall through to null
    }
  }

  return null;
}

/**
 * Get related products for the "You Might Also Like" section.
 * Handles both DB and Printful product sources.
 */
export async function getRelatedProducts(
  categorySlug: string,
  excludeSlug: string,
  source: "db" | "printful",
  limit = 4,
): Promise<ShopProduct[]> {
  if (source === "db") {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug: categorySlug },
        slug: { not: excludeSlug },
      },
      include: {
        category: { select: { name: true, slug: true } },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return products.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: parseFloat(p.price.toString()),
      salePrice: p.salePrice ? parseFloat(p.salePrice.toString()) : null,
      category: p.category,
      isFeatured: p.isFeatured,
    })) as ShopProduct[];
  }

  // Printful: get same-category products, excluding current
  const all = await getAllPrintfulProducts();
  return all
    .filter((p) => p.category.slug === categorySlug && p.slug !== excludeSlug)
    .slice(0, limit);
}
