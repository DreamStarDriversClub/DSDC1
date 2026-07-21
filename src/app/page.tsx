import Link from "next/link";
import { BRAND_NAME, TAGLINE } from "@/lib/constants";
import { getPrintfulFeaturedProducts, hasPrintfulProducts } from "@/lib/shop-data";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { OrganizationSchema, WebSiteSchema } from "@/components/ui/SchemaOrg";
import { ProductHighlights } from "@/components/home/ProductHighlights";
import { InstagramGrid } from "@/components/home/InstagramGrid";

export const dynamic = "force-dynamic";

/* ── Sample Data ─────────────────────────────────────────────────────────── */

const fallbackFeaturedProducts = [
  {
    id: "rotary-spirit-tee",
    name: "Rotary Spirit Tee",
    price: 34.99,
    description: "The rotary engine isn't just a powerplant. It's a philosophy — lightweight, high-revving, and unlike anything else on the road. The Rotary Spirit Tee pays tribute to that legacy. Printed on heavyweight 220 GSM ring-spun cotton, this tee features a subtle rotary triangle motif across the chest — clean enough to wear anywhere, detailed enough that real enthusiasts will stop you at the pump to ask about it. The fit is modern and slightly relaxed, cut for shoulder room without looking boxy. Pre-shrunk so your medium stays a medium after the first wash. Whether you're wrenching on a 13B rebuild or just repping the culture, this is the shirt that says you understand something most people never will. Because the triangle isn't just a shape. It's a heartbeat.",
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
    description: "Named for the mountain passes where legends are made, the Touge Runner Hoodie is built for cold starts and late-night runs. This is the layer you reach for when the garage door is open at 2 AM and the temperature's dropping. We started with a 400 GSM heavyweight French terry fleece — substantial enough to block the wind, soft enough to live in. The hood is double-lined with a structured drawcord. Kangaroo pocket with hidden media channel keeps your phone secure through every corner. Across the back, a stylized touge elevation graphic runs shoulder to shoulder like the mountain roads that inspired it. Oversized fit with dropped shoulders — layer it over a tee or wear it solo. The Touge Runner doesn't just keep you warm. It reminds you why you fell in love with driving in the first place.",
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
    description: "The sound of a 13B at full chat is unmistakable — a rising, spinning crescendo that no piston engine can replicate. The 13B Heartbeat Decal captures that rhythm in a single, clean graphic: a rotary-shaped heartbeat pulse that reads instantly to anyone who knows. Die-cut from premium 3M automotive-grade vinyl, this decal is rated for exterior use — rain, sun, and highway speeds won't fade or peel it. Available in gloss white, matte black, and Dream Star red. Sized at 6 inches wide, it fits perfectly on a quarter window, rear windshield, or toolbox lid. One decal, infinite conversations. Because when another rotary guy sees that heartbeat, they'll know exactly what's up.",
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
    description: "Your keys are sacred. They unlock the machine you've poured your soul into. The Dream Star Lanyard treats them with the respect they deserve. Woven from heavyweight polyester with reinforced stitching at every stress point, this lanyard is built to outlast the cheap promo gear. The Dream Star wordmark runs the full length in a subtle tonal jacquard weave — visible but never loud. A machined metal clip (not plastic) secures your keys with confidence, and the detachable quick-release buckle lets you separate your car key in seconds. Black with red accent stitching. Hang it from your mirror. Clip it to your belt loop. Carry the club wherever you go.",
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
    description: "The FD RX-7 is a masterpiece of engineering — and with the right port work, it becomes something transcendent. The DS Performance RX-7 FD Street Port Kit is designed for the enthusiast who wants more power without sacrificing the street manners that make the FD drivable every day. This comprehensive kit includes ported intake and exhaust housings machined to our club-spec template — developed and tested on actual touge runs, not just flow benches. You get a matched set of apex seals (two-piece, high-carbon), all required gaskets and O-rings, solid corner seals, and upgraded tension bolts. Every component is inspected before it leaves our hands. Expect 320–380 WHP on a properly tuned setup with supporting mods. The idle has that unmistakable rotary lope — choppy enough to turn heads, smooth enough to live with. This is the kit we run. Now it's yours.",
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
    description: "The 2JZ-GTE is legendary for a reason — but even legends need maintenance. The DS Performance 2JZ-GTE Timing Belt Kit gives you everything required for a complete timing system refresh, sourced to the same standards we demand for our own cars. Kit includes a high-strength timing belt (Kevlar-reinforced), OEM-spec hydraulic tensioner, idler pulley, and tensioner pulley — all pre-inspected and kitted for a straightforward install. We don't cut corners on bearings or belt compounds because we know what's at stake when your 2JZ is singing at full boost. Whether you're doing preventive maintenance at 60K or building a fresh long block, this kit ensures your timing stays dead-on through every pull. Because when the turbo spools and the horizon opens up, the last thing you should be thinking about is your belt.",
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

export default async function HomePage() {
  // Note: Instagram feed now uses Elfsight widget (see InstagramGrid component).
  // Set NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_APP_ID in .env to activate real posts.
  // The old database-backed Instagram posts query has been removed.

  // Fetch Printful featured products for homepage — merge with fallbacks
  let featuredProducts = fallbackFeaturedProducts;
  try {
    const hasPrintful = await hasPrintfulProducts();
    if (hasPrintful) {
      const pfFeatured = await getPrintfulFeaturedProducts();
      if (pfFeatured.length > 0) {
        // Prepend Printful products before fallback samples
        featuredProducts = [...pfFeatured, ...fallbackFeaturedProducts] as typeof fallbackFeaturedProducts;
      }
    }
  } catch (error) {
    console.error("Failed to fetch Printful featured products:", error);
  }

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
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ds-gray-300 sm:text-lg">
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
          Section 1.5: Product Highlights Carousel
          ══════════════════════════════════════════════════════════════════ */}
      <ProductHighlights products={featuredProducts} />

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
                <div
                  className="relative flex h-52 items-center justify-center overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: "url('/category-apparel.jpg')" }}
                >
                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-ds-black/50 transition-all duration-700 ease-out group-hover:bg-ds-black/35" />
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
                  <p className="mt-1 text-sm text-ds-gray-400">
                    Premium streetwear with authentic JDM styling.
                  </p>
                </div>
              </Card>
            </Link>

            {/* Accessories Card */}
            <Link href="/shop/accessories" className="group block">
              <Card hover padding="none" className="overflow-hidden">
                <div
                  className="relative flex h-52 items-center justify-center overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: "url('/category-accessories.jpg')" }}
                >
                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-ds-black/50 transition-all duration-700 ease-out group-hover:bg-ds-black/35" />
                  {/* Gold glow on hover */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-ds-gold/5 to-transparent" />
                </div>
                <div className="p-6">
                  <Badge variant="gold" size="sm" className="mb-2">
                    Limited
                  </Badge>
                  <h3 className="font-display text-lg font-bold text-ds-white transition-colors group-hover:text-ds-red">
                    Accessories
                  </h3>
                  <p className="mt-1 text-sm text-ds-gray-400">
                    Stickers, keychains, lanyards, and club gear.
                  </p>
                </div>
              </Card>
            </Link>

            {/* Performance Card */}
            <Link href="/shop/performance" className="group block">
              <Card hover padding="none" className="overflow-hidden">
                <div
                  className="relative flex h-52 items-center justify-center overflow-hidden bg-cover bg-center"
                  style={{ backgroundImage: "url('/category-performance.jpg')" }}
                >
                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-ds-black/50 transition-all duration-700 ease-out group-hover:bg-ds-black/35" />
                  {/* Red glow on hover */}
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-ds-red/5 to-transparent" />
                </div>
                <div className="p-6">
                  <Badge variant="red" size="sm" className="mb-2">
                    Performance
                  </Badge>
                  <h3 className="font-display text-lg font-bold text-ds-white transition-colors group-hover:text-ds-red">
                    DS Performance
                  </h3>
                  <p className="mt-1 text-sm text-ds-gray-400">
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
                    {/* View Details overlay */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                      <div className="flex items-center justify-center bg-ds-black/80 backdrop-blur-sm py-3">
                        <span className="text-xs font-semibold uppercase tracking-wider text-ds-white">
                          View Details
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
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ds-gray-300 sm:text-lg">
                Some brands are built in boardrooms. Ours was built on the
                mountain roads of the Tri-state, refined on the touge passes of
                Japan, and now runs deep in the Vegas Valley. It started with an
                RX-7, a garage, and an obsession with the golden era of JDM.
                What came next was never part of the plan.
              </p>
              <div className="mt-8">
                <Link href="/about">
                  <Button variant="outline" size="lg">
                    Read the full story
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
                <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.3em] text-ds-gray-400">
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
                    <p className="text-xs text-ds-gray-400">{t.car}</p>
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
      <InstagramGrid />

      {/* ══════════════════════════════════════════════════════════════════
          Section 7: Newsletter CTA — Join the Club
          ══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-ds-black">
        {/* Subtle red glow behind */}
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />

        <Container className="relative section-padding">
          <div className="mx-auto max-w-2xl text-center">
            {/* Hoshi mascot */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-ds-red/20 bg-ds-black-charcoal shadow-brand-glow-sm">
              <img
                src="/hoshi-waving.png"
                alt="Hoshi mascot waving"
                className="h-12 w-12 object-contain"
                loading="lazy"
              />
            </div>

            <h2 className="font-display text-2xl font-black tracking-tight text-ds-white sm:text-3xl">
              Join the Club
            </h2>
            <p className="mt-3 text-ds-gray-300">
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
                className="underline underline-offset-2 transition-colors hover:text-ds-gray-300"
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
