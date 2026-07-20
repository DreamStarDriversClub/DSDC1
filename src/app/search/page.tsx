import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";
import { SearchInput } from "./SearchInput";

export const metadata: Metadata = {
  title: "Search",
  description: "Search the Dream Star Drivers Club catalog for apparel, accessories, and performance parts.",
  openGraph: {
    title: `Search | ${BRAND_NAME}`,
    description: "Find the gear and parts you need.",
  },
};

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q?.trim() || "";

  let products: Array<{
    slug: string;
    name: string;
    price: number | { toString(): string };
    salePrice?: number | { toString(): string } | null;
    category: { name: string; slug: string };
    isFeatured: boolean;
  }> = [];

  if (query) {
    const results = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
          { category: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        category: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    products = results.map((p) => ({
      slug: p.slug,
      name: p.name,
      price: p.price,
      salePrice: p.salePrice,
      category: p.category,
      isFeatured: p.isFeatured,
    }));
  }

  return (
    <>
      {/* Search Hero */}
      <section className="relative bg-ds-black-deepest py-16 sm:py-20">
        <div className="absolute inset-0 bg-hero-glow" />
        <Container className="relative">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
              Search Products
            </h1>
            <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mt-4 text-ds-gray-300">
              Find exactly what you&apos;re looking for in our catalog.
            </p>

            {/* Search input */}
            <div className="mt-8">
              <SearchInput initialQuery={query} />
            </div>
          </div>
        </Container>
        <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
      </section>

      <Container className="py-8">
        <Breadcrumbs
          items={[{ label: "Search" }]}
          className="mb-8"
        />
      </Container>

      {/* Results */}
      <section className="bg-ds-black section-padding-tight">
        <Container>
          {query ? (
            <>
              <div className="mb-8">
                <p className="text-lg text-ds-gray-300">
                  {products.length} result{products.length !== 1 ? "s" : ""} for{" "}
                  <span className="font-semibold text-ds-white">&ldquo;{query}&rdquo;</span>
                </p>
              </div>
              <ProductGrid
                products={products}
                badgeVariant="red"
                emptyMessage={`No results found for "${query}". Try a different search term or browse our categories.`}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              {/* Hoshi mascot */}
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-ds-red/20 bg-ds-black-charcoal shadow-brand-glow-sm">
                <img
                  src="/hoshi-searching.png"
                  alt="Hoshi mascot searching"
                  className="h-14 w-14 object-contain"
                  loading="lazy"
                />
              </div>
              <h2 className="font-display text-2xl font-bold text-ds-white">
                What Are You Looking For?
              </h2>
              <p className="mt-3 max-w-md text-ds-gray-400">
                Type something in the search bar above — a product name, category, or even a part number. Hoshi&apos;s got your back!
              </p>
            </div>
          )}
        </Container>
      </section>


      <NewsletterBanner />
    </>
  );
}

export const dynamic = "force-dynamic";
