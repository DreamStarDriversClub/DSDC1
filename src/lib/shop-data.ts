/**
 * Shared data access functions for shop pages.
 *
 * Bridges Printful-synced products into the existing ProductCard/ProductGrid
 * display format so shop pages can pull from PrintfulProduct/PrintfulVariant
 * tables instead of hardcoded data.
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

// ── Helpers ────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Determine category from product name using keyword heuristics */
function getCategory(name: string): { name: string; slug: string } {
  const lower = name.toLowerCase();
  if (lower.includes("hat") || lower.includes("cap")) {
    return { name: "Accessories", slug: "accessories" };
  }
  if (
    lower.includes("tee") ||
    lower.includes("hoodie") ||
    lower.includes("shirt") ||
    lower.includes("jacket") ||
    lower.includes("windbreaker") ||
    lower.includes("sweatshirt") ||
    lower.includes("tank") ||
    lower.includes("crewneck")
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
 * Matches variants to products by name (variant.productId is unreliable).
 */
export async function getAllPrintfulProducts(): Promise<ShopProduct[]> {
  const products = await prisma.printfulProduct.findMany({
    orderBy: { name: "asc" },
  });

  if (products.length === 0) return [];

  // Fetch all variants separately since variant.productId is unreliable
  const allVariants = await prisma.printfulVariant.findMany();

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
    // Use the category slug so clicking links to the category page
    const slug = category.slug;

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
 */
export async function hasPrintfulProducts(): Promise<boolean> {
  const count = await prisma.printfulProduct.count();
  return count > 0;
}
