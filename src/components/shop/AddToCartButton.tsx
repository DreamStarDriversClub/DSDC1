"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";

interface AddToCartButtonProps {
  productId: string;
  variantId?: string | null;
  name: string;
  slug: string;
  sku: string;
  price: number;
  variantName?: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  productId,
  variantId = null,
  name,
  slug,
  sku,
  price,
  variantName,
  disabled = false,
  className = "",
}: AddToCartButtonProps) {
  const { addToCart, toggleCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (disabled) return;

    addToCart({
      productId,
      variantId,
      name,
      slug,
      sku,
      price,
      quantity: 1,
      variantName,
    });

    setAdded(true);
    toggleCart(true);

    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Button
      variant="primary"
      size="lg"
      className={`w-full ${className}`}
      onClick={handleAddToCart}
      disabled={disabled}
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
          Add to Cart
        </>
      )}
    </Button>
  );
}
