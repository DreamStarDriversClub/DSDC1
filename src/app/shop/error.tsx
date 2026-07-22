"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface ShopErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ShopError({ error, reset }: ShopErrorProps) {
  useEffect(() => {
    console.error("Shop route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-ds-black px-4 text-center">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-20" />

      <div className="relative z-10">
        {/* Engine warning icon */}
        <svg
          className="mx-auto h-16 w-16 text-ds-red/30"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>

        <h1 className="mt-6 font-display text-4xl font-black tracking-tight text-ds-white md:text-5xl">
          Engine Cut
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-ds-gray-400">
          Something tripped the kill switch. This page hit a problem it
          couldn&apos;t recover from — but the build isn&apos;t dead. Try firing it up
          again.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-ds-red px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-ds-red-700 hover:shadow-brand-glow"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
            Try Again
          </button>
          <Link
            href="/shop"
            className="text-sm text-ds-gray-500 transition-colors hover:text-ds-gray-300"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
