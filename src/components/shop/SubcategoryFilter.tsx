"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface SubcategoryFilterProps {
  subcategories: { name: string; slug: string }[];
}

export function SubcategoryFilter({ subcategories }: SubcategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSubcategory = searchParams.get("subcategory") || "";

  const setSubcategory = useCallback(
    (slug: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (slug) {
        params.set("subcategory", slug);
      } else {
        params.delete("subcategory");
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  if (subcategories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => setSubcategory("")}
        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
          !currentSubcategory
            ? "border-ds-red/50 bg-ds-red/10 text-ds-red"
            : "border-white/[0.08] bg-transparent text-ds-gray-400 hover:border-white/[0.15] hover:text-ds-white"
        }`}
      >
        All
      </button>
      {subcategories.map((sub) => (
        <button
          key={sub.slug}
          onClick={() => setSubcategory(sub.slug)}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
            currentSubcategory === sub.slug
              ? "border-ds-red/50 bg-ds-red/10 text-ds-red"
              : "border-white/[0.08] bg-transparent text-ds-gray-400 hover:border-white/[0.15] hover:text-ds-white"
          }`}
        >
          {sub.name}
        </button>
      ))}
    </div>
  );
}
