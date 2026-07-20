"use client";

import { useEffect, useCallback } from "react";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const toggle = useCallback(() => {
    if (open) {
      onClose();
    }
    // Opening is handled by the parent via props
  }, [open, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle: if open, close; if closed, open via parent
        if (open) {
          onClose();
        }
        // For opening, the parent handles this via the open prop
      }
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg animate-fade-in-up px-4">
        <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-ds-black-charcoal shadow-2xl">
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3">
            <svg
              className="h-5 w-5 shrink-0 text-ds-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products, parts, articles…"
              autoFocus
              className="w-full bg-transparent text-sm text-ds-white placeholder-ds-gray-500 focus:outline-none"
            />
            <kbd className="hidden rounded-md border border-ds-gray-700 px-2 py-0.5 text-xs text-ds-gray-400 sm:inline-block">
              ESC
            </kbd>
          </div>

          {/* Results area (placeholder) */}
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-ds-gray-400">
              Start typing to search products and content.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
