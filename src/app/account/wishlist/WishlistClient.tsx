"use client";

import { useState } from "react";
import Link from "next/link";
import { removeFromWishlistAction } from "@/lib/wishlist-actions";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";

type WishlistItemWithProduct = {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: string;
    salePrice: string | null;
    images: unknown;
    inventory: number;
  };
};

export default function WishlistClient({
  items,
}: {
  items: WishlistItemWithProduct[];
}) {
  const { addItem } = useCart();
  const [removing, setRemoving] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState<Set<string>>(new Set());

  const handleRemove = async (productId: string) => {
    setRemoving((prev) => new Set(prev).add(productId));
    await removeFromWishlistAction(productId);
    window.location.reload();
  };

  const handleAddToCart = async (
    productId: string,
    productName: string,
    price: string
  ) => {
    setAdding((prev) => new Set(prev).add(productId));
    try {
      addItem({
        id: `${productId}-${Date.now()}`,
        productId,
        variantId: undefined,
        name: productName,
        slug: "",
        sku: `SKU-${productId}`,
        price: parseFloat(price),
        quantity: 1,
      });
    } finally {
      setAdding((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl text-ds-white sm:text-3xl">
        Wishlist
      </h1>
      <p className="mb-8 text-ds-gray-300">
        {items.length > 0
          ? `${items.length} item${items.length !== 1 ? "s" : ""} saved for later.`
          : "Save your favorite items for later."}
      </p>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-10 text-center">
          {/* Hoshi empty state */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-ds-red/10">
            <svg
              className="h-10 w-10 text-ds-red/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </div>
          <p className="text-ds-gray-400">Your wishlist is empty.</p>
          <p className="mt-1 text-sm text-ds-gray-600">
            Hoshi is waiting for you to find something you love!
          </p>
          <Link
            href="/shop"
            className="mt-4 inline-block text-sm font-medium text-ds-red hover:text-ds-red-400 transition-colors"
          >
            Browse the Shop →
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const imageUrl =
              item.product.images &&
              Array.isArray(item.product.images) &&
              typeof item.product.images[0] === "string"
                ? item.product.images[0]
                : null;
            const price = item.product.salePrice
              ? Number(item.product.salePrice)
              : Number(item.product.price);
            const hasSale = !!item.product.salePrice;

            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal transition-all hover:border-ds-red/20"
              >
                {/* Image */}
                <Link
                  href={`/shop/${item.product.slug}`}
                  className="block aspect-square overflow-hidden bg-ds-black-darkgray"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="font-display text-4xl text-ds-gray-700">
                        DS
                      </span>
                    </div>
                  )}
                </Link>

                {/* Info */}
                <div className="p-4">
                  <Link
                    href={`/shop/${item.product.slug}`}
                    className="text-sm font-medium text-ds-white hover:text-ds-red transition-colors line-clamp-1"
                  >
                    {item.product.name}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm font-bold text-ds-white">
                      ${price.toFixed(2)}
                    </span>
                    {hasSale && (
                      <span className="text-xs text-ds-gray-400 line-through">
                        ${Number(item.product.price).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      disabled={
                        item.product.inventory === 0 ||
                        adding.has(item.productId)
                      }
                      onClick={() =>
                        handleAddToCart(
                          item.productId,
                          item.product.name,
                          price.toString()
                        )
                      }
                    >
                      {adding.has(item.productId)
                        ? "Adding..."
                        : item.product.inventory === 0
                          ? "Sold Out"
                          : "Add to Cart"}
                    </Button>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={removing.has(item.productId)}
                      className="rounded-xl px-3 text-ds-gray-400 transition-colors hover:bg-ds-red/10 hover:text-ds-red disabled:opacity-50"
                      title="Remove from wishlist"
                    >
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
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
