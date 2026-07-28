"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuickView, type QuickViewProduct, type QuickViewVariant } from "@/components/shop/QuickViewProvider";
import { useCart } from "@/lib/cart-context";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice, productGradient } from "@/lib/utils";
import { toWebpPath } from "@/lib/images";

/* ── Image extraction helper ─────────────────────────────── */

function extractImages(product: QuickViewProduct): string[] {
  const raw = product.images;
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      /* empty */
    }
  }
  return [];
}

/* ── QuickViewModal ──────────────────────────────────────── */

export function QuickViewModal() {
  const { isOpen, product, closeQuickView } = useQuickView();
  const { addItem } = useCart();
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Open/close lifecycle with animation ──────────────── */

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setSelectedVariant("");
      setQuantity(1);
      setAdded(false);
      // Trigger enter animation on next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimating(true));
      });
      document.body.style.overflow = "hidden";
    } else {
      setAnimating(false);
      document.body.style.overflow = "";
      const timeout = setTimeout(() => setVisible(false), 350);
      return () => clearTimeout(timeout);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ── Escape key ────────────────────────────────────────── */

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    },
    [closeQuickView]
  );

  useEffect(() => {
    if (visible) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [visible, handleKeyDown]);

  /* ── Derive product details ────────────────────────────── */

  if (!product || !visible) return null;

  const images = extractImages(product);
  const productImage = images.length > 0 ? images[0] : null;
  const price =
    typeof product.price === "number"
      ? product.price
      : parseFloat((product.price as { toString(): string }).toString());
  const salePrice = product.salePrice
    ? typeof product.salePrice === "number"
      ? product.salePrice
      : parseFloat((product.salePrice as { toString(): string }).toString())
    : null;
  const gradient = productGradient(product.slug);

  const variants: QuickViewVariant[] = product.variants ?? [];

  // Determine current variant price
  const currentVariant = variants.find((v) => v.id === selectedVariant);
  const variantPrice = currentVariant?.price;
  const displayPrice = variantPrice ?? salePrice ?? price;

  const isApparel = product.category?.slug?.startsWith("apparel");
  const isAccessories = product.category?.slug?.startsWith("acc");
  const isPerformance = product.category?.slug?.startsWith("perf");

  /* ── Add to cart ───────────────────────────────────────── */

  const isOutOfStock =
    currentVariant !== undefined && currentVariant.inventory <= 0;

  const handleAddToCart = useCallback(() => {
    if (isOutOfStock) return;
    addItem({
      id: `${product.slug}-${selectedVariant || "default"}-${Date.now()}`,
      productId: product.slug,
      variantId: selectedVariant || undefined,
      name: product.name,
      slug: product.slug,
      sku: product.slug,
      price: displayPrice,
      quantity,
      variantName: currentVariant?.name,
      image: productImage || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, [
    isOutOfStock,
    addItem,
    product,
    selectedVariant,
    displayPrice,
    quantity,
    currentVariant,
    productImage,
  ]);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          animating ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeQuickView}
      />

      {/* Modal panel */}
      <div
        ref={panelRef}
        className={`relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/[0.08] bg-ds-black-elevated shadow-2xl shadow-ds-red/5 transition-all duration-300 ease-out ${
          animating
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        {/* Close button */}
        <button
          onClick={closeQuickView}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-ds-black/60 text-ds-gray-300 backdrop-blur-sm transition-colors hover:bg-ds-red/80 hover:text-ds-white"
          aria-label="Close quick view"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row">
          {/* Left: Image */}
          <div className="relative h-64 w-full flex-shrink-0 md:h-auto md:w-1/2">
            {productImage ? (
              <>
                <Image
                  src={toWebpPath(productImage)}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  quality={85}
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-ds-black/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-ds-black/20" />
              </>
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center ${gradient}`}
              >
                {isPerformance ? (
                  <svg
                    className="h-16 w-16 text-ds-red/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
                    />
                  </svg>
                ) : isAccessories ? (
                  <svg
                    className="h-16 w-16 text-ds-gold/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6h.008v.008H6V6z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-16 w-16 text-ds-red/30"
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
                )}
              </div>
            )}

            {/* Sale badge on image */}
            {salePrice && (
              <div className="absolute left-4 top-4 z-10">
                <Badge variant="red" size="sm">
                  Sale
                </Badge>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="flex flex-1 flex-col p-6">
            {/* Category badge */}
            {product.category && (
              <div className="mb-2">
                <Badge
                  variant={
                    product.category.slug.startsWith("acc") ? "gold" : "red"
                  }
                  size="sm"
                >
                  {product.category.name}
                </Badge>
              </div>
            )}

            {/* Product name */}
            <h2 className="font-display text-xl font-bold tracking-tight text-ds-white sm:text-2xl">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-ds-red">
                {formatPrice(displayPrice)}
              </span>
              {salePrice && (
                <span className="text-sm text-ds-gray-400 line-through">
                  {formatPrice(price)}
                </span>
              )}
            </div>

            <div className="mt-4 h-px bg-white/[0.06]" />

            {/* Variant selector */}
            {variants.length > 0 && (
              <div className="mt-4">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                  {isApparel ? "Size" : "Option"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v.id)}
                      className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                        selectedVariant === v.id
                          ? "border-ds-red/50 bg-ds-red/10 text-ds-red"
                          : "border-white/[0.08] bg-ds-black text-ds-gray-300 hover:border-white/[0.15]"
                      } ${
                        v.inventory <= 0
                          ? "cursor-not-allowed opacity-40"
                          : ""
                      }`}
                      disabled={v.inventory <= 0}
                    >
                      {v.name}
                      {v.inventory <= 0 && (
                        <span className="ml-1 text-[10px]">(Sold out)</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity selector */}
            <div className="mt-4">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                Quantity
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-ds-gray-400 transition-colors hover:border-ds-red/30 hover:text-ds-white"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex h-9 w-11 items-center justify-center rounded-lg border border-white/[0.08] bg-ds-black text-sm font-semibold text-ds-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-ds-gray-400 transition-colors hover:border-ds-red/30 hover:text-ds-white"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to cart button */}
            <div className="mt-5">
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                size="lg"
                className="w-full gap-2"
              >
                {isOutOfStock ? (
                  "Out of Stock"
                ) : added ? (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Added to Cart
                  </>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                    Add to Cart — {formatPrice(displayPrice * quantity)}
                  </>
                )}
              </Button>
            </div>

            {/* View full details link */}
            <div className="mt-4 text-center">
              <Link
                href={`/shop/${product.slug}`}
                onClick={closeQuickView}
                className="text-sm font-medium text-ds-gray-400 transition-colors hover:text-ds-red"
              >
                View Full Details →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
