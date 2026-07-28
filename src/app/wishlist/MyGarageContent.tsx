"use client";

import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";

function categoryBadgeVariant(category: string): "red" | "gold" | "gray" {
  if (category === "Accessories") return "gold";
  if (category === "DS Performance") return "red";
  return "gray";
}

export function MyGarageContent() {
  const { items, removeFromWishlist, itemCount } = useWishlist();
  const { addItem } = useCart();
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const handleAddToCart = useCallback(
    (item: (typeof items)[0]) => {
      addItem({
        id: `wl-${item.productId}-${Date.now()}`,
        productId: item.productId,
        name: item.productName,
        slug: "",
        sku: item.productId,
        price: item.productPrice / 100, // stored as cents, cart expects dollars
        quantity: 1,
        image: item.productImage ?? undefined,
      });
      setAddedMap((prev) => ({ ...prev, [item.productId]: true }));
      setTimeout(() => {
        setAddedMap((prev) => ({ ...prev, [item.productId]: false }));
      }, 2000);
    },
    [addItem]
  );

  // Empty state
  if (itemCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        {/* Garage icon */}
        <div className="mb-8 rounded-full border border-white/[0.06] bg-ds-black-charcoal p-8">
          <svg
            className="h-16 w-16 text-ds-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={0.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
        </div>

        <h2 className="font-display text-2xl font-bold text-ds-white">
          Your garage is empty
        </h2>
        <p className="mt-3 max-w-md text-ds-gray-400">
          Start building your collection. Browse the shop and save the pieces
          that catch your eye.
        </p>

        <Link href="/shop/all" className="mt-8">
          <Button size="lg">
            <svg
              className="mr-2 h-5 w-5"
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
            Browse Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <p className="mb-8 text-sm text-ds-gray-400">
        {itemCount} item{itemCount !== 1 ? "s" : ""} in your garage
      </p>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id} padding="none" className="group overflow-hidden">
            {/* Image */}
            <div className="relative flex h-48 items-center justify-center bg-ds-black-charcoal">
              {item.productImage ? (
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                  loading="lazy"
                  quality={75}
                />
              ) : (
                <svg
                  className="h-12 w-12 text-ds-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={0.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <div className="mb-2">
                <Badge variant={categoryBadgeVariant(item.productCategory)} size="sm">
                  {item.productCategory}
                </Badge>
              </div>
              <h3 className="font-display text-sm font-bold text-ds-white line-clamp-1">
                {item.productName}
              </h3>
              <p className="mt-1 text-lg font-bold text-ds-white">
                {formatPrice(item.productPrice / 100)}
              </p>

              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 gap-1.5 text-xs"
                  onClick={() => handleAddToCart(item)}
                >
                  {addedMap[item.productId] ? (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Added
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-ds-gray-400 hover:text-ds-red"
                  onClick={() => removeFromWishlist(item.productId)}
                  aria-label="Remove from My Garage"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
