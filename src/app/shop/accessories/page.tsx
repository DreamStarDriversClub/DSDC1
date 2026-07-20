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
  title: "Accessories",
  description: "JDM-inspired accessories — stickers, keychains, lanyards, license plate frames, and more from Dream Star Drivers Club.",
  openGraph: {
    title: `Accessories | ${BRAND_NAME}`,
    description: "JDM-inspired stickers, keychains, lanyards, and lifestyle goods.",
  },
};

export default async function AccessoriesPage() {
  const category = await prisma.category.findUnique({
    where: { slug: "accessories" },
  });

  const subcategories = category
    ? await prisma.category.findMany({
        where: { parentId: category.id },
        orderBy: { name: "asc" },
        select: { name: true, slug: true },
      })
    : [];

  // Fetch regular products from Product table
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
    isFeatured: p.isFeatured,
  }));

  // Fetch Printful accessories (hats, caps, etc.)
  let printfulProducts: typeof mappedProducts = [];
  try {
    const hasPrintful = await hasPrintfulProducts();
    if (hasPrintful) {
      const pfProducts = await getPrintfulProductsByCategory("accessories");
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
    console.error("Failed to fetch Printful accessories:", error);
  }

  // Merge: Printful products first, then regular products
  const allProducts = [...printfulProducts, ...mappedProducts];

  return (
    <>
      <CategoryHeader
        title="Accessories"
        description="Complete your build with JDM-inspired lifestyle gear. Stickers, keychains, lanyards, and club essentials."
        image="/category-accessories.jpg"
      />

      <Container className="py-8">
        <Breadcrumbs
          items={[{ label: "Shop", href: "/shop" }, { label: "Accessories" }]}
          className="mb-8"
        />

        <div className="mb-8">
          <SubcategoryFilter subcategories={subcategories} />
        </div>

        <ProductGrid
          products={allProducts}
          badgeVariant="gold"
          emptyMessage="No accessories available right now. Check back soon!"
        />
      </Container>


      <NewsletterBanner />
    </>
  );
}

export const dynamic = "force-dynamic";
