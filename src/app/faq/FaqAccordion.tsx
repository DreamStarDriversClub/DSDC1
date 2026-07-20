"use client";

import { useState } from "react";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqCategory {
  id: string;
  title: string;
  items: FaqItem[];
}

interface FaqAccordionProps {
  categories: FaqCategory[];
}

function FaqItemRow({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-white/[0.06] last:border-none">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-ds-white"
      >
        <span className="text-base font-semibold text-ds-white">
          {item.question}
        </span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? "rotate-180 border-ds-red/40 bg-ds-red/10 text-ds-red"
              : "border-ds-gray-700 text-ds-gray-500"
          }`}
        >
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm leading-relaxed text-ds-gray-400">
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FaqAccordion({ categories }: FaqAccordionProps) {
  // Track which items are open: "categoryIndex-itemIndex"
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="space-y-10">
      {categories.map((category, catIdx) => (
        <div key={category.id} id={category.id}>
          <h3 className="font-display text-lg font-bold text-ds-white">
            {category.title}
          </h3>
          <div className="mt-4 rounded-2xl border border-white/[0.06] bg-ds-black-charcoal px-5">
            {category.items.map((item, itemIdx) => {
              const key = `${catIdx}-${itemIdx}`;
              return (
                <FaqItemRow
                  key={key}
                  item={item}
                  isOpen={openItems.has(key)}
                  onToggle={() => toggleItem(key)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
