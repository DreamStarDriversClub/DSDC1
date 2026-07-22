import Link from "next/link";
import { Container } from "@/components/ui/Container";

export default function ShopNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-ds-black px-4 text-center">
      {/* Subtle background accent */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-30" />

      <div className="relative z-10">
        {/* Hoshi icon — friendly brand mascot touch */}
        <svg
          className="mx-auto h-20 w-20 text-ds-red/20"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>

        <h1 className="mt-6 font-display text-6xl font-black tracking-tight text-ds-red md:text-8xl">
          404
        </h1>
        <p className="mt-4 text-xl font-semibold text-ds-white">
          Dead End — No Parts Here
        </p>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ds-gray-400">
          This road doesn&apos;t lead anywhere. Maybe it never did. But the garage is
          still open — head back and find what you&apos;re looking for.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-xl bg-ds-red px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-ds-red-700 hover:shadow-brand-glow"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Browse the Garage
          </Link>
          <Link
            href="/"
            className="text-sm text-ds-gray-500 transition-colors hover:text-ds-gray-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
