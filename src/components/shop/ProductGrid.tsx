import { ProductCard } from "./ProductCard";

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
  emptyMessage?: string;
  badgeVariant?: "red" | "gold" | "gray" | "outline";
}

export function ProductGrid({
  products,
  emptyMessage = "No products found.",
  badgeVariant = "red",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Empty state with Hoshi */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-ds-red/20 bg-ds-black-charcoal shadow-brand-glow-sm">
          <img
            src="/hoshi-searching.png"
            alt="Hoshi searching"
            className="h-12 w-12 object-contain"
            loading="lazy"
          />
        </div>
        <h3 className="font-display text-xl font-bold text-ds-white">
          Nothing Here Yet
        </h3>
        <p className="mt-2 text-ds-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          badgeVariant={badgeVariant}
        />
      ))}
    </div>
  );
}
