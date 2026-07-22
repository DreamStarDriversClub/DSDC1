import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { CategoryHeader } from "@/components/shop/CategoryHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SubcategoryFilter } from "@/components/shop/SubcategoryFilter";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";

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
      <div className="relative">
        {/* Rotary 13B blueprint watermark */}
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
            title="Built by Enthusiasts. Proven on the Touge."
            description="This is where the catalog gets serious. DS Performance is our in-house line of Mazda rotary and Toyota 2JZ components — engineered for the driver who refuses to compromise. We don't sell parts we wouldn't run on our own cars. Every seal, every belt, every ported housing carries the weight of that promise. Our rotary lineup covers everything from apex seals and street port kits to full gasket sets — the kind of hardware that keeps the 13B heart beating strong at 9,000 RPM. On the 2JZ side, we stock timing belt kits, head gaskets, and essential maintenance components for the engine that defined a generation. We know these engines because we've torn them down and built them back up. In garages in the Tri-state. On the winding roads of Japan. In the Vegas Valley, where the heat tests everything. DS Performance parts are sourced from trusted manufacturers and vetted by the club — because when you're chasing the horizon at full boost, 'good enough' doesn't cut it."
            image="/category-performance.jpg"
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


      <NewsletterBanner />
    </>
  );
}

export const dynamic = "force-dynamic";
