"use client";

import Link from "next/link";
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
        {/* Empty state icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.08] bg-ds-black-charcoal">
          <svg
            className="h-10 w-10 text-ds-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>
        <p className="text-lg font-semibold text-ds-gray-300">
          {emptyMessage}
        </p>
        <p className="mt-2 text-sm text-ds-gray-500">
          Try adjusting your filters or browsing our full catalog.
        </p>
        <Link
          href="/shop/all"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ds-red px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-ds-red-700"
        >
          Browse All Products
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
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
