// ─── Brand ────────────────────────────────────────────────────────────────
export const BRAND_NAME = "Dream Star Drivers Club";
export const TAGLINE = "Chase the Horizon";
export const BRAND_SHORT = "DSDC";

// ─── Site URL ────────────────────────────────────────────────────────────────
export const SITE_URL = "https://dreamstardc.com";

// ─── Colors ────────────────────────────────────────────────────────────────
export const COLORS = {
  red: {
    DEFAULT: "#DC2626",
    light: "#EF4444",
    dark: "#B91C1C",
    muted: "rgba(220, 38, 38, 0.15)",
  },
  black: {
    deepest: "#050505",
    DEFAULT: "#0A0A0A",
    elevated: "#111111",
    charcoal: "#1A1A1A",
    darkgray: "#2A2A2A",
  },
  gray: {
    700: "#333333",
    500: "#6B7280",
    400: "#9CA3AF",
    300: "#B0B0B0",
    200: "#D1D5DB",
    100: "#E5E7EB",
  },
  gold: {
    DEFAULT: "#D4AF37",
    light: "#E5C158",
    dark: "#B8960F",
  },
  white: "#FFFFFF",
} as const;

// ─── Social Links ──────────────────────────────────────────────────────────
export const SOCIAL_LINKS = {
  instagram: "https://www.instagram.com/dreamstardriversclub/",
  youtube: "https://youtube.com/@dreamstardriversclub",
  twitter: "https://twitter.com/dreamstardc",
  tiktok: "https://tiktok.com/@dreamstardriversclub",
  discord: "https://discord.gg/dreamstardriversclub",
};

// ─── Navigation ────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  {
    label: "Shop",
    href: "#",
    children: [
      { label: "Apparel", href: "/shop/apparel", description: "Premium streetwear" },
      { label: "Accessories", href: "/shop/accessories", description: "Stickers, keychains & more" },
      { label: "DS Performance", href: "/shop/performance", description: "Rotary & 2JZ parts" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
];

// ─── Footer Links ──────────────────────────────────────────────────────────
export const FOOTER_LINK_GROUPS = [
  {
    title: "Shop",
    links: [
      { label: "Apparel", href: "/shop/apparel" },
      { label: "Accessories", href: "/shop/accessories" },
      { label: "DS Performance", href: "/shop/performance" },
    ],
  },
  {
    title: "Club",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Community", href: "/community" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQ", href: "/faq" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

// ─── Newsletter ────────────────────────────────────────────────────────────
export const NEWSLETTER = {
  heading: "Join the Club",
  description:
    "Be the first to know about new drops, restocks, and exclusive club content.",
  placeholder: "your@email.com",
  buttonText: "Sign Up",
};

// ─── Cart ──────────────────────────────────────────────────────────────────
export const FREE_SHIPPING_THRESHOLD = 75;
export const CURRENCY = "USD";
export const SHIPPING_RATES = {
  standard: { price: 5.99, label: "Standard Shipping", days: "5-7 business days" },
  express: { price: 14.99, label: "Express Shipping", days: "2-3 business days" },
  free: { price: 0, label: "Free Shipping", days: "5-7 business days" },
} as const;
export const TAX_RATE = 0.08;
