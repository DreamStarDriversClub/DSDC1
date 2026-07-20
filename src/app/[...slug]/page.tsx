import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Lost on the Touge",
  description:
    "Wrong turn? This page doesn't exist — but the road goes on. Get back to the Dream Star Drivers Club.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Catch-all 404 page.
 *
 * Renders the custom "Wrong Turn on the Touge" UI and sets HTTP 404 status.
 * This replaces the root not-found.tsx convention file, which was causing
 * a route-resolution bug in Next.js 14.2.29 where pages sharing the same
 * build commit as not-found.tsx would incorrectly resolve to /_not-found.
 */
export default function CatchAllNotFoundPage() {
  return (
    <div className="relative flex min-h-[80vh] items-center overflow-hidden bg-ds-black-deepest">
      {/* ── Background grid ─────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />

      {/* ── Glow accents ────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />

      {/* ── Animated star streaks (Initial D / Wangan vibe) ─────── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/3 h-[1px] w-32 animate-star-streak bg-gradient-to-r from-transparent via-ds-red/60 to-transparent" />
        <div
          className="absolute left-1/3 top-1/2 h-[1px] w-40 animate-star-streak bg-gradient-to-r from-transparent via-ds-white/30 to-transparent"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute left-1/2 top-2/3 h-[1px] w-28 animate-star-streak bg-gradient-to-r from-transparent via-ds-red/40 to-transparent"
          style={{ animationDelay: "4s" }}
        />
        <div
          className="absolute right-1/3 top-1/4 h-[1px] w-36 animate-star-streak bg-gradient-to-r from-transparent via-ds-white/20 to-transparent"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <Container className="relative z-10 py-20 text-center sm:py-28">
        {/* 404 — giant graffiti number */}
        <div className="mx-auto opacity-start animate-fade-in-down">
          <span className="font-display text-[clamp(8rem,20vw,16rem)] font-black leading-none tracking-[-0.05em] text-ds-red/15 select-none">
            404
          </span>
        </div>

        {/* Message */}
        <div
          className="mx-auto -mt-12 max-w-2xl opacity-start animate-fade-in-up"
          style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
        >
          <h1 className="font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
            Wrong Turn on the{" "}
            <span className="text-ds-red">Touge</span>
          </h1>
          <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-ds-red" />

          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ds-gray-400 sm:text-lg">
            This road doesn&apos;t exist. Maybe the map was wrong, or maybe you
            apexed a corner a little too hard. Either way — the crew&apos;s
            waiting back at the starting line.
          </p>

          {/* Action buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button variant="primary" size="lg">
                Back to the Garage
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
                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                  />
                </svg>
              </Button>
            </Link>
            <Link href="/shop/apparel">
              <Button variant="outline" size="lg">
                Browse the Collection
              </Button>
            </Link>
          </div>

          {/* Small hint */}
          <p className="mt-8 font-display text-xs uppercase tracking-[0.3em] text-ds-gray-600">
            &ldquo;The road goes on forever.&rdquo;
          </p>
        </div>

        {/* ── Animated corner accents ────────────────────────────── */}
        <div className="pointer-events-none absolute bottom-8 left-8 hidden sm:block">
          <div className="h-12 w-[1px] bg-ds-red/20" />
          <div className="mt-2 h-[1px] w-12 bg-ds-red/20" />
        </div>
        <div className="pointer-events-none absolute right-8 top-8 hidden sm:block">
          <div className="ml-auto h-12 w-[1px] bg-ds-red/20" />
          <div className="ml-auto mt-2 h-[1px] w-12 bg-ds-red/20" />
        </div>
      </Container>

      {/* ── Bottom accent ────────────────────────────────────────── */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
    </div>
  );
}
