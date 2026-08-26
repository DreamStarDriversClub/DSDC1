import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME, TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Links | ${BRAND_NAME}`,
  description:
    "Everything Dream Star in one place — the reads, the club, and the shop. Apparel, accessories, and rotary & 2JZ performance parts for those who chase the horizon.",
  openGraph: {
    title: `Links | ${BRAND_NAME}`,
    description:
      "The garage, the club, and the shop — all in one place. Chase the horizon.",
  },
};

/* ── Curated launch content (hardcoded, no DB fetch — fast & static) ────── */

const GARAGE_POSTS = [
  {
    title: "The Lost Age",
    subtitle: "Automotive JDM Car Culture of the 90's and Early 00's",
    hook: "Why the golden era still owns the scene — and never really left.",
    href: "/blog/the-lost-age-jdm-car-culture-90s-00s",
  },
  {
    title: "The 13B Family",
    subtitle: "Turbo II, REW, and Renesis — Every Rotary That Mattered",
    hook: "Three generations of spinning heart. TII, REW, Renesis — what separates them.",
    href: "/blog/13b-family-turbo-rew-renesis",
  },
  {
    title: "2JZ-GE vs GTE",
    subtitle: "The Cost-Effective Way to See Results",
    hook: "Why the GE block is the smart-money play — and how to wake it up.",
    href: "/blog/2jz-ge-vs-gte-cost-effective-build",
  },
];

const SHOP_LINKS = [
  { label: "Shop All", href: "/shop" },
  { label: "Apparel", href: "/shop/apparel" },
  { label: "Performance", href: "/shop/performance" },
  { label: "Accessories", href: "/shop/accessories" },
];

/* ── Small presentational helpers ─────────────────────────────────────────── */

function Overline({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-ds-red">
      <span className="h-px w-5 bg-ds-red/60" aria-hidden="true" />
      {children}
    </span>
  );
}

function Arrow() {
  return (
    <svg
      className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   LinksPage — mobile-first link-in-bio
   ═══════════════════════════════════════════════════════════════════════════ */

export default function LinksPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ds-black text-ds-white">
      {/* ambient red glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-hero-glow"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[26rem] flex-col px-6 py-14">
        {/* ── Brand header ───────────────────────────────────── */}
        <header className="animate-fade-in-up text-center">
          <Link href="/" aria-label={BRAND_NAME} className="inline-block">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-ds-white/5 font-display text-2xl font-black text-ds-red shadow-brand-glow-sm">
              DS
            </span>
          </Link>
          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-ds-gray-500">
            Dream Star Drivers Club
          </p>
          <h1 className="mt-2 font-display text-4xl font-black leading-none text-ds-white">
            Chase the Horizon
          </h1>
          <div className="mx-auto mt-5 h-[3px] w-12 rounded-full bg-ds-red" />
          <p className="mx-auto mt-5 max-w-xs text-sm leading-relaxed text-ds-gray-400">
            Rotary &amp; 2JZ culture, the club, and the shop — all in one place.
          </p>
        </header>

        <div className="mt-12 flex flex-1 flex-col gap-12">
          {/* ── The Garage ───────────────────────────────────── */}
          <section className="animate-fade-in-up animation-delay-100">
            <Overline>The Garage</Overline>
            <h2 className="mt-3 font-display text-2xl font-black text-ds-white">
              The Reads
            </h2>
            <div className="mt-5 space-y-3">
              {GARAGE_POSTS.map((post) => (
                <Link
                  key={post.href}
                  href={post.href}
                  className="group block rounded-2xl border border-white/[0.06] bg-ds-black-elevated p-5 transition-all duration-300 hover:border-ds-red/40 hover:bg-ds-black-charcoal"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-base font-bold leading-snug text-ds-white">
                        {post.title}
                      </h3>
                      <p className="mt-1 text-xs text-ds-gray-400">{post.subtitle}</p>
                    </div>
                    <span className="text-ds-red">
                      <Arrow />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-ds-red/70">
                      Read
                    </span>
                    <p className="text-xs italic leading-relaxed text-ds-gray-500">
                      {post.hook}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── The Club ─────────────────────────────────────── */}
          <section className="animate-fade-in-up animation-delay-200">
            <Overline>The Club</Overline>
            <Link
              href="/community"
              className="group mt-4 block overflow-hidden rounded-2xl border border-ds-red/30 bg-gradient-to-br from-ds-red/10 to-transparent p-6 transition-all duration-300 hover:border-ds-red/60"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ds-red/30 bg-ds-red/10">
                  <svg
                    className="h-6 w-6 text-ds-red"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-ds-red/70">
                    Become part of the scene
                  </p>
                  <h3 className="font-display text-xl font-black text-ds-white">
                    Join the Club
                  </h3>
                </div>
                <span className="text-ds-red">
                  <Arrow />
                </span>
              </div>
            </Link>
          </section>

          {/* ── The Shop ─────────────────────────────────────── */}
          <section className="animate-fade-in-up animation-delay-300">
            <Overline>The Shop</Overline>
            <h2 className="mt-3 font-display text-2xl font-black text-ds-white">
              Gear Up
            </h2>
            <div className="mt-5 space-y-3">
              {SHOP_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-ds-black-elevated px-5 py-4 transition-all duration-300 hover:border-ds-red/40 hover:bg-ds-black-charcoal"
                >
                  <span className="font-display text-base font-bold text-ds-white">
                    {link.label}
                  </span>
                  <span className="text-ds-red">
                    <Arrow />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <footer className="mt-14 animate-fade-in-up animation-delay-400 text-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <p className="mt-6 font-display text-sm uppercase tracking-[0.2em] text-ds-gray-500">
            {TAGLINE}
          </p>
        </footer>
      </div>
    </div>
  );
}
