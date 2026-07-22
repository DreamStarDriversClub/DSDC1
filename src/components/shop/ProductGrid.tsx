import { ProductCard } from "@/components/shop/ProductCard";

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
