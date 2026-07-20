/**
 * Format a price number to USD currency string.
 */
export function formatPrice(price: number | { toString(): string }): string {
  const num = typeof price === "number" ? price : parseFloat(price.toString());
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: num % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(num);
}

/** Product sort options */
export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A – Z", value: "name-asc" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

/**
 * Convert a hex color to a bg-gradient-friendly rgba.
 * e.g. "#DC2626" -> "rgba(220,38,38,0.3)"
 */
export function colorToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Generate a consistent gradient from a slug string */
const PALETTE = [
  ["#DC2626", "#7F1D1D"],
  ["#991B1B", "#450A0A"],
  ["#B91C1C", "#0A0A0A"],
  ["#7F1D1D", "#111111"],
  ["#DC2626", "#1A1A1A"],
];

export function productGradient(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % PALETTE.length;
  const [from, to] = PALETTE[idx];
  return `bg-gradient-to-br from-[${from}]/40 to-[${to}]/30`;
}
