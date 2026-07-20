"use client";

import { SORT_OPTIONS, type SortValue } from "@/lib/utils";

interface SortDropdownProps {
  value: SortValue;
  onChange: (value: SortValue) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-ds-gray-500 whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortValue)}
        className="rounded-lg border border-white/[0.08] bg-ds-black-charcoal px-3 py-2 text-sm text-ds-white focus:outline-none focus:ring-2 focus:ring-ds-red/40"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
