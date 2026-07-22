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

export const TAGLINE = "Drive the Dream";

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/dreamstardc",
  youtube: "https://youtube.com/@dreamstardc",
  twitter: "https://twitter.com/dreamstardc",
  tiktok: "https://tiktok.com/@dreamstardc",
} as const;

export const NEWSLETTER = {
  title: "Join the Club",
  description: "Get exclusive drops, build tips, and event invites.",
} as const;
