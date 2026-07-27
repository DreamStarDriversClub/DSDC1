"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS, type SortValue } from "@/lib/utils";

interface CategoryOption {
  name: string;
  slug: string;
}

interface ProductFiltersProps {
  categories: CategoryOption[];
  currentCategory?: string;
  currentSort?: string;
}

export function ProductFilters({
  categories,
  currentCategory,
  currentSort = "featured",
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/shop/all?${params.toString()}`, { scroll: false });
  }

  return (
    <>
      {/* Category filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams("category", "")}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
            !currentCategory
              ? "border-ds-red bg-ds-red/10 text-ds-red"
              : "border-white/[0.08] bg-ds-black-charcoal text-ds-gray-300 hover:border-ds-red/30 hover:text-ds-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => updateParams("category", cat.slug)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
              currentCategory === cat.slug
                ? "border-ds-red bg-ds-red/10 text-ds-red"
                : "border-white/[0.08] bg-ds-black-charcoal text-ds-gray-300 hover:border-ds-red/30 hover:text-ds-white"
            }`}
          >
            {cat.slug === "ds-performance" ? "DS Performance" : cat.name}
          </button>
        ))}
      </div>

      {/* Sort dropdown */}
      <div className="flex items-center gap-2">
        <label htmlFor="all-sort" className="text-sm text-ds-gray-400 whitespace-nowrap">
          Sort by:
        </label>
        <div className="relative">
          <select
            id="all-sort"
            value={currentSort}
            onChange={(e) => updateParams("sort", e.target.value)}
            className="appearance-none rounded-lg border border-white/[0.08] bg-ds-black-charcoal py-2 pl-3 pr-9 text-sm text-ds-white transition-colors hover:border-white/[0.15] focus:border-ds-red/40 focus:outline-none focus:ring-2 focus:ring-ds-red/20 cursor-pointer"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-ds-black-charcoal text-ds-white">
                {opt.label}
              </option>
            ))}
          </select>
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
    </>
  );
}
