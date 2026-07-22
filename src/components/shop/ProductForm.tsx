"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";

interface Variant {
  id: string;
  name: string;
  price: number | { toString(): string };
  inventory: number;
}

interface ProductFormProps {
  productId: string;
  productName: string;
  productSlug: string;
  productSku: string;
  basePrice: number | { toString(): string };
  salePrice?: number | { toString(): string } | null;
  variants?: Variant[];
  images?: string[];
  inventory: number;
}

export function ProductForm({
  productId,
  productName,
  productSlug,
  productSku,
  basePrice,
  salePrice,
  variants = [],
  images = [],
  inventory,
}: ProductFormProps) {
  const price =
    typeof basePrice === "number"
      ? basePrice
      : parseFloat(basePrice.toString());
  const finalPrice = salePrice
    ? typeof salePrice === "number"
      ? salePrice
      : parseFloat(salePrice.toString())
    : price;

  const [selectedVariant, setSelectedVariant] = useState<string>(
    variants.length > 0 ? variants[0].id : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const currentVariant = variants.find((v) => v.id === selectedVariant);
  const variantPrice = currentVariant
    ? typeof currentVariant.price === "number"
      ? currentVariant.price
      : parseFloat(currentVariant.price.toString())
    : finalPrice;
  const displayPrice = variantPrice || finalPrice;

  const isOutOfStock =
    inventory <= 0 ||
    (currentVariant && currentVariant.inventory <= 0);

  const handleAddToCart = useCallback(() => {
    // Placeholder — cart integration will be added
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }, []);

  return (
    <div className="space-y-6">
      {/* Variant selector */}
      {variants.length > 0 && (
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
            Option
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
                } ${v.inventory <= 0 ? "cursor-not-allowed opacity-40" : ""}`}
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

      {/* Quantity */}
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] text-ds-gray-400 transition-colors hover:border-ds-red/30 hover:text-ds-white"
          >
            −
          </button>
          <span className="flex h-10 w-12 items-center justify-center rounded-lg border border-white/[0.08] bg-ds-black text-sm font-semibold text-ds-white">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] text-ds-gray-400 transition-colors hover:border-ds-red/30 hover:text-ds-white"
          >
            +
          </button>
        </div>
      </div>

      {/* Price display */}
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-bold text-ds-white">
          {formatPrice(displayPrice * quantity)}
        </span>
        {salePrice && (
          <span className="text-sm text-ds-gray-400 line-through">
            {formatPrice(price * quantity)}
          </span>
        )}
      </div>

      {/* Add to cart */}
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

      {/* SKU */}
      <p className="text-center text-xs text-ds-gray-600">
        SKU: {productSku}
      </p>
    </div>
  );
}
