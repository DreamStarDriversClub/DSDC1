"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatPrice, productGradient } from "@/lib/utils";
import { toWebpPath } from "@/lib/images";
import { WishlistHeart } from "@/components/shop/WishlistHeart";
import { useQuickView } from "@/components/shop/QuickViewProvider";

interface ProductCardData {
  slug: string;
  name: string;
  price: number | { toString(): string };
  salePrice?: number | { toString(): string } | null;
  category?: { name: string; slug: string } | null;
  images?: unknown;
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: ProductCardData;
  badgeVariant?: "red" | "gold" | "gray" | "outline";
  priority?: boolean;
}

export function ProductCard({ product, badgeVariant = "red", priority }: ProductCardProps) {
  const { openQuickView } = useQuickView();
  const price = typeof product.price === "number" ? product.price : parseFloat(product.price.toString());
  const salePrice = product.salePrice
    ? typeof product.salePrice === "number"
      ? product.salePrice
      : parseFloat(product.salePrice.toString())
    : null;
  const gradient = productGradient(product.slug);

  // Determine product icon based on category
  const isApparel = product.category?.slug?.startsWith("apparel");
  const isAccessories = product.category?.slug?.startsWith("acc") || product.category?.slug === "accessories";
  const isPerformance = product.category?.slug?.startsWith("perf") || product.category?.slug === "ds-performance";

  // Extract first image if available.
  // The DB stores images as a JSON column; Prisma may return it as a
  // JSON-encoded string (from seed) or a parsed array — handle both.
  const rawImages = product.images;
  let images: string[] = [];
  if (Array.isArray(rawImages)) {
    images = rawImages as string[];
  } else if (typeof rawImages === "string") {
    try { images = JSON.parse(rawImages); } catch { /* keep empty */ }
  }
  const productImage = images.length > 0 ? images[0] : null;

  return (
    <div
      className="group block"
      style={{ perspective: "800px" }}
    >
      <Card
        hover
        padding="none"
        className="overflow-hidden transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:shadow-card-hover group-hover:border-ds-red/20 group-hover:-translate-y-1"
      >
        {/* Product image — links to PDP */}
        <Link
          href={`/shop/${product.slug}`}
          className={`relative flex h-56 items-center justify-center ${gradient} overflow-hidden block`}
        >
          {/* Actual product image or fallback SVG icon */}
          {productImage ? (
            <>
              <Image
                src={toWebpPath(productImage)}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                loading={priority ? "eager" : "lazy"}
                priority={priority}
                quality={85}
              />
              {/* Red glow vignette on hover */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ds-red/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.05]" />
              <div className="relative z-10 transition-transform duration-400 ease-out group-hover:scale-[1.05]">
                {isPerformance ? (
                  <svg className="h-10 w-10 text-ds-red/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                  </svg>
                ) : isAccessories ? (
                  <svg className="h-10 w-10 text-ds-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                ) : (
                  <svg className="h-10 w-10 text-ds-red/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                )}
              </div>
            </>
          )}
          {/* Subtle gradient overlay when image is shown */}
          {productImage && (
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ds-black/60 to-transparent" />
          )}
          {/* Quick View button — appears on hover */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView(product);
            }}
            className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-400 ease-out group-hover:translate-y-0"
          >
            <div className="flex items-center justify-center bg-ds-black/80 backdrop-blur-sm py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-ds-white">
                Quick View
              </span>
            </div>
          </button>
          {/* Sale badge */}
          {salePrice && (
            <div className="absolute left-3 top-3">
              <Badge variant="red" size="sm">Sale</Badge>
            </div>
          )}
          {/* Wishlist heart */}
          <div
            className="absolute right-3 top-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <WishlistHeart
              productId={product.slug}
              productName={product.name}
              productImage={productImage || ""}
              productPrice={Math.round(price * 100)}
              productCategory={product.category?.slug || ""}
            />
          </div>
        </Link>

        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            {product.category && (
              <Badge variant={badgeVariant} size="sm">
                {product.category.name}
              </Badge>
            )}
            {product.isFeatured && (
              <Badge variant="gold" size="sm">Featured</Badge>
            )}
          </div>
          <Link
            href={`/shop/${product.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="font-display text-sm font-bold text-ds-white transition-colors hover:text-ds-red"
          >
            {product.name}
          </Link>
          <div className="mt-2 flex items-center gap-2">
            {salePrice ? (
              <>
                <p className="text-lg font-bold text-ds-red">{formatPrice(salePrice)}</p>
                <p className="text-sm text-ds-gray-400 line-through">{formatPrice(price)}</p>
              </>
            ) : (
              <p className="text-lg font-bold text-ds-white">{formatPrice(price)}</p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
