"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice, truncate } from "@/lib/utils";
import { toWebpPath } from "@/lib/images";
import type { CartItem } from "@/lib/cart-context";

/* ── Types ─────────────────────────────────────────────────── */

interface ShopVariant {
  id: string;
  name: string;
  price: number | { toString(): string };
  inventory: number;
}

interface StickyAddToCartProps {
  productId: string;
  productName: string;
  productSlug: string;
  productSku: string;
  basePrice: number;
  salePrice?: number | null;
  images: string[];
  variants: ShopVariant[];
  inventory: number;
}

/* ── Component ─────────────────────────────────────────────── */

export function StickyAddToCart({
  productId,
  productName,
  productSlug,
  productSku,
  basePrice,
  salePrice,
  images,
  variants,
  inventory,
}: StickyAddToCartProps) {
  const [visible, setVisible] = useState(false);
  const [added, setAdded] = useState(false);
  const triggerRef = useRef<number | null>(null);
  const { addItem } = useCart();

  /* Resolve effective price */
  const resolvedPrice = salePrice ?? basePrice;
  const firstVariant = variants.length > 0 ? variants[0] : null;
  const displayPrice = firstVariant
    ? typeof firstVariant.price === "number"
      ? firstVariant.price
      : parseFloat(firstVariant.price.toString())
    : resolvedPrice;

  const isOutOfStock =
    inventory <= 0 || (firstVariant != null && firstVariant.inventory <= 0);

  /* ── IntersectionObserver on the main CTA ─────────────── */
  useEffect(() => {
    const target = document.getElementById("main-add-to-cart");
    if (!target) {
      // Retry once after paint — the ProductForm renders client-side
      const id = window.setTimeout(() => {
        const retry = document.getElementById("main-add-to-cart");
        if (retry) observeTarget(retry);
      }, 300);
      return () => window.clearTimeout(id);
    }
    observeTarget(target);

    function observeTarget(el: HTMLElement) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          // Show sticky bar when the main CTA is NOT intersecting
          setVisible(!entry.isIntersecting);
        },
        { threshold: 0, rootMargin: "0px 0px -64px 0px" },
      );
      observer.observe(el);
      return () => observer.disconnect();
    }

    return observeTarget(target);
  }, []);

  /* ── Add to cart handler ──────────────────────────────── */
  const handleAddToCart = useCallback(() => {
    if (isOutOfStock) return;

    const cartItem: CartItem = {
      id: `${productId}-${firstVariant?.id ?? "default"}-${Date.now()}`,
      productId,
      variantId: firstVariant?.id ?? undefined,
      name: productName,
      slug: productSlug,
      sku: productSku,
      price: displayPrice,
      quantity: 1,
      variantName: firstVariant?.name,
      image: images.length > 0 ? images[0] : undefined,
    };

    addItem(cartItem);
    setAdded(true);

    if (triggerRef.current) window.clearTimeout(triggerRef.current);
    triggerRef.current = window.setTimeout(() => setAdded(false), 2000);
  }, [
    isOutOfStock,
    addItem,
    productId,
    firstVariant,
    productName,
    productSlug,
    productSku,
    displayPrice,
    images,
  ]);

  /* Cleanup timeout on unmount */
  useEffect(() => {
    return () => {
      if (triggerRef.current) window.clearTimeout(triggerRef.current);
    };
  }, []);

  /* ── Thumbnail ────────────────────────────────────────── */
  const thumbnailSrc =
    Array.isArray(images) && images.length > 0 ? toWebpPath(images[0]) : null;

  /* ── Render ────────────────────────────────────────────── */
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex h-16 items-center gap-3 border-t border-white/[0.06] bg-ds-black-charcoal/95 px-4 backdrop-blur-md">
        {/* Thumbnail */}
        {thumbnailSrc ? (
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-white/[0.08]">
            <Image
              src={thumbnailSrc}
              alt={productName}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-ds-black">
            <svg
              className="h-5 w-5 text-ds-red/30"
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
        )}

        {/* Product info — truncated name + price */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ds-white">
            {productName}
          </p>
          <p className="text-xs text-ds-gray-400">
            {formatPrice(displayPrice)}
          </p>
        </div>

        {/* Compact Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-shrink-0 rounded-lg bg-ds-red px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-ds-red-700 active:bg-ds-red-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isOutOfStock ? "Sold Out" : added ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
