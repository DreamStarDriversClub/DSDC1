import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Size Guide",
  description:
    "Find the perfect fit. Dream Star Drivers Club size guide for apparel — tees, hoodies, and more. True-to-size measurements for every build.",
  openGraph: {
    title: `Size Guide | ${BRAND_NAME}`,
    description:
      "Find the perfect fit. Size guide for Dream Star Drivers Club apparel.",
  },
};

export default function SizeGuidePage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Find Your Fit
            </span>
            <h1 className="mt-4 font-display text-display-lg text-ds-white">
              Size <span className="text-ds-red">Guide</span>
            </h1>
            <div className="mx-auto mt-6 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ds-gray-300">
              Every body is different, and so is every build. Our detailed size
              charts are being dialed in — precise measurements for every piece
              in the collection, so you can order with confidence.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Coming Soon ─────────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <div className="mx-auto max-w-2xl">
            {/* Placeholder card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-10 text-center sm:p-14">
              <div className="absolute inset-0 bg-gradient-to-br from-ds-red-950/20 via-transparent to-transparent" />
              <div className="absolute left-6 top-6 h-8 w-[1px] bg-ds-red/20" />
              <div className="absolute left-6 top-6 h-[1px] w-8 bg-ds-red/20" />
              <div className="absolute bottom-6 right-6 h-8 w-[1px] bg-ds-red/20" />
              <div className="absolute bottom-6 right-6 h-[1px] w-8 bg-ds-red/20" />
              <div className="relative z-10">
                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-ds-red/20 bg-ds-red/10">
                  <svg
                    className="h-8 w-8 text-ds-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 font-display text-2xl font-bold text-ds-white">
                  Size Charts Coming Soon
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ds-gray-300">
                  We&apos;re putting together detailed measurement guides for
                  every apparel piece in the Dream Star collection — from tee
                  chest widths to hoodie sleeve lengths. In the meantime, our
                  gear runs true to size with a modern, slightly tailored fit.
                </p>
              </div>
            </div>

            {/* Quick help */}
            <div className="mt-8 text-center">
              <p className="text-sm text-ds-gray-400">
                Need sizing help right now?{" "}
                <Link
                  href="/faq#sizing"
                  className="text-ds-red underline underline-offset-2 transition-colors hover:text-ds-red-400"
                >
                  Check our FAQ
                </Link>{" "}
                or{" "}
                <Link
                  href="/contact"
                  className="text-ds-red underline underline-offset-2 transition-colors hover:text-ds-red-400"
                >
                  reach out to the crew
                </Link>
                .
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Bottom accent ───────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
    </>
  );
}
