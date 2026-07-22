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
  // Fetch the accessories category (wrapped so a DB outage doesn't crash the page)
  let category: { id: string } | null = null;
  try {
    category = await prisma.category.findUnique({
      where: { slug: "accessories" },
    });
  } catch (error) {
    console.error("Failed to fetch accessories category:", error);
  }

  // Fetch subcategories
  let subcategories: { name: string; slug: string }[] = [];
  if (category) {
    try {
      subcategories = await prisma.category.findMany({
        where: { parentId: category.id },
        orderBy: { name: "asc" },
        select: { name: true, slug: true },
      });
    } catch (error) {
      console.error("Failed to fetch accessories subcategories:", error);
    }
  }

  // Fetch regular products from Product table
  let mappedProducts: { slug: string; name: string; price: number; salePrice: number | null; category: { name: string; slug: string }; images: string[]; isFeatured: boolean }[] = [];
  if (category) {
    try {
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

      mappedProducts = products.map((p) => ({
        slug: p.slug,
        name: p.name,
        price: parseFloat(p.price.toString()),
        salePrice: p.salePrice ? parseFloat(p.salePrice.toString()) : null,
        category: p.category,
        images: (p.images as unknown as string[]) || [],
        isFeatured: p.isFeatured,
      }));
    } catch (error) {
      console.error("Failed to fetch accessories products:", error);
    }
  }

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
        images: (p.images as unknown as string[]) || [],
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
        title="The Finishing Line."
        description="A decal on the quarter window. A keychain against the steering column. The lanyard hanging from the rearview catching light at every corner. These aren't afterthoughts — they're signals. Every detail a conversation waiting to start."
        image="/images/hero-accessories.png"
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
