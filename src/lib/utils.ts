/* ── Classname utility ──────────────────────────────────── */

type ClassValue = string | number | boolean | null | undefined | ClassValue[] | Record<string, boolean>;

function toVal(mix: ClassValue): string {
  if (typeof mix === "string" || typeof mix === "number") return String(mix);
  if (typeof mix === "boolean" || mix === null || mix === undefined) return "";
  if (Array.isArray(mix)) return mix.map(toVal).filter(Boolean).join(" ");
  if (typeof mix === "object") {
    return Object.entries(mix)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(" ");
  }
  return "";
}

export function cn(...inputs: ClassValue[]): string {
  return inputs.map(toVal).filter(Boolean).join(" ");
}

/* ── Currency formatting ────────────────────────────────── */

export function formatPrice(
  value: number | string | { toString(): string }
): string {
  const num =
    typeof value === "number"
      ? value
      : parseFloat(
          typeof value === "string" ? value : value.toString()
        );
  if (isNaN(num)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(num);
}

// Alias for backward compatibility
export const formatCurrency = formatPrice;

/* ── Product card gradients ─────────────────────────────── */

const gradients = {
  apparel: "from-ds-red-950/20 via-ds-red-900/10 to-ds-black",
  accessories: "from-ds-gold-muted via-ds-black to-ds-black",
  performance: "from-ds-red-950/30 via-ds-black to-ds-black",
  default: "from-ds-black-charcoal via-ds-black to-ds-black",
};

export function productGradient(slug: string): string {
  if (!slug) return gradients.default;
  const bg = slug.toLowerCase();
  if (bg.includes("apparel") || bg.includes("tee") || bg.includes("hoodie") || bg.includes("hat") || bg.includes("crew")) {
    return `bg-gradient-to-br ${gradients.apparel}`;
  }
  if (bg.includes("accessories") || bg.includes("acc") || bg.includes("sticker") || bg.includes("keychain") || bg.includes("patch")) {
    return `bg-gradient-to-br ${gradients.accessories}`;
  }
  if (bg.includes("performance") || bg.includes("perf") || bg.includes("rotary") || bg.includes("2jz") || bg.includes("engine") || bg.includes("turbo") || bg.includes("exhaust") || bg.includes("intercooler")) {
    return `bg-gradient-to-br ${gradients.performance}`;
  }
  return `bg-gradient-to-br ${gradients.default}`;
}

/* ── Misc helpers ───────────────────────────────────────── */

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A-Z", value: "name-asc" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];
