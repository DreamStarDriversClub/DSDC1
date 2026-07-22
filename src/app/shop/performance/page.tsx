import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { CategoryHeader } from "@/components/shop/CategoryHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SubcategoryFilter } from "@/components/shop/SubcategoryFilter";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Image from "next/image";

export const metadata: Metadata = {
  title: "DS Performance — Rotary & 2JZ Performance Parts",
  description: "High-performance Mazda rotary and Toyota 2JZ-GTE parts — street port kits, timing belts, apex seals, gaskets. Built by enthusiasts, proven on the touge. Chase the Horizon.",
  openGraph: {
    title: `DS Performance | ${BRAND_NAME}`,
    description: "High-performance Mazda rotary and Toyota 2JZ-GTE parts — street port kits, timing belts, apex seals, gaskets. Built by enthusiasts, proven on the touge.",
  },
};

export default async function PerformancePage() {
  const category = await prisma.category.findUnique({
    where: { slug: "ds-performance" },
  });

  const subcategories = category
    ? await prisma.category.findMany({
        where: { parentId: category.id },
        orderBy: { name: "asc" },
        select: { name: true, slug: true },
      })
    : [];

  const products = category
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          category: {
            OR: [{ id: category.id }, { parentId: category.id }],
          },
        },
        include: {
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const mappedProducts = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    salePrice: p.salePrice,
    category: p.category,
    images: (p.images as unknown as string[]) || [],
    isFeatured: p.isFeatured,
  }));

  return (
    <>
      {/* Hero — new copy + actual brand image */}
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-center bg-no-repeat opacity-[0.08]"
          style={{
            backgroundImage: "url('/images/rotary-blueprint.png')",
            backgroundSize: "cover",
            backgroundBlendMode: "soft-light",
          }}
        />
        <div className="relative z-10">
          <CategoryHeader
            title="Born From Boost."
            description="Parts engineered for the 13B and 2JZ — built by people who've torn these engines down and rebuilt them in garages across the Tri-state, the Vegas Valley, and the mountain passes of Japan. No catalogs. No compromises. Just hard-earned experience and hardware we'd run ourselves."
            image="/images/hero-performance.png"
          />
        </div>
      </div>

      <Container className="py-8">
        <Breadcrumbs
          items={[{ label: "Shop", href: "/shop" }, { label: "DS Performance" }]}
          className="mb-8"
        />

        <div className="mb-8">
          <SubcategoryFilter subcategories={subcategories} />
        </div>

        <ProductGrid
          products={mappedProducts}
          badgeVariant="red"
          emptyMessage="No performance parts available right now. Check back soon!"
        />
      </Container>

      {/* Why DS Performance — editorial credibility section */}
      <section className="bg-ds-black section-padding">
        <Container>
          <SectionHeading
            eyebrow="Our Heritage"
            heading="Why DS Performance"
            align="center"
            className="mb-12"
          />
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
            {/* Column 1: Rotary */}
            <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ds-red/15">
                <svg className="h-6 w-6 text-ds-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-ds-white">Rotary DNA</h3>
              <p className="mt-3 text-sm leading-relaxed text-ds-gray-400">
                The 13B isn&apos;t just an engine — it&apos;s a piece of engineering art that refused to follow the piston rulebook. Our rotary parts are developed by people who&apos;ve torn these engines down in garages and rebuilt them to handle mountain passes at full song.
              </p>
            </div>

            {/* Column 2: 2JZ */}
            <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ds-gold/15">
                <svg className="h-6 w-6 text-ds-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-ds-white">2JZ Authority</h3>
              <p className="mt-3 text-sm leading-relaxed text-ds-gray-400">
                The 2JZ-GTE defined a generation. From timing belt kits to head gaskets, our 2JZ line covers the essentials that keep these legendary inline-sixes making power. No catalog parts — just hardware selected by builders who run it themselves.
              </p>
            </div>

            {/* Column 3: Club Vetted */}
            <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ds-red/15">
                <svg className="h-6 w-6 text-ds-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              <h3 className="font-display text-lg font-bold text-ds-white">Club-Vetted</h3>
              <p className="mt-3 text-sm leading-relaxed text-ds-gray-400">
                We don&apos;t sell parts we wouldn&apos;t run on our own cars. Every DS Performance product is tested and approved by club members — from the Tri-state to the Vegas Valley to the mountain passes of Japan. Good enough doesn&apos;t cut it here.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm uppercase tracking-widest text-ds-gray-500">
              Chase the Horizon.
            </p>
          </div>
        </Container>
      </section>

      <NewsletterBanner />
    </>
  );
}

export const dynamic = "force-dynamic";
