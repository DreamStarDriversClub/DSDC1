import Link from "next/link";
import { BRAND_NAME, TAGLINE, SOCIAL_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { OrganizationSchema, WebSiteSchema } from "@/components/ui/SchemaOrg";

/* ── Sample Data ─────────────────────────────────────────────────────────── */

const featuredProducts = [
  {
    id: "rotary-spirit-tee",
    name: "Rotary Spirit Tee",
    price: 34.99,
    category: "Apparel",
    categoryBadge: "red" as const,
    gradient: "from-ds-red-900/40 to-ds-red-950/20",
    icon: (
      <svg className="h-8 w-8 text-ds-red/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
  },
  {
    id: "touge-runner-hoodie",
    name: "Touge Runner Hoodie",
    price: 74.99,
    category: "Apparel",
    categoryBadge: "red" as const,
    gradient: "from-ds-red-950/50 to-ds-black-charcoal",
    icon: (
      <svg className="h-8 w-8 text-ds-red/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16v16H4V4zm4 4h8v8H8V8z" />
      </svg>
    ),
  },
  {
    id: "13b-heartbeat-decal",
    name: "13B Heartbeat Decal",
    price: 8.99,
    category: "Accessories",
    categoryBadge: "gold" as const,
    gradient: "from-ds-gold-dark/30 to-ds-gold-muted/10",
    icon: (
      <svg className="h-8 w-8 text-ds-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
      </svg>
    ),
  },
  {
    id: "dream-star-lanyard",
    name: "Dream Star Lanyard",
    price: 14.99,
    category: "Accessories",
    categoryBadge: "gold" as const,
    gradient: "from-ds-gold-dark/30 to-ds-gold-muted/10",
    icon: (
      <svg className="h-8 w-8 text-ds-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      </svg>
    ),
  },
  {
    id: "rx7-fd-street-port-kit",
    name: "RX-7 FD Street Port Kit",
    price: 2499.99,
    category: "DS Performance",
    categoryBadge: "red" as const,
    gradient: "from-ds-red-900/50 to-ds-black-charcoal",
    icon: (
      <svg className="h-8 w-8 text-ds-red/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
  },
  {
    id: "2jz-timing-belt-kit",
    name: "2JZ-GTE Timing Belt Kit",
    price: 189.99,
    category: "DS Performance",
    categoryBadge: "red" as const,
    gradient: "from-ds-red-900/40 to-ds-red-950/20",
    icon: (
      <svg className="h-8 w-8 text-ds-red/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.39.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.774c-.39-.39-.44-1.002-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738c-.32-.447-.269-1.06.12-1.45l.774-.773a1.125 1.125 0 011.449-.12l.738.527c.35.25.806.272 1.203.107.397-.165.71-.505.781-.929l.149-.894z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    quote:
      "Best rotary parts I've ever run. The 13B rebuild kit was complete and the quality is unmatched.",
    name: "Marcus R.",
    car: "RX-7 FD",
    stars: 5,
  },
  {
    quote:
      "Finally a brand that gets car culture. The hoodie is my new favorite — quality is insane.",
    name: "Sarah K.",
    car: "MK4 Supra",
    stars: 5,
  },
  {
    quote:
      "Dream Star isn't just a store. It's a community. Met some of my best track day friends through them.",
    name: "David L.",
    car: "RX-8",
    stars: 5,
  },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: price % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(price);
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < count ? "text-ds-gold" : "text-ds-gray-700"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Sakura Petals ────────────────────────────────────────────────────────── */

const sakuraPetals = [
  { left: "5%", top: "15%", delay: "0s", size: "12px", duration: "12s" },
  { left: "15%", top: "30%", delay: "3s", size: "8px", duration: "14s" },
  { left: "85%", top: "20%", delay: "5s", size: "10px", duration: "13s" },
  { left: "75%", top: "55%", delay: "1s", size: "14px", duration: "11s" },
  { left: "30%", top: "60%", delay: "7s", size: "9px", duration: "15s" },
  { left: "60%", top: "10%", delay: "9s", size: "11px", duration: "12.5s" },
  { left: "92%", top: "40%", delay: "4s", size: "8px", duration: "13.5s" },
  { left: "10%", top: "75%", delay: "2s", size: "10px", duration: "14.5s" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HomePage Component
   ═══════════════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
      {/* ══════════════════════════════════════════════════════════════════
          Section 1: Hero
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[95vh] items-center overflow-hidden bg-ds-black">
        {/* RX-7 hero banner background */}
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/rx7-sakura.png')",
            opacity: 0.35,
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-ds-black/60" />
        {/* Background effects */}
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />

        {/* Sakura petals */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {sakuraPetals.map((petal, i) => (
            <div
              key={i}
              className="absolute animate-sakura-drift rounded-full opacity-0"
              style={{
                left: petal.left,
                top: petal.top,
                width: petal.size,
                height: petal.size,
                animationDelay: petal.delay,
                animationDuration: petal.duration,
                background:
                  "radial-gradient(circle, rgba(251, 191, 191, 0.6) 0%, rgba(220, 38, 38, 0.2) 100%)",
                boxShadow: "0 0 6px rgba(251, 191, 191, 0.3)",
              }}
            />
          ))}
        </div>

        {/* Star streaks */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 top-1/4 h-px w-40 animate-star-streak bg-gradient-to-r from-transparent via-ds-red/40 to-transparent" />
          <div
            className="absolute -left-32 top-1/2 h-px w-32 animate-star-streak bg-gradient-to-r from-transparent via-ds-gold/30 to-transparent"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute -left-24 top-3/4 h-px w-36 animate-star-streak bg-gradient-to-r from-transparent via-ds-red/25 to-transparent"
            style={{ animationDelay: "5.5s" }}
          />
        </div>

        <Container className="relative z-10 py-20">
          <div className="mx-auto max-w-3xl text-center opacity-start animate-fade-in-up">
            {/* Brand mark — animated slow zoom */}
            <div className="mx-auto mb-6 flex items-center justify-center">
              <img
                src="/logo%20-%20white.png"
                alt="Dream Star Drivers Club"
                className="h-14 w-auto object-contain animate-pulse-glow"
                loading="eager"
              />
            </div>

            {/* Headline */}
            <h1 className="font-display text-display-xl text-ds-white">
              <span className="text-gradient-static">Dream Star</span>
              <br />
              <span className="text-ds-red">Drivers Club</span>
            </h1>

            {/* Tagline */}
            <p className="mt-4 font-display text-xl tracking-wide text-ds-gold sm:text-2xl">
              {TAGLINE}
            </p>

            {/* Subheadline */}
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ds-gray-400 sm:text-lg">
              Premium apparel, accessories, and Mazda rotary performance parts
              inspired by Japanese automotive culture.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/shop/apparel">
                <Button variant="primary" size="lg">
                  Shop Apparel
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </Link>
              <Link href="/shop/performance">
                <Button variant="outline" size="lg">
                  Explore Rotary Parts
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </Link>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-24 flex justify-center opacity-start animate-fade-in delay-700 animate-fill-forwards">
            <div className="flex flex-col items-center gap-2 text-ds-gray-600">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">
                Scroll
              </span>
              <div className="h-8 w-[1px] animate-pulse bg-gradient-to-b from-ds-gray-600 to-transparent" />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Section 2: Featured Collections
          ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-ds-black-deepest section-padding">
        <Container>
          <SectionHeading
            eyebrow="Shop by Category"
            heading="Built for Enthusiasts"
            description="From premium apparel to performance parts, everything crafted for those who live the car life."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Apparel Card */}
            <Link href="/shop/apparel" className="group block">
              <Card hover padding="none" className="overflow-hidden">
                <div className="relative flex h-52 items-center justify-center bg-ds-black-elevated overflow-hidden">
                  {/* Image zoom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-ds-red-900/20 to-transparent transition-transform duration-700 ease-out group-hover:scale-110" />
                  <div className="relative z-10 text-center">
                    <svg
                      className="mx-auto h-14 w-14 text-ds-red/50 transition-transform duration-500 group-hover:scale-110 group-hover:text-ds-red/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                  </div>
                  {/* Red glow on hover */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-ds-red/5 to-transparent" />
                </div>
                <div className="p-6">
                  <Badge variant="red" size="sm" className="mb-2">
                    New Drop
                  </Badge>
                  <h3 className="font-display text-lg font-bold text-ds-white transition-colors group-hover:text-ds-red">
                    Apparel
                  </h3>
                  <p className="mt-1 text-sm text-ds-gray-500">
                    Premium streetwear with authentic JDM styling.
                  </p>
                </div>
              </Card>
            </Link>

            {/* Accessories Card */}
            <Link href="/shop/accessories" className="group block">
              <Card hover padding="none" className="overflow-hidden">
                <div className="relative flex h-52 items-center justify-center bg-ds-black-elevated overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-ds-gold-dark/15 to-transparent transition-transform duration-700 ease-out group-hover:scale-110" />
                  <div className="relative z-10 text-center">
                    <svg
                      className="mx-auto h-14 w-14 text-ds-gold/40 transition-transform duration-500 group-hover:scale-110 group-hover:text-ds-gold/60"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 6h.008v.008H6V6z"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-ds-gold/5 to-transparent" />
                </div>
                <div className="p-6">
                  <Badge variant="gold" size="sm" className="mb-2">
                    Limited
                  </Badge>
                  <h3 className="font-display text-lg font-bold text-ds-white transition-colors group-hover:text-ds-red">
                    Accessories
                  </h3>
                  <p className="mt-1 text-sm text-ds-gray-500">
                    Stickers, keychains, lanyards, and club gear.
                  </p>
                </div>
              </Card>
            </Link>

            {/* Performance Card */}
            <Link href="/shop/performance" className="group block">
              <Card hover padding="none" className="overflow-hidden">
                <div className="relative flex h-52 items-center justify-center bg-ds-black-elevated overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-ds-red-900/20 to-transparent transition-transform duration-700 ease-out group-hover:scale-110" />
                  <div className="relative z-10 text-center">
                    <svg
                      className="mx-auto h-14 w-14 text-ds-red/50 transition-transform duration-500 group-hover:scale-110 group-hover:text-ds-red/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"
                      />
                    </svg>
                  </div>
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-ds-red/5 to-transparent" />
                </div>
                <div className="p-6">
                  <Badge variant="red" size="sm" className="mb-2">
                    Performance
                  </Badge>
                  <h3 className="font-display text-lg font-bold text-ds-white transition-colors group-hover:text-ds-red">
                    DS Performance
                  </h3>
                  <p className="mt-1 text-sm text-ds-gray-500">
                    Rotary &amp; 2JZ performance parts — built by enthusiasts.
                  </p>
                </div>
              </Card>
            </Link>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Section 3: New Arrivals
          ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-ds-black section-padding">
        <Container>
          <SectionHeading
            eyebrow="Fresh Drops"
            heading="New Arrivals"
            description="The latest gear, parts, and accessories — freshest club drops this season."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.category.toLowerCase().replace(/\s+/g, "-")}`}
                className="group block"
              >
                <Card hover padding="none" className="overflow-hidden">
                  {/* Product image placeholder */}
                  <div
                    className={`relative flex h-56 items-center justify-center bg-gradient-to-br ${product.gradient} overflow-hidden`}
                  >
                    <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110" />
                    <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
                      {product.icon}
                    </div>
                    {/* Quick View overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                      <div className="flex items-center justify-center bg-ds-black/80 backdrop-blur-sm py-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-ds-white">
                          Quick View
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant={product.categoryBadge} size="sm">
                        {product.category}
                      </Badge>
                    </div>
                    <h3 className="font-display text-sm font-bold text-ds-white transition-colors group-hover:text-ds-red">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-lg font-bold text-ds-white">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* View All CTA */}
          <div className="mt-10 text-center">
            <Link href="/shop/apparel">
              <Button variant="outline" size="lg">
                View All Products
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Section 4: Brand Story Teaser
          ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-ds-black-deepest section-padding">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Copy */}
            <div>
              <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
                Our Story
              </span>
              <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl lg:text-5xl">
                Born from Passion.
                <br />
                Built for the Drive.
              </h2>
              <div className="mt-4 h-[3px] w-12 rounded-full bg-ds-red" />
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ds-gray-400 sm:text-lg">
                Dream Star Drivers Club was forged on the mountains of the
                Tri-state area, inspired by the legendary mountain roads of
                Japan, and now based in the Vegas Valley — where rotary engines
                scream to 9,000 RPM, 2JZ engines test the limits, and every
                corner tells a tale. We're more than a brand; we're a tribute
                to the golden era of JDM engineering. From the legendary 13B
                rotary to the bulletproof 2JZ-GTE, we celebrate the machines
                and the culture that raised us.
              </p>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-ds-gray-500">
                Every product we make — from the stitching on our hoodies to the
                tolerances in our performance kits — is a love letter to
                Japanese car culture. This isn't just merch. This is membership.
              </p>
              <div className="mt-8">
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Our Story
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: Stylized image placeholder */}
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal lg:aspect-auto lg:h-full lg:min-h-[450px]">
              {/* Stylized backdrop */}
              <div className="absolute inset-0 bg-gradient-to-br from-ds-red-950/30 via-ds-black-charcoal to-ds-gold-dark/10" />
              {/* Grid overlay */}
              <div className="absolute inset-0 bg-grid opacity-30" />
              {/* Center emblem */}
              <div className="relative z-10 text-center">
                <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-2 border-ds-red/30 bg-ds-black/60 shadow-brand-glow backdrop-blur-sm">
                  <span className="font-display text-5xl font-black text-ds-red">
                    DS
                  </span>
                </div>
                <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.3em] text-ds-gray-500">
                  Est. 2020
                </p>
              </div>
              {/* Decorative corner accents */}
              <div className="absolute left-4 top-4 h-8 w-[1px] bg-ds-red/30" />
              <div className="absolute left-4 top-4 h-[1px] w-8 bg-ds-red/30" />
              <div className="absolute bottom-4 right-4 h-8 w-[1px] bg-ds-red/30" />
              <div className="absolute bottom-4 right-4 h-[1px] w-8 bg-ds-red/30" />
            </div>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Section 5: Customer Testimonials
          ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-ds-black section-padding">
        <Container>
          <SectionHeading
            eyebrow="Testimonials"
            heading="What Drivers Say"
            description="Real enthusiasts. Real builds. Real opinions."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Card key={i} padding="lg" className="flex flex-col">
                {/* Stars */}
                <StarRating count={t.stars} />

                {/* Quote */}
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ds-gray-300">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Attribution */}
                <div className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-4">
                  {/* Avatar placeholder */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ds-red/20 text-xs font-bold text-ds-red-400">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ds-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-ds-gray-500">{t.car}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Section 6: Instagram / Social Proof
          ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-ds-black-deepest section-padding">
        <Container>
          <SectionHeading
            eyebrow="Follow the Journey"
            heading="@dreamstardriversclub"
            description="Tag your build with #DreamStarDriversClub for a chance to be featured."
            align="center"
            className="mb-12"
          />

          {/* Instagram grid — 3x2 desktop, 3x2 mobile */}
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-2 sm:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-ds-black-charcoal transition-all duration-300 hover:border-ds-red/30 hover:shadow-brand-glow-sm"
              >
                {/* Placeholder gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-ds-black-charcoal to-ds-black-elevated" />
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-grid opacity-20" />
                {/* Instagram-style icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30 transition-opacity duration-300 group-hover:opacity-60">
                  <svg
                    className="h-8 w-8 text-ds-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="5"
                      ry="5"
                    />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-ds-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ds-white">
                    @dreamstardriversclub
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Follow CTA */}
          <div className="mt-10 text-center">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
                Follow @dreamstardriversclub
              </Button>
            </a>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          Section 7: Newsletter CTA — Join the Club
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ds-black">
        {/* Subtle red glow behind */}
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />

        <Container className="relative section-padding">
          <div className="mx-auto max-w-2xl text-center">
            {/* Hoshi mascot placeholder */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-ds-red/20 bg-ds-black-charcoal shadow-brand-glow-sm">
              <span
                className="text-3xl"
                role="img"
                aria-label="Hoshi mascot star"
              >
                ⭐
              </span>
            </div>

            <h2 className="font-display text-2xl font-black tracking-tight text-ds-white sm:text-3xl">
              Join the Club
            </h2>
            <p className="mt-3 text-ds-gray-400">
              Be the first to know about new drops, restocks, and exclusive club
              content. No spam — just the good stuff.
            </p>

            <div className="mx-auto mt-8 max-w-md">
              <NewsletterForm variant="default" />
            </div>

            <p className="mt-4 text-xs text-ds-gray-600">
              By signing up, you agree to our{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-2 transition-colors hover:text-ds-gray-400"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </Container>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
      </section>
    </>
  );
}
