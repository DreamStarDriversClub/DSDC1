"use client";

import { ProductCard } from "@/components/shop/ProductCard";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { AnimDelay } from "@/lib/animations";

interface ProductGridProduct {
  slug: string;
  name: string;
  price: number | { toString(): string };
  salePrice?: number | { toString(): string } | null;
  category?: { name: string; slug: string } | null;
  images?: unknown;
  isFeatured?: boolean;
}

interface ProductGridProps {
  products: ProductGridProduct[];
  badgeVariant?: "red" | "gold" | "gray" | "outline";
  emptyMessage?: string;
}

/* Stagger delays for grid items — cycles for large grids */
const STAGGER_DELAYS: AnimDelay[] = [
  "delay-0",
  "delay-75",
  "delay-100",
  "delay-150",
  "delay-200",
  "delay-300",
  "delay-400",
  "delay-500",
];

export function ProductGrid({
  products,
  badgeVariant = "red",
  emptyMessage = "No products found.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-ds-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ScrollReveal
          key={product.slug}
          variant="fade-up"
          delay={STAGGER_DELAYS[index % STAGGER_DELAYS.length]}
          threshold={0.05}
        >
          <ProductCard product={product} badgeVariant={badgeVariant} />
        </ScrollReveal>
      ))}
    </div>
  );
}
