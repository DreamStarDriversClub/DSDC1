import { prisma } from "@/lib/prisma";
import { getAllPrintfulProducts, hasPrintfulProducts } from "@/lib/shop-data";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { CategoryHeader } from "@/components/shop/CategoryHeader";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";
import { ProductFilters } from "./ProductFilters";

export const metadata: Metadata = {
  title: "All Products — JDM Apparel, Accessories & Performance Parts",
  description: "Browse every product in the Dream Star Drivers Club catalog — apparel, accessories, and performance parts.",
  openGraph: {
    title: `All Products | ${BRAND_NAME}`,
    description: "Browse the complete catalog.",
  },
};

interface SearchParams {
  category?: string;
  sort?: string;
}

export default async function AllProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Determine sort
  const sort = searchParams.sort || "newest";
  let orderBy: Record<string, string> = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name-asc") orderBy = { name: "asc" };

  // Determine category filter
  const categoryFilter = searchParams.category;
  let categoryWhere: Record<string, unknown> = {};
  if (categoryFilter) {
    categoryWhere = {
      OR: [
        { slug: categoryFilter },
        { parent: { slug: categoryFilter } },
      ],
    };
  }

  // Fetch main categories for filter (wrap every DB call so a schema mismatch won't crash the page)
  let mainCategories: { name: string; slug: string }[] = [];
  try {
    mainCategories = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      select: { name: true, slug: true },
    });
  } catch (error) {
    console.error("Failed to fetch main categories for all-products page:", error);
  }

  // Fetch products from Product table
  let mappedProducts: { slug: string; name: string; price: number; salePrice: number | null; category: { name: string; slug: string }; images: string[]; isFeatured: boolean }[] = [];
  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categoryFilter ? { category: categoryWhere } : {}),
      },
      include: {
        category: { select: { name: true, slug: true } },
      },
      orderBy,
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
    console.error("Failed to fetch products for all-products page:", error);
  }

  // Fetch Printful products
  let printfulProducts: typeof mappedProducts = [];
  try {
    const hasPrintful = await hasPrintfulProducts();
    if (hasPrintful) {
      let pfProducts = await getAllPrintfulProducts();
      if (categoryFilter) {
        pfProducts = pfProducts.filter(
          (p) => p.category.slug === categoryFilter,
        );
      }
      // Sort Printful products if needed (they come sorted by name from the query)
      if (sort === "price-asc") {
        pfProducts.sort((a, b) => a.price - b.price);
      } else if (sort === "price-desc") {
        pfProducts.sort((a, b) => b.price - a.price);
      }
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
    console.error("Failed to fetch Printful products for all:", error);
  }

  // Merge: Printful products first
  const allProducts = [...printfulProducts, ...mappedProducts];

  // Get the current category name for display
  let currentCategoryName: string | undefined;
  if (categoryFilter) {
    const found = mainCategories.find((c) => c.slug === categoryFilter);
    currentCategoryName = found?.name;
  }

  return (
    <>
      <CategoryHeader
        title={currentCategoryName ? `${currentCategoryName}` : "All Products"}
        description={
          currentCategoryName
            ? `Browse all products in ${currentCategoryName}.`
            : "Browse every product in the Dream Star Drivers Club catalog."
        }
      />

      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: "All Products" },
          ]}
          className="mb-8"
        />

        {/* Filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ProductFilters
            categories={mainCategories.map((c) => ({
              name: c.name,
              slug: c.slug,
            }))}
            currentCategory={categoryFilter}
            currentSort={sort}
          />
        </div>

        <ProductGrid
          products={allProducts}
          badgeVariant="red"
          emptyMessage="No products match your filters. Try adjusting your selection."
        />
      </Container>


      <NewsletterBanner />
    </>
  );
}

export const dynamic = "force-dynamic";
