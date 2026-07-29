"use client";

import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { WishlistHeart } from "@/components/shop/WishlistHeart";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import { toWebpPath } from "@/lib/images";

export default function WishlistPage() {
  const { wishlistItems, wishlistCount, isLoading } = useWishlist();
  const { addItem } = useCart();

  const handleAddToCart = (item: (typeof wishlistItems)[0]) => {
    addItem({
      id: "", // will be assigned by cart context
      productId: item.productId,
      name: item.productName,
      slug: "", // not needed for cart functionality
      sku: item.productId,
      price: Number(item.productPrice) / 100, // convert cents to dollars for cart
      quantity: 1,
      image: item.productImage,
    });
  };

  return (
    <>
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "My Garage" },
          ]}
          className="mb-8"
        />
      </Container>

      <section className="bg-ds-black section-padding-tight">
        <Container>
          <SectionHeading
            eyebrow="Your Collection"
            heading="My Garage"
            description={
              wishlistCount > 0
                ? `${wishlistCount} item${wishlistCount !== 1 ? "s" : ""} saved to your garage.`
                : "Your garage is empty. Start building your collection."
            }
            align="center"
            className="mb-10"
          />

          {isLoading ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ds-red border-t-transparent" />
              <p className="mt-4 text-sm text-ds-gray-400">Loading your garage...</p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="py-20 text-center">
              {/* Empty state icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-white/[0.08] bg-ds-black-charcoal">
                <svg
                  className="h-10 w-10 text-ds-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <p className="text-lg font-semibold text-ds-gray-300">
                Your garage is empty
              </p>
              <p className="mt-2 text-sm text-ds-gray-500">
                Start building your collection — browse the shop and save your
                favorites.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ds-red px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-ds-red-700"
              >
                Browse Shop
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal transition-all duration-400 hover:border-white/[0.12] hover:shadow-card-hover"
                >
                  {/* Product image */}
                  <Link
                    href={`/shop/${item.productId}`}
                    className="relative block aspect-square overflow-hidden"
                  >
                    {item.productImage ? (
                      <Image
                        src={toWebpPath(item.productImage)}
                        alt={item.productName}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        loading="lazy"
                        quality={85}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-ds-black-elevated">
                        <svg
                          className="h-12 w-12 text-ds-gray-600"
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
                    {/* Hover overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ds-black/60 to-transparent" />
                  </Link>

                  {/* Wishlist heart — remove */}
                  <div className="absolute right-2 top-2 z-10">
                    <WishlistHeart
                      productId={item.productId}
                      productName={item.productName}
                      productImage={item.productImage}
                      productPrice={item.productPrice}
                      productCategory={item.productCategory}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <Link href={`/shop/${item.productId}`}>
                      <h3 className="font-display text-sm font-bold text-ds-white transition-colors hover:text-ds-red line-clamp-1">
                        {item.productName}
                      </h3>
                    </Link>
                    <p className="mt-1 text-xs text-ds-gray-400 capitalize">
                      {item.productCategory.replace(/-/g, " ")}
                    </p>
                    <p className="mt-2 text-lg font-bold text-ds-white">
                      {formatPrice(Number(item.productPrice) / 100)}
                    </p>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="mt-3 w-full rounded-lg border border-ds-red/40 bg-ds-red/10 px-4 py-2 text-sm font-semibold text-ds-red transition-all duration-300 hover:bg-ds-red hover:text-white"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
