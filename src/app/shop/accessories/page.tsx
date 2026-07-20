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
  title: "Accessories — JDM Decals, Keychains & Club Gear",
  description: "Complete your build with JDM-inspired accessories. Premium vinyl decals, embroidered lanyards, keychains, and club lifestyle gear. Details make the build.",
  openGraph: {
    title: `Accessories | ${BRAND_NAME}`,
    description: "Complete your build with JDM-inspired accessories. Premium vinyl decals, embroidered lanyards, keychains, and club lifestyle gear. Details make the build.",
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
        title="Details Make the Build."
        description="The right sticker on a quarter window. A keychain that clinks against the steering column every time you downshift. The lanyard hanging from your rearview — subtle, but loaded with meaning. These aren't afterthoughts. They're the finishing touches that say you belong to something bigger. Dream Star accessories are designed for the enthusiast who sweats the details. Die-cut vinyl decals that hold their own against weather and speed. Embroidered lanyards that feel substantial in your hand. Keychains, plate frames, and lifestyle gear that bridge the gap between your build and your daily carry. Each piece pulls from Japanese automotive aesthetics — rotary engine motifs, touge-inspired graphics, and the club insignia that ties it all together. Whether you're dressing up your toolbox, your daily driver, or your track-day kit, this is the gear that completes the picture."
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
