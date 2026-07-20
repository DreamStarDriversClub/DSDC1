import { prisma } from "@/lib/prisma";
import { getPrintfulProductsByCategory, hasPrintfulProducts } from "@/lib/shop-data";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { CategoryHeader } from "@/components/shop/CategoryHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { SubcategoryFilter } from "@/components/shop/SubcategoryFilter";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";

export const metadata: Metadata = {
  title: "Apparel",
  description: "Premium JDM-inspired streetwear — t-shirts, hoodies, windbreakers, and more. Authentic Japanese car culture style.",
  openGraph: {
    title: `Apparel | ${BRAND_NAME}`,
    description: "Premium JDM-inspired streetwear for enthusiasts.",
  },
};

export default async function ApparelPage() {
  // Fetch the apparel category
  const category = await prisma.category.findUnique({
    where: { slug: "apparel" },
  });

  // Fetch subcategories
  const subcategories = category
    ? await prisma.category.findMany({
        where: { parentId: category.id },
        orderBy: { name: "asc" },
        select: { name: true, slug: true },
      })
    : [];

  // Fetch all products in this category or its subcategories
  const products = category
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          category: {
            OR: [
              { id: category.id },
              { parentId: category.id },
            ],
          },
        },
        include: {
          category: { select: { name: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Map for display
  const mappedProducts = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    price: p.price,
    salePrice: p.salePrice,
    category: p.category,
    isFeatured: p.isFeatured,
  }));

  // Fetch Printful apparel (tees, hoodies, etc.)
  let printfulProducts: typeof mappedProducts = [];
  try {
    const hasPrintful = await hasPrintfulProducts();
    if (hasPrintful) {
      const pfProducts = await getPrintfulProductsByCategory("apparel");
      printfulProducts = pfProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        salePrice: p.salePrice,
        category: p.category,
        isFeatured: p.isFeatured,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch Printful apparel:", error);
  }

  // Merge: Printful products first, then regular products
  const allProducts = [...printfulProducts, ...mappedProducts];

  return (
    <>
      <CategoryHeader
        title="Apparel"
        description="Premium streetwear with authentic JDM styling. From classic tees to windbreakers — wear the club with pride."
        image="/category-apparel.jpg"
      />

      <Container className="py-8">
        <Breadcrumbs
          items={[{ label: "Shop", href: "/shop" }, { label: "Apparel" }]}
          className="mb-8"
        />

        {/* Subcategory filters */}
        <div className="mb-8">
          <SubcategoryFilter subcategories={subcategories} />
        </div>

        <ProductGrid
          products={allProducts}
          badgeVariant="red"
          emptyMessage="No apparel products available right now. Check back soon for new drops!"
        />
      </Container>


      <NewsletterBanner />
    </>
  );
}

export const dynamic = "force-dynamic";
