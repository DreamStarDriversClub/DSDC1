"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Subcategory {
  name: string;
  slug: string;
}

interface SubcategoryFilterProps {
  subcategories: Subcategory[];
  currentSlug?: string;
}

export function SubcategoryFilter({
  subcategories,
  currentSlug,
}: SubcategoryFilterProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={pathname}
        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
          !currentSlug
            ? "border-ds-red bg-ds-red/10 text-ds-red"
            : "border-white/[0.08] bg-ds-black-charcoal text-ds-gray-400 hover:border-ds-red/30 hover:text-ds-white"
        }`}
      >
        All
      </Link>
      {subcategories.map((sub) => {
        const href = `/shop/${pathname.split("/").pop()}/${sub.slug}`;
        const isActive = currentSlug === sub.slug;
        return (
          <Link
            key={sub.slug}
            href={href}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
              isActive
                ? "border-ds-red bg-ds-red/10 text-ds-red"
                : "border-white/[0.08] bg-ds-black-charcoal text-ds-gray-400 hover:border-ds-red/30 hover:text-ds-white"
            }`}
          >
            {sub.name}
          </Link>
        );
      })}
    </div>
  );
}
