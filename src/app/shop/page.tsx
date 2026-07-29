import { prisma } from "@/lib/prisma";
import { getAllPrintfulProducts, hasPrintfulProducts } from "@/lib/shop-data";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryHeader } from "@/components/shop/CategoryHeader";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shop JDM Apparel, Accessories & Rotary Performance Parts",
  description: "Browse premium JDM-inspired apparel, accessories, and Mazda rotary performance parts at Dream Star Drivers Club.",
  openGraph: {
    title: `Shop | ${BRAND_NAME}`,
    description: "Premium JDM-inspired apparel, accessories, and performance parts.",
  },
};

export default async function ShopPage() {
  // Fetch main categories (wrap every DB call so a schema mismatch won't crash the page)
  let mainCategories: { id: string; slug: string; name: string; description: string | null }[] = [];
  try {
    mainCategories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch main categories for shop page:", error);
  }

  // Fetch featured products from Product table
  let featured: { slug: string; name: string; price: number; salePrice: number | null; category: { name: string; slug: string }; isFeatured: boolean; images?: unknown }[] = [];
  try {
    const dbFeatured = await prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: { select: { name: true, slug: true } } },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
    featured = dbFeatured.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: parseFloat(p.price.toString()),
      salePrice: p.salePrice ? parseFloat(p.salePrice.toString()) : null,
      category: p.category,
      isFeatured: p.isFeatured,
      images: p.images,
    }));
  } catch (error) {
    console.error("Failed to fetch featured products for shop page:", error);
  }

  // Fetch Printful products for the featured section
  let printfulProducts: typeof featured = [];
  try {
    const hasPrintful = await hasPrintfulProducts();
    if (hasPrintful) {
      const pfProducts = await getAllPrintfulProducts();
      printfulProducts = pfProducts.map((p) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        salePrice: p.salePrice,
        category: p.category,
        isFeatured: false,
        images: p.images,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch Printful products for shop:", error);
  }

  // Merge featured products
  const allFeatured = [...printfulProducts, ...featured];

  const categoryBadges: Record<string, "red" | "gold"> = {
    apparel: "red",
    accessories: "gold",
    "ds-performance": "red",
  };

  return (
    <>
      {/* Hero */}
      <CategoryHeader
        title="The Garage Is Open."
        description="Premium apparel, accessories, and Mazda rotary performance parts — crafted for enthusiasts who live the car life."
      />

      <Container className="py-8">
        <Breadcrumbs items={[{ label: "Shop" }]} className="mb-8" />
      </Container>

      {/* Category Grid */}
      <section className="bg-ds-black-deepest section-padding-tight">
        <Container>
          <SectionHeading
            eyebrow="Browse"
            heading="Shop by Category"
            align="center"
            className="mb-10"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mainCategories.map((cat) => {
              const href =
                cat.slug === "ds-performance"
                  ? "/shop/performance"
                  : `/shop/${cat.slug}`;

              const catImage =
                cat.slug === "apparel"
                  ? "/category-apparel.jpg"
                  : cat.slug === "accessories"
                    ? "/category-accessories.jpg"
                    : "/category-performance.jpg";

              return (
                <Link key={cat.id} href={href} className="group block">
                  <div
                    className="relative flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-cover bg-center"
                    style={{ backgroundImage: `url('${catImage}')` }}
                  >
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-ds-black/50 transition-all duration-700 ease-out group-hover:bg-ds-black/35" />
                    {/* Red glow on hover */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-gradient-to-t from-ds-red/5 to-transparent" />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-display text-lg font-bold text-ds-white transition-colors group-hover:text-ds-red">
                      {cat.slug === "ds-performance" ? "DS Performance" : cat.name}
                    </h3>
                    {cat.description && (
                      <p className="mt-1 text-sm text-ds-gray-400">{cat.description}</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Featured Products */}
      {allFeatured.length > 0 && (
        <section className="bg-ds-black section-padding">
          <Container>
            <SectionHeading
              eyebrow="Staff Picks"
              heading="Featured Products"
              description="Hand-picked favorites from the club — our most popular gear and parts."
              align="center"
              className="mb-10"
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {allFeatured.map((product, i) => (
                <ProductCard
                  key={i}
                  product={{
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    salePrice: product.salePrice,
                    category: product.category,
                    images: product.images,
                    isFeatured: product.isFeatured,
                  }}
                  badgeVariant={
                    (categoryBadges[product.category.slug] as "red" | "gold") || "red"
                  }
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/shop/all"
                className="inline-flex items-center gap-2 rounded-xl border border-ds-red/40 px-8 py-4 text-base font-semibold text-ds-white transition-all duration-300 hover:bg-ds-red/10 hover:border-ds-red/60"
              >
                View All Products
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </Container>
        </section>
      )}


      {/* Newsletter */}
      <NewsletterBanner />
    </>
  );
}

export const dynamic = "force-dynamic";
