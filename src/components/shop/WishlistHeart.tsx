"use client";

import { useState, useCallback } from "react";
import { useWishlist } from "@/lib/wishlist-context";
import { cn } from "@/lib/utils";

interface WishlistHeartProps {
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number; // cents
  productCategory: string;
  className?: string;
}

export function WishlistHeart({
  productId,
  productName,
  productImage,
  productPrice,
  productCategory,
  className,
}: WishlistHeartProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

  const saved = isInWishlist(productId);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 400);

      if (saved) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist({
          productId,
          productName,
          productImage,
          productPrice,
          productCategory,
        });
      }
    },
    [
      saved,
      productId,
      productName,
      productImage,
      productPrice,
      productCategory,
      addToWishlist,
      removeFromWishlist,
    ]
  );

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "group/heart flex h-9 w-9 items-center justify-center rounded-full bg-ds-black/70 backdrop-blur-sm transition-all duration-300 hover:bg-ds-black/90",
        isAnimating && "animate-bounce",
        className
      )}
      aria-label={saved ? "Remove from My Garage" : "Add to My Garage"}
      title={saved ? "Remove from My Garage" : "Add to My Garage"}
    >
      <svg
        className={cn(
          "h-5 w-5 transition-all duration-300",
          saved
            ? "fill-ds-red text-ds-red"
            : "fill-none text-ds-white group-hover/heart:text-ds-red",
          isAnimating && "scale-125"
        )}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
