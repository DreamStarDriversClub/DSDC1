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
  placeholder: "Enter your email",
  buttonText: "Sign Up",
} as const;

export const NAV_LINKS = [
  {
    label: "Shop",
    href: "/shop",
    children: [
      { label: "All Products", href: "/shop/all", description: "Browse everything" },
      { label: "Apparel", href: "/shop/apparel", description: "Tees, hoodies, hats" },
      { label: "Accessories", href: "/shop/accessories", description: "Stickers, keychains, patches" },
      { label: "DS Performance", href: "/shop/performance", description: "Rotary & 2JZ parts" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

export const FOOTER_LINK_GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop/all" },
      { label: "Apparel", href: "/shop/apparel" },
      { label: "Accessories", href: "/shop/accessories" },
      { label: "DS Performance", href: "/shop/performance" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Events", href: "/events" },
      { label: "Community", href: "/community" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Disclaimer", href: "/disclaimer" },
    ],
  },
] as const;
