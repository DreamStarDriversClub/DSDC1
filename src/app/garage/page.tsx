"use client";

import { useState } from "react";
import { GarageGallery } from "@/components/garage/GarageGallery";
import { SubmitForm } from "@/components/garage/SubmitForm";

export default function GaragePage() {
  const [submitOpen, setSubmitOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleSuccess() {
    setSubmitOpen(false);
    // Trigger gallery refresh
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-ds-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/[0.06] bg-ds-black-charcoal">
        {/* Background glow */}
        <div className="absolute inset-0 bg-hero-glow" />

        <div className="relative mx-auto max-w-7xl px-4 section-padding sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            {/* Icon */}
            <div className="mb-6 inline-flex rounded-2xl border border-ds-red/20 bg-ds-red/10 p-4">
              <svg
                className="h-8 w-8 text-ds-red"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </div>

            <h1 className="font-display text-display-lg text-ds-white">
              Dream Star Garage
            </h1>
            <p className="mt-4 text-lg text-ds-gray-400">
              Show us your build. The cars, the gear, the culture — this is where
              the Dream Star community lives.
            </p>

            <button
              onClick={() => setSubmitOpen(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ds-red px-8 py-3.5 text-sm font-semibold text-white shadow-brand-glow-sm transition-all hover:bg-ds-red-500 hover:shadow-brand-glow"
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
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Submit Your Build
            </button>
          </div>
        </div>

        {/* Decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ds-red/30 to-transparent" />
      </section>

      {/* Gallery Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Sticky submit bar for mobile */}
        <div className="sticky top-20 z-30 mb-8 flex items-center justify-between rounded-xl border border-white/[0.06] bg-ds-black-elevated/90 px-4 py-3 backdrop-blur-md sm:hidden">
          <div>
            <h2 className="text-sm font-semibold text-ds-white">
              Community Builds
            </h2>
            <p className="text-xs text-ds-gray-500">
              Scroll to explore
            </p>
          </div>
          <button
            onClick={() => setSubmitOpen(true)}
            className="rounded-full bg-ds-red px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-ds-red-500"
          >
            + Submit
          </button>
        </div>

        {/* Desktop title */}
        <div className="mb-8 hidden items-center justify-between sm:flex">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-ds-gray-400">
              Community Builds
            </h2>
            <p className="mt-1 text-xs text-ds-gray-600">
              The latest from the garage
            </p>
          </div>
        </div>

        <GarageGallery key={refreshKey} />
      </section>

      {/* Submit Form Modal */}
      <SubmitForm
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
