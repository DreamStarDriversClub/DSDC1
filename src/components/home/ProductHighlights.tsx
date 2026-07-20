"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface FeaturedProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  categoryBadge: "red" | "gold";
  gradient: string;
  icon: React.ReactNode;
}

interface ProductHighlightsProps {
  products: FeaturedProduct[];
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function getCardsPerView(width: number): number {
  if (width >= 1024) return 3;
  if (width >= 640) return 2;
  return 1;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export function ProductHighlights({ products }: ProductHighlightsProps) {
  const [cardsPerView, setCardsPerView] = useState(3);
  const [currentSlide, setCurrentSlide] = useState(1); // index into extended array (0 = clone of last group)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Clone exactly cardsPerView items for seamless infinite scroll
  const lastClone = products.slice(-cardsPerView);
  const firstClone = products.slice(0, cardsPerView);
  const extendedProducts = [...lastClone, ...products, ...firstClone];
  const totalRealGroups = Math.ceil(products.length / cardsPerView);
  const totalSlides = totalRealGroups + 2; // clones at start (0) and end (totalSlides - 1)

  // Respond to resize
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const cpv = getCardsPerView(w);
      setCardsPerView((prev) => {
        if (prev !== cpv) {
          // Reset to first real slide when cardsPerView changes
          setCurrentSlide(1);
          setIsTransitioning(false);
        }
        return cpv;
      });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
      setIsTransitioning(true);
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  // Wraparound: when we reach a clone slide, jump to the real one after transition
  const handleTransitionEnd = useCallback(() => {
    if (currentSlide === 0) {
      // Cloned last group → jump to real last group
      setIsTransitioning(false);
      setCurrentSlide(totalRealGroups);
    } else if (currentSlide === totalSlides - 1) {
      // Cloned first group → jump to real first group
      setIsTransitioning(false);
      setCurrentSlide(1);
    }
  }, [currentSlide, totalRealGroups, totalSlides]);

  const goNext = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev + 1);
  };

  const goPrev = () => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => prev - 1);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setCurrentSlide(index);
  };

  // Active dot: map currentSlide to 0-based dot index
  const activeDotIndex =
    currentSlide === 0
      ? totalRealGroups - 1
      : currentSlide === totalSlides - 1
        ? 0
        : currentSlide - 1;

  // When cardsPerView or products change, we might need to clamp currentSlide
  // This is handled by the resize effect resetting to 1

  return (
    <section
      className="bg-ds-black section-padding"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Section Heading ─────────────────────────────────────────── */}
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl font-black tracking-tight text-ds-white sm:text-3xl">
            Product Highlights
          </h2>
          <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-ds-red" />
        </div>

        {/* ── Carousel ────────────────────────────────────────────────── */}
        <div className="relative px-0 sm:px-8">
          {/* Left Arrow */}
          <button
            onClick={goPrev}
            className="absolute -left-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.08] bg-ds-black-charcoal/80 p-2 text-ds-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-ds-red/40 hover:text-ds-red sm:-left-3 sm:flex"
            aria-label="Previous products"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={goNext}
            className="absolute -right-1 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/[0.08] bg-ds-black-charcoal/80 p-2 text-ds-gray-400 backdrop-blur-sm transition-all duration-300 hover:border-ds-red/40 hover:text-ds-red sm:-right-3 sm:flex"
            aria-label="Next products"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Track */}
          <div className="overflow-hidden rounded-xl">
            <div
              className="flex"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
                transition: isTransitioning
                  ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
                  : "none",
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedProducts.map((product, i) => (
                <Link
                  key={`${product.id}-${i}`}
                  href={`/shop/${product.category.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group flex-shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / cardsPerView}%` }}
                >
                  <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-ds-black-charcoal transition-all duration-300 hover:border-ds-red/30 hover:shadow-brand-glow-sm">
                    {/* Product image area */}
                    <div
                      className={`relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br ${product.gradient} sm:h-56`}
                    >
                      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110" />
                      <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                        {product.icon}
                      </div>
                      {/* Quick View overlay */}
                      <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                        <div className="flex items-center justify-center bg-ds-black/80 py-3 backdrop-blur-sm">
                          <span className="text-xs font-semibold uppercase tracking-wider text-ds-white">
                            Quick View
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Product info */}
                    <div className="p-4 sm:p-5">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant={product.categoryBadge} size="sm">
                          {product.category}
                        </Badge>
                      </div>
                      <h3 className="font-display text-sm font-bold text-ds-white transition-colors group-hover:text-ds-red">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-lg font-bold text-ds-white">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Dot Indicators ────────────────────────────────────────── */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: totalRealGroups }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i + 1)}
                className={`rounded-full transition-all duration-300 ${
                  i === activeDotIndex
                    ? "h-2 w-6 bg-ds-red"
                    : "h-2 w-2 bg-ds-gray-600 hover:bg-ds-gray-500"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Mobile arrow indicators */}
          <div className="mt-4 flex items-center justify-center gap-4 sm:hidden">
            <button
              onClick={goPrev}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-ds-black-charcoal/80 text-ds-gray-400 transition-all duration-300 hover:border-ds-red/40 hover:text-ds-red"
              aria-label="Previous products"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-xs text-ds-gray-500">
              {activeDotIndex + 1} / {totalRealGroups}
            </span>
            <button
              onClick={goNext}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-ds-black-charcoal/80 text-ds-gray-400 transition-all duration-300 hover:border-ds-red/40 hover:text-ds-red"
              aria-label="Next products"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
