export const BRAND_NAME = "Dream Star Drivers Club";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dreamstardc.com";

export const FREE_SHIPPING_THRESHOLD = 75;

export const SHIPPING_RATES = {
  standard: { price: 5.99, label: "Standard Shipping", days: "5-7" },
  express: { price: 14.99, label: "Express Shipping", days: "2-3" },
  free: { price: 0, label: "Free Shipping", days: "5-7" },
} as const;

export const TAX_RATE = 0.08;

export const ITEMS_PER_PAGE = 12;

/* ── Category slugs ─────────────────────────────────────── */

export const CATEGORIES = {
  APPAREL: "apparel",
  ACCESSORIES: "accessories",
  PERFORMANCE: "ds-performance",
} as const;
