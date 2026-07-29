"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toWebpPath } from "@/lib/images";
import type { QuizArchetype } from "@/lib/quiz-data";
import { buildShareText } from "@/lib/quiz-data";

/* ── Simple product card for recommendations ───────────────── */

interface RecProduct {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
}

interface QuizResultsProps {
  archetype: QuizArchetype;
  products: RecProduct[];
}

export function QuizResults({ archetype, products }: QuizResultsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const text = buildShareText(archetype);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: try older API
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [archetype]);

  const handleShareUrl = useCallback(async () => {
    const url = `${window.location.origin}/quiz`;
    try {
      await navigator.clipboard.writeText(
        `🚗 I got "${archetype.name}" on the Dream Star Drivers Club "What's Your Build?" quiz!\n\n${archetype.tagline}\n\nFind yours: ${url}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, [archetype]);

  return (
    <div className="w-full animate-fade-in-up">
      {/* ── Archetype Reveal ──────────────────────────────── */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-ds-red/20 bg-ds-red/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-ds-red">
          <span>{archetype.vibeEmoji}</span>
          Your Build Archetype
        </span>

        <h2 className="mt-6 font-display text-4xl font-black tracking-tight text-ds-red sm:text-5xl">
          {archetype.name}
        </h2>

        <p className="mt-3 text-lg font-medium italic text-ds-gray-300">
          {archetype.tagline}
        </p>

        <div className="mx-auto mt-6 h-[2px] w-16 rounded-full bg-ds-red/40" />

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ds-gray-400">
          {archetype.description}
        </p>
      </div>

      {/* ── Recommended Products ──────────────────────────── */}
      <div className="mb-10">
        <h3 className="mb-6 text-center font-display text-xl font-bold tracking-tight text-ds-white">
          🔰 Gear for Your Build
        </h3>

        <div className="grid gap-4 sm:grid-cols-3">
          {products.slice(0, 3).map((product, idx) => (
            <Link
              key={product.slug}
              href={`/shop/${product.slug}`}
              className={cn(
                "group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-ds-black-charcoal transition-all duration-300",
                "hover:border-ds-red/30 hover:shadow-card-hover hover:-translate-y-1"
              )}
              style={{
                animationDelay: `${idx * 150}ms`,
                animationFillMode: "backwards",
              }}
            >
              {/* Product image */}
              <div className="relative aspect-square overflow-hidden bg-ds-black-elevated">
                {product.image ? (
                  <img
                    src={toWebpPath(product.image)}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">
                    🏎️
                  </div>
                )}
                {/* Category badge */}
                <span className="absolute left-3 top-3 rounded-full bg-ds-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-gray-300 backdrop-blur-sm">
                  {product.category}
                </span>
              </div>

              {/* Product info */}
              <div className="flex flex-1 flex-col gap-1 p-4">
                <span className="text-sm font-semibold text-ds-white group-hover:text-ds-red transition-colors line-clamp-2">
                  {product.name}
                </span>
                <span className="mt-auto text-sm font-bold text-ds-red">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            </Link>
          ))}

          {/* Fallback if no products */}
          {products.length === 0 && (
            <div className="col-span-full space-y-4">
              <div className="rounded-xl border border-white/[0.06] bg-ds-black-charcoal p-6 text-center">
                <span className="text-3xl">🏎️</span>
                <p className="mt-3 text-sm font-medium text-ds-gray-300">
                  We&apos;re building the perfect gear for your build.
                </p>
                <p className="mt-1 text-xs text-ds-gray-500">
                  Check out these categories while we stock up:
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {archetype.recommendedCategories.slice(0, 3).map((cat) => (
                    <Link
                      key={cat}
                      href={`/shop/${cat}`}
                      className="rounded-full border border-ds-red/20 bg-ds-red/5 px-4 py-1.5 text-xs font-semibold text-ds-red transition-colors hover:bg-ds-red/10"
                    >
                      {cat.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Link>
                  ))}
                  <Link
                    href="/shop/all"
                    className="rounded-full border border-white/[0.08] bg-ds-black px-4 py-1.5 text-xs font-semibold text-ds-gray-300 transition-colors hover:bg-ds-black-darkgray"
                  >
                    Browse All
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Actions ────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={handleShare}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-6 py-3 text-base font-semibold transition-all duration-200",
            copied
              ? "border-ds-red/40 bg-ds-red/10 text-ds-red"
              : "border-white/[0.15] bg-transparent text-ds-white hover:bg-ds-white/[0.06]"
          )}
        >
          {copied ? (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              Share Your Build
            </>
          )}
        </button>

        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl border border-ds-red bg-ds-red px-6 py-3 text-base font-semibold text-white transition-all duration-200 hover:bg-ds-red-700 active:bg-ds-red-800"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Take It Again
        </button>
      </div>

      {/* ── Browse catalog link ────────────────────────────── */}
      <p className="mt-8 text-center text-sm text-ds-gray-500">
        Want more gear?{" "}
        <Link
          href="/shop/all"
          className="text-ds-red underline underline-offset-2 transition-colors hover:text-ds-red-400"
        >
          Browse the full catalog
        </Link>
      </p>
    </div>
  );
}
