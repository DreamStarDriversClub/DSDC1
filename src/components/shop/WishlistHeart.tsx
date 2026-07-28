"use client";

import { useState, useCallback } from "react";
import { useWishlist } from "@/lib/wishlist-context";

interface WishlistHeartProps {
  productId: string;
  productName: string;
  productImage?: string | null;
  productPrice: number;
  productCategory: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-7 w-7",
};

const buttonSizeClasses = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
};

export function WishlistHeart({
  productId,
  productName,
  productImage,
  productPrice,
  productCategory,
  className = "",
  size = "md",
}: WishlistHeartProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const saved = isInWishlist(productId);
  const [animating, setAnimating] = useState(false);

  const handleClick = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault(); // prevent card link navigation
      e.stopPropagation();

      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);

      if (saved) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist({
          productId,
          productName,
          productImage: productImage ?? null,
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
      onClick={handleClick}
      className={`group rounded-full transition-all duration-300 hover:bg-ds-red/10 ${buttonSizeClasses[size]} ${className}`}
      aria-label={saved ? `Remove ${productName} from My Garage` : `Add ${productName} to My Garage`}
      title={saved ? "Remove from My Garage" : "Add to My Garage"}
    >
      <svg
        className={`${sizeClasses[size]} transition-all duration-300 ${
          animating ? "scale-125" : "scale-100"
        } ${
          saved
            ? "fill-ds-red text-ds-red"
            : "fill-none text-ds-gray-400 group-hover:text-ds-red"
        }`}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={saved ? 0 : 2}
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
