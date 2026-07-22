"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "./Button";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const [visible, setVisible] = useState(false);
  const {
    state,
    removeItem,
    updateQuantity,
    subtotal,
    itemCount,
  } = useCart();
  const { items } = state;

  const FREE_SHIPPING_THRESHOLD = 75;
  const freeShippingRemaining = FREE_SHIPPING_THRESHOLD - subtotal;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;

  useEffect(() => {
    if (open) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      const timeout = setTimeout(() => setVisible(false), 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timeout);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!visible) return null;

  const progressPercent = isFreeShipping
    ? 100
    : Math.min(100, Math.round((subtotal / 75) * 100));

  return (
    <div className="fixed inset-0 z-90">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/[0.06] bg-ds-black-charcoal shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ────────────────────────────────── */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <h2 className="font-display text-lg font-bold tracking-tight text-ds-white">
            Your Cart{" "}
            {itemCount > 0 && (
              <span className="ml-1 text-sm font-normal text-ds-gray-400">
                ({itemCount})
              </span>
            )}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-ds-gray-300 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
            aria-label="Close cart"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ── Content ───────────────────────────────── */}
        {items.length === 0 ? (
          <EmptyCart onClose={onClose} />
        ) : (
          <>
            {/* Free shipping progress */}
            {!isFreeShipping && (
              <div className="border-b border-white/[0.06] px-6 py-3">
                <p className="mb-2 text-xs text-ds-gray-300">
                  You&apos;re{" "}
                  <span className="font-semibold text-ds-red">
                    {formatPrice(freeShippingRemaining)}
                  </span>{" "}
                  away from free shipping
                </p>
                <div className="h-1.5 overflow-hidden rounded-full bg-ds-black-darkgray">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-ds-red to-ds-red-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {isFreeShipping && (
              <div className="border-b border-white/[0.06] px-6 py-3">
                <p className="text-xs font-semibold text-green-400">
                  🎉 You qualify for free shipping!
                </p>
              </div>
            )}

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-white/[0.06]">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4">
                    {/* Thumbnail */}
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={onClose}
                      className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/[0.06] bg-ds-black"
                    >
                      <div className="flex h-full items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <svg
                            className="h-6 w-6 text-ds-gray-600"
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
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/shop/${item.slug}`}
                          onClick={onClose}
                          className="text-sm font-semibold text-ds-white transition-colors hover:text-ds-red"
                        >
                          {item.name}
                        </Link>
                        {item.variantName && (
                          <p className="mt-0.5 text-xs text-ds-gray-400">
                            {item.variantName}
                          </p>
                        )}
                        <p className="mt-0.5 text-xs text-ds-gray-400">
                          {item.sku}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Quantity controls */}
                        <div className="flex items-center rounded-lg border border-white/[0.08] bg-ds-black">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2.5 py-1 text-xs text-ds-gray-300 transition-colors hover:text-ds-white"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="min-w-[2rem] text-center text-xs font-medium text-ds-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2.5 py-1 text-xs text-ds-gray-300 transition-colors hover:text-ds-white"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Price + Remove */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-ds-white">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-ds-gray-600 transition-colors hover:text-ds-red"
                            aria-label={`Remove ${item.name}`}
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
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Footer ──────────────────────────────── */}
            <div className="border-t border-white/[0.06] px-6 py-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-ds-gray-300">Subtotal</span>
                <span className="text-lg font-bold text-ds-white">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="space-y-2">
                <Link href="/cart" onClick={onClose}>
                  <Button variant="outline" size="md" className="w-full">
                    View Cart
                  </Button>
                </Link>
                <Link href="/checkout" onClick={onClose}>
                  <Button variant="primary" size="md" className="w-full gap-2">
                    Checkout
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

              <p className="mt-3 text-center text-[10px] text-ds-gray-600">
                Shipping &amp; taxes calculated at checkout
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Empty Cart State ────────────────────────────────────── */

function EmptyCart({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      {/* Hoshi mascot */}
      <div className="relative">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-ds-red/20 bg-ds-black">
          <img
            src="/hoshi-shopping.png"
            alt="Hoshi — your cart is empty"
            className="h-24 w-24 object-contain"
            loading="lazy"
          />
        </div>
        {/* Subtle glow */}
        <div className="absolute inset-0 rounded-full bg-ds-red/5 blur-xl" />
      </div>

      <div>
        <p className="text-lg font-display font-bold text-ds-white">
          Your cart is empty
        </p>
        <p className="mt-1 text-sm text-ds-gray-400">
          Hoshi&apos;s waiting for you to add something cool.
        </p>
      </div>

      <button
        onClick={onClose}
        className="text-sm font-medium text-ds-red transition-colors hover:text-ds-red-400"
      >
        Continue Shopping →
      </button>
    </div>
  );
}
