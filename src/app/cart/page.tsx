"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { validateCouponAction } from "@/lib/cart-actions";
import { formatPrice } from "@/lib/utils";
import { SHIPPING_RATES, FREE_SHIPPING_THRESHOLD } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Cart" },
];

export default function CartPage() {
  const {
    state,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    clearCart,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    itemCount,
    isFreeShipping,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const { coupon, couponError } = state;

  const handleApplyCoupon = useCallback(async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const result = await validateCouponAction(couponInput.trim(), subtotal);
      if (result.valid && result.coupon) {
        applyCoupon(result.coupon, null);
      } else {
        applyCoupon(null, result.error || "Invalid coupon");
      }
    } catch {
      applyCoupon(null, "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  }, [couponInput, subtotal, applyCoupon]);

  const handleRemoveCoupon = useCallback(() => {
    applyCoupon(null, null);
    setCouponInput("");
  }, [applyCoupon]);

  if (state.items.length === 0) {
    return (
      <>
        <Container className="py-8">
          <Breadcrumbs items={breadcrumbItems} />
        </Container>

        <section className="section-padding">
          <Container>
            <div className="mx-auto max-w-lg text-center">
              <div className="flex justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-ds-red/20 bg-ds-black">
                  <img
                    src="/hoshi-shopping.png"
                    alt="Hoshi — your cart is empty"
                    className="h-28 w-28 object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
              <h1 className="mt-8 font-display text-3xl font-bold text-ds-white">
                Your cart is empty
              </h1>
              <p className="mt-3 text-ds-gray-400">
                Looks like you haven&apos;t added anything yet. Browse our
                collection and find something awesome.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link href="/shop">
                  <Button variant="primary" size="lg">
                    Browse Shop
                  </Button>
                </Link>
                <Link href="/shop/apparel">
                  <Button variant="outline" size="lg">
                    New Arrivals
                  </Button>
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <Container className="py-8">
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <section className="section-padding-tight">
        <Container>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold text-ds-white">
              Shopping Cart{" "}
              <span className="text-lg font-normal text-ds-gray-500">
                ({itemCount} {itemCount === 1 ? "item" : "items"})
              </span>
            </h1>
            <button
              onClick={clearCart}
              className="text-sm text-ds-gray-500 transition-colors hover:text-ds-red"
            >
              Clear Cart
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── Cart Items ──────────────────────────── */}
            <div className="lg:col-span-2">
              {/* Free shipping progress */}
              {!isFreeShipping && (
                <div className="mb-6 rounded-xl border border-white/[0.06] bg-ds-black-charcoal p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-ds-gray-400">
                      Add{" "}
                      <span className="font-semibold text-ds-red">
                        {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal + discount)}
                      </span>{" "}
                      more for <span className="font-semibold text-green-400">free shipping</span>
                    </p>
                    <span className="text-xs text-ds-gray-500">
                      {formatPrice(subtotal - discount)} / {formatPrice(FREE_SHIPPING_THRESHOLD)}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-ds-black-darkgray">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-ds-red to-ds-red-400 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.round(((subtotal - discount) / FREE_SHIPPING_THRESHOLD) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {isFreeShipping && (
                <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/5 p-4">
                  <p className="text-sm font-semibold text-green-400">
                    🎉 You qualify for free shipping!
                  </p>
                </div>
              )}

              {/* Item list */}
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-xl border border-white/[0.06] bg-ds-black-charcoal p-4 sm:p-5"
                  >
                    {/* Image */}
                    <Link
                      href={`/shop/${item.slug}`}
                      className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-ds-black sm:h-28 sm:w-28"
                    >
                      <div className="flex h-full items-center justify-center">
                        <svg
                          className="h-8 w-8 text-ds-gray-600"
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
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <Link
                            href={`/shop/${item.slug}`}
                            className="text-sm font-semibold text-ds-white transition-colors hover:text-ds-red sm:text-base"
                          >
                            {item.name}
                          </Link>
                        </div>
                        {item.variantName && (
                          <p className="mt-0.5 text-xs text-ds-gray-500">
                            {item.variantName}
                          </p>
                        )}
                        <p className="mt-0.5 text-xs text-ds-gray-600">
                          {item.sku}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center rounded-lg border border-white/[0.08] bg-ds-black">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-3 py-1.5 text-sm text-ds-gray-400 transition-colors hover:text-ds-white"
                            aria-label="Decrease"
                          >
                            −
                          </button>
                          <span className="min-w-[2.5rem] text-center text-sm font-medium text-ds-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-3 py-1.5 text-sm text-ds-gray-400 transition-colors hover:text-ds-white"
                            aria-label="Increase"
                          >
                            +
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-sm font-bold text-ds-white sm:text-base">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-ds-gray-600 transition-colors hover:text-ds-red"
                            aria-label="Remove"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue shopping */}
              <div className="mt-6">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1 text-sm text-ds-gray-400 transition-colors hover:text-ds-white"
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
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* ── Order Summary ───────────────────────── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6">
                <h2 className="font-display text-xl font-bold text-ds-white mb-6">
                  Order Summary
                </h2>

                {/* Coupon */}
                {!coupon ? (
                  <div className="mb-6">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ds-gray-400">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                        placeholder="Enter code"
                        className="flex-1 rounded-lg border border-white/[0.08] bg-ds-black px-3 py-2 text-sm text-ds-white placeholder-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponInput.trim()}
                      >
                        {couponLoading ? "..." : "Apply"}
                      </Button>
                    </div>
                    {couponError && (
                      <p className="mt-2 text-xs text-ds-red">{couponError}</p>
                    )}
                    <div className="mt-2 flex gap-3">
                      <button
                        onClick={() => {
                          setCouponInput("WELCOME10");
                        }}
                        className="text-[10px] text-ds-gray-600 transition-colors hover:text-ds-gray-400"
                      >
                        WELCOME10
                      </button>
                      <button
                        onClick={() => {
                          setCouponInput("FREESHIP");
                        }}
                        className="text-[10px] text-ds-gray-600 transition-colors hover:text-ds-gray-400"
                      >
                        FREESHIP
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ds-gray-400">
                      Applied Coupon
                    </label>
                    <div className="flex items-center justify-between rounded-lg border border-green-500/20 bg-green-500/5 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <svg
                          className="h-4 w-4 text-green-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm font-semibold text-green-400">
                          {coupon.code}
                        </span>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-ds-gray-500 transition-colors hover:text-ds-red"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Totals */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ds-gray-400">Subtotal</span>
                    <span className="text-ds-white font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-ds-gray-400">Shipping</span>
                    <span
                      className={`font-medium ${shipping === 0 ? "text-green-400" : "text-ds-white"}`}
                    >
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-ds-gray-400">Tax (est.)</span>
                    <span className="text-ds-white font-medium">
                      {formatPrice(tax)}
                    </span>
                  </div>

                  <div className="border-t border-white/[0.06] pt-3">
                    <div className="flex justify-between">
                      <span className="font-semibold text-ds-white">
                        Estimated Total
                      </span>
                      <span className="text-xl font-bold text-ds-white">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping info */}
                <div className="mt-4 flex items-center gap-2 text-xs text-ds-gray-500">
                  <svg
                    className="h-4 w-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  </svg>
                  <span>
                    Free shipping on orders over{" "}
                    {formatPrice(FREE_SHIPPING_THRESHOLD)}
                  </span>
                </div>

                <div className="mt-6">
                  <Link href="/checkout">
                    <Button variant="primary" size="lg" className="w-full gap-2">
                      Proceed to Checkout
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
                    </Button>
                  </Link>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-ds-gray-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-xs">Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
