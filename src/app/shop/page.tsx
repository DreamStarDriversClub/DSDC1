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
  // Fetch main categories
  const mainCategories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });

  // Fetch featured products from Product table
  const featured = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { category: { select: { name: true, slug: true } } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

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
      })) as unknown as typeof featured;
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
        title="Shop All"
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

              const icon =
                cat.slug === "apparel" ? (
                  <svg className="mx-auto h-14 w-14 text-ds-red/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                ) : cat.slug === "accessories" ? (
                  <svg className="mx-auto h-14 w-14 text-ds-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                ) : (
                  <svg className="mx-auto h-14 w-14 text-ds-red/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
                  </svg>
                );

              return (
                <Link key={cat.id} href={href} className="group block">
                  <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal">
                    <div className="absolute inset-0 bg-gradient-to-br from-ds-red-900/15 to-transparent transition-transform duration-700 ease-out group-hover:scale-110" />
                    <div className="relative z-10 text-center transition-transform duration-500 group-hover:scale-110">
                      {icon}
                    </div>
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
