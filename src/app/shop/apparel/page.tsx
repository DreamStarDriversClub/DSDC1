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
  title: "Apparel — Premium JDM Streetwear",
  description: "Premium JDM-inspired streetwear for rotary and 2JZ enthusiasts. Heavyweight tees, hoodies, and outerwear rooted in Japanese car culture. Chase the Horizon.",
  openGraph: {
    title: `Apparel | ${BRAND_NAME}`,
    description: "Premium JDM-inspired streetwear for rotary and 2JZ enthusiasts. Heavyweight tees, hoodies, and outerwear rooted in Japanese car culture. Chase the Horizon.",
  },
};

export default async function ApparelPage() {
  // Fetch the apparel category (wrapped so a DB outage doesn't crash the page)
  let category: { id: string } | null = null;
  try {
    category = await prisma.category.findUnique({
      where: { slug: "apparel" },
    });
  } catch (error) {
    console.error("Failed to fetch apparel category:", error);
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
      console.error("Failed to fetch apparel subcategories:", error);
    }
  }

  // Fetch all products in this category or its subcategories
  let mappedProducts: { slug: string; name: string; price: number; salePrice: number | null; category: { name: string; slug: string }; images: string[]; isFeatured: boolean }[] = [];
  if (category) {
    try {
      const products = await prisma.product.findMany({
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
      });

      mappedProducts = products.map((p) => ({
        slug: p.slug,
        name: p.name,
        price: parseFloat(p.price.toString()),
        salePrice: p.salePrice ? parseFloat(p.salePrice.toString()) : null,
        category: p.category,
        images: (p.images as string[]) || [],
        isFeatured: p.isFeatured,
      }));
    } catch (error) {
      console.error("Failed to fetch apparel products:", error);
    }
  }

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
        images: (p.images as string[]) || [],
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
        title="Wear the Drive."
        description="Some people wear brands. You wear what you've lived — the late-night tuning sessions, the mountain passes that test everything, the rotary hum that stays with you long after the key leaves the ignition. Dream Star apparel isn't merch. It's a uniform for the club you already belong to. Every piece in this collection is built to move with you — from the garage to the meet, from the driver's seat to the after-party. We source heavyweight cotton, precision-cut fabrics, and subtle design details that speak to those who know. No overbranding. No generic graphics. Just clean lines, Japanese automotive influence, and a fit that feels like it was tailored for the touge. Our tees, hoodies, and outerwear carry the spirit of golden-era JDM — think midnight runs, parking lot gatherings, and the unmistakable silhouette of an FD RX-7 against a setting sun. Wear the rotary heart on your sleeve. Chase the horizon in style."
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
