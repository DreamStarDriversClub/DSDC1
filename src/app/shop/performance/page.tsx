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
  title: "DS Performance",
  description: "High-performance Mazda rotary and Toyota 2JZ parts — engine components, turbos, suspension, electronics, and more.",
  openGraph: {
    title: `DS Performance | ${BRAND_NAME}`,
    description: "Rotary & 2JZ performance parts — built by enthusiasts for enthusiasts.",
  },
};

export default async function PerformancePage() {
  const category = await prisma.category.findUnique({
    where: { slug: "ds-performance" },
  });

  if (!category) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-display text-3xl text-ds-white">Category not found</h1>
      </Container>
    );
  }

  const subcategories = await prisma.category.findMany({
    where: { parentId: category.id },
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  const products = await prisma.product.findMany({
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
  });

  const mappedProducts = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    salePrice: p.salePrice,
    category: p.category,
    isFeatured: p.isFeatured,
  }));

  return (
    <>
      <CategoryHeader
        title="DS Performance"
        description="Rotary and 2JZ performance parts — built by enthusiasts, proven on the touge. From apex seals to turbo kits, everything you need for your build."
        image="/category-performance.jpg"
      />

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
