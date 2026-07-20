"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { ProductDetailVariant } from "@/lib/shop-data";

interface ProductFormProps {
  productId: string;
  productName: string;
  productSlug: string;
  productSku: string;
  basePrice: number;
  salePrice: number | null;
  variants: ProductDetailVariant[];
  images: string[];
  inventory: number;
}

export function ProductForm({
  productId,
  productName,
  productSlug,
  productSku,
  basePrice,
  salePrice,
  variants,
  images,
  inventory,
}: ProductFormProps) {
  const { addToCart, toggleCart } = useCart();
  const [selectedVariant, setSelectedVariant] =
    useState<ProductDetailVariant | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Derive available options
  const hasVariants = variants.length > 0;

  const sizes = useMemo(() => {
    if (!hasVariants) return [];
    const set = new Set<string>();
    variants.forEach((v) => {
      if (v.size) set.add(v.size);
    });
    return [...set];
  }, [variants, hasVariants]);

  const colors = useMemo(() => {
    if (!hasVariants) return [];
    const set = new Set<string>();
    variants.forEach((v) => {
      if (v.color) set.add(v.color);
    });
    return [...set];
  }, [variants, hasVariants]);

  // Determine which sizes are available given the selected color (and vice versa)
  const availableSizes = useMemo(() => {
    if (!selectedColor) return sizes;
    const set = new Set<string>();
    variants.forEach((v) => {
      if (v.color === selectedColor && v.size) set.add(v.size);
    });
    return [...set];
  }, [variants, selectedColor, sizes]);

  const availableColors = useMemo(() => {
    if (!selectedSize) return colors;
    const set = new Set<string>();
    variants.forEach((v) => {
      if (v.size === selectedSize && v.color) set.add(v.color);
    });
    return [...set];
  }, [variants, selectedSize, colors]);

  // Find matching variant when size+color selected
  const matchedVariant = useMemo(() => {
    if (!hasVariants) return null;
    if (selectedSize && selectedColor) {
      return (
        variants.find(
          (v) => v.size === selectedSize && v.color === selectedColor,
        ) || null
      );
    }
    if (selectedSize && colors.length === 0) {
      return variants.find((v) => v.size === selectedSize) || null;
    }
    if (selectedColor && sizes.length === 0) {
      return variants.find((v) => v.color === selectedColor) || null;
    }
    return null;
  }, [variants, hasVariants, selectedSize, selectedColor, colors.length, sizes.length]);

  // Effective price: matched variant price > sale price > base price
  const displayPrice = matchedVariant
    ? matchedVariant.price
    : salePrice ?? basePrice;

  // Determine if we have a single-dimension variant (only sizes OR only colors)
  const hasOnlySizes = sizes.length > 0 && colors.length === 0;
  const hasOnlyColors = colors.length > 0 && sizes.length === 0;

  const handleSizeSelect = (size: string) => {
    setSelectedSize((prev) => (prev === size ? null : size));
    setSelectedVariant(null);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor((prev) => (prev === color ? null : color));
    setSelectedVariant(null);
  };

  const handleAddToCart = () => {
    // Determine which variant to use
    let cartVariant: ProductDetailVariant | null = matchedVariant;

    // If no match found but a selection was made, try to use it
    if (!cartVariant && hasVariants) {
      if (selectedSize && !selectedColor) {
        cartVariant =
          variants.find((v) => v.size === selectedSize) || null;
      } else if (selectedColor && !selectedSize) {
        cartVariant =
          variants.find((v) => v.color === selectedColor) || null;
      }
    }

    const variantId = cartVariant?.id ?? null;
    const variantName = cartVariant?.name ?? undefined;
    const price = cartVariant?.price ?? salePrice ?? basePrice;
    const sku = cartVariant?.sku ?? productSku;

    addToCart({
      productId,
      variantId,
      name: productName,
      slug: productSlug,
      sku,
      price,
      quantity,
      variantName,
      image: images.length > 0 ? images[0] : undefined,
    });

    setAdded(true);
    toggleCart(true);

    setTimeout(() => setAdded(false), 2000);
  };

  const isOutOfStock = inventory <= 0;
  const canAddToCart = !isOutOfStock;

  return (
    <div className="space-y-5">
      {/* Variant Selectors */}
      {hasVariants && (
        <>
          {/* Size selector */}
          {sizes.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-ds-gray-300">
                {hasOnlySizes ? "Variant" : "Size"}
              </label>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => {
                  const isAvailable = availableSizes.includes(size);
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => isAvailable && handleSizeSelect(size)}
                      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ds-red/40 ${
                        isSelected
                          ? "border-ds-red bg-ds-red/20 text-ds-white"
                          : isAvailable
                            ? "border-white/[0.12] bg-ds-black-charcoal text-ds-white hover:border-ds-red/50 hover:bg-ds-red/10"
                            : "cursor-not-allowed border-white/[0.05] bg-ds-black-charcoal/50 text-ds-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Color selector */}
          {colors.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-ds-gray-300">
                {hasOnlyColors ? "Variant" : "Color"}
              </label>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isAvailable = availableColors.includes(color);
                  const isSelected = selectedColor === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => isAvailable && handleColorSelect(color)}
                      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ds-red/40 ${
                        isSelected
                          ? "border-ds-red bg-ds-red/20 text-ds-white"
                          : isAvailable
                            ? "border-white/[0.12] bg-ds-black-charcoal text-ds-white hover:border-ds-red/50 hover:bg-ds-red/10"
                            : "cursor-not-allowed border-white/[0.05] bg-ds-black-charcoal/50 text-ds-gray-700"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Quantity */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-ds-gray-300">
          Quantity
        </label>
        <div className="inline-flex items-center rounded-lg border border-white/[0.12] overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="px-4 py-2.5 text-sm text-ds-white transition-all hover:bg-ds-black-darkgray disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="px-6 py-2.5 text-sm font-medium text-ds-white border-x border-white/[0.12] min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-4 py-2.5 text-sm text-ds-white transition-all hover:bg-ds-black-darkgray"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
        >
          {added ? (
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
              Added!
            </>
          ) : (
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
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              Add to Cart{" "}
              {displayPrice > 0 && `— ${formatPrice(displayPrice)}`}
            </>
          )}
        </Button>

        <Button variant="outline" size="lg" className="w-full">
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
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
          Add to Wishlist
        </Button>
      </div>

      {/* SKU / Inventory */}
      <div className="text-sm text-ds-gray-400 space-y-1">
        <p>SKU: {productSku}</p>
        {isOutOfStock ? (
          <p className="text-ds-red">Out of Stock</p>
        ) : (
          <p className="text-green-400">
            In Stock
            {inventory < 999 && ` (${inventory} available)`}
          </p>
        )}
      </div>
    </div>
  );
}
