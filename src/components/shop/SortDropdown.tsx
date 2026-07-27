"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SORT_OPTIONS, type SortValue } from "@/lib/utils";

/**
 * Sort dropdown that reads/writes the `sort` URL search param.
 *
 * Drop it into any category page — it manages its own state via the URL so
 * the server component can read `searchParams.sort` and re-sort products.
 */
export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = (searchParams.get("sort") as SortValue) || "featured";

  const setSort = useCallback(
    (value: SortValue) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "featured") {
        params.set("sort", value);
      } else {
        params.delete("sort");
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="sort-select"
        className="text-sm text-ds-gray-400 whitespace-nowrap"
      >
        Sort by:
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={currentSort}
          onChange={(e) => setSort(e.target.value as SortValue)}
          className="appearance-none rounded-lg border border-white/[0.08] bg-ds-black-charcoal py-2 pl-3 pr-9 text-sm text-ds-white transition-colors hover:border-white/[0.15] focus:border-ds-red/40 focus:outline-none focus:ring-2 focus:ring-ds-red/20 cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-ds-black-charcoal text-ds-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ds-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
