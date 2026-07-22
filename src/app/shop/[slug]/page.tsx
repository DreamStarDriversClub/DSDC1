import { getProductBySlug, getRelatedProducts } from "@/lib/shop-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductForm } from "@/components/shop/ProductForm";
import { ProductImageGallery } from "@/components/shop/ProductImageGallery";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";
import { ProductSchema } from "@/components/ui/SchemaOrg";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

/* ── Dynamic Params ─────────────────────────────────────── */

interface Props {
  params: { slug: string };
}

/* ── Metadata ──────────────────────────────────────────── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} | ${BRAND_NAME}`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | ${BRAND_NAME}`,
      description: product.description.slice(0, 160),
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
  };
}

/* ── Page ───────────────────────────────────────────────── */

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  if (!product || !product.isActive) {
    notFound();
  }

  const specifications = product.specifications;
  const compatibleVehicles = product.compatibleVehicles;

  // Build breadcrumbs
  const breadcrumbItems: { label: string; href?: string }[] = [
    { label: "Shop", href: "/shop" },
  ];

  if (product.category.parent) {
    breadcrumbItems.push({
      label: product.category.parent.name,
      href: `/shop/${product.category.parent.slug === "ds-performance" ? "performance" : product.category.parent.slug}`,
    });
  }
  breadcrumbItems.push({
    label: product.category.name,
    href: `/shop/${product.category.slug.startsWith("apparel")
      ? "apparel"
      : product.category.slug.startsWith("acc")
        ? "accessories"
        : product.category.slug.startsWith("perf")
          ? "performance"
          : product.category.slug}`,
  });
  breadcrumbItems.push({ label: product.name });

  // Related products
  const related = await getRelatedProducts(
    product.category.slug,
    product.slug,
    product.source,
    4,
  );

  // Compute reviews
  const baseReviewCount = product.reviews.length;
  const avgRating =
    baseReviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        baseReviewCount
      : 0;

  // Category badge variant
  const badgeVariant = product.category.slug.startsWith("acc")
    ? ("gold" as const)
    : ("red" as const);

  // Determine icon for placeholder
  const isPerformance = product.category.slug.startsWith("perf");
  const isAccessories = product.category.slug.startsWith("acc");

  return (
    <>
      <ProductSchema
        name={product.name}
        description={product.description}
        sku={product.sku}
        price={product.salePrice ?? product.price}
        image={product.images.length > 0 ? product.images[0] : undefined}
        slug={product.slug}
        category={product.category.name}
      />
      <Container className="py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-8" />
      </Container>

      {/* Product Main Section */}
      <section className="bg-ds-black section-padding-tight">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left: Interactive image gallery */}
            <div>
              <ProductImageGallery
                images={product.images}
                productName={product.name}
                productSlug={product.slug}
                sku={product.sku}
                salePercent={
                  product.salePrice
                    ? Math.round((1 - product.salePrice / product.price) * 100)
                    : undefined
                }
                isPerformance={isPerformance}
                isAccessories={isAccessories}
              />
            </div>

            {/* Right: Product Info */}
            <div>
              {/* Category badge */}
              <div className="mb-3">
                <Badge variant={badgeVariant} size="sm">
                  {product.category.name}
                </Badge>
              </div>

              <h1 className="font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-ds-red">
                      {formatPrice(product.salePrice)}
                    </span>
                    <span className="text-xl text-ds-gray-400 line-through">
                      {formatPrice(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-ds-white">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Rating summary */}
              {baseReviewCount > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-ds-gold" : "text-ds-gray-700"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-ds-gray-400">
                    {avgRating.toFixed(1)} ({baseReviewCount} review
                    {baseReviewCount !== 1 ? "s" : ""})
                  </span>
                </div>
              )}

              <div className="mt-6 h-px bg-white/[0.08]" />

              {/* Interactive Product Form */}
              <div className="mt-6">
                <ProductForm
                  productId={product.id}
                  productName={product.name}
                  productSlug={product.slug}
                  productSku={product.sku}
                  basePrice={product.price}
                  salePrice={product.salePrice}
                  variants={product.variants}
                  images={product.images}
                  inventory={product.inventory}
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Tabs: Description | Specs | Reviews */}
      <section className="bg-ds-black-deepest section-padding">
        <Container>
          <div className="mx-auto max-w-4xl">
            {/* Description */}
            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ds-white mb-4">
                Description
              </h2>
              <div className="h-[3px] w-8 rounded-full bg-ds-red mb-6" />
              <div className="prose prose-invert max-w-none text-ds-gray-300 leading-relaxed">
                {product.description.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>

            {/* Specifications */}
            {specifications.length > 0 && (
              <div className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ds-white mb-4">
                  Specifications
                </h2>
                <div className="h-[3px] w-8 rounded-full bg-ds-red mb-6" />
                <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                  <table className="w-full text-left">
                    <tbody>
                      {specifications.map((spec, i) => (
                        <tr
                          key={i}
                          className={
                            i % 2 === 0
                              ? "bg-ds-black"
                              : "bg-ds-black-charcoal"
                          }
                        >
                          <td className="w-1/3 px-6 py-3 text-sm font-semibold text-ds-gray-300">
                            {spec.label}
                          </td>
                          <td className="px-6 py-3 text-sm text-ds-gray-300">
                            {spec.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Compatible Vehicles */}
            {compatibleVehicles.length > 0 && (
              <div className="mb-12">
                <h2 className="font-display text-2xl font-bold text-ds-white mb-4">
                  Compatible Vehicles
                </h2>
                <div className="h-[3px] w-8 rounded-full bg-ds-red mb-6" />
                <div className="flex flex-wrap gap-2">
                  {compatibleVehicles.map((vehicle, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-white/[0.08] bg-ds-black-charcoal px-4 py-2 text-sm text-ds-gray-300"
                    >
                      {vehicle}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ds-white mb-4">
                Reviews
                {baseReviewCount > 0 && (
                  <span className="ml-2 text-lg text-ds-gray-400">
                    ({baseReviewCount})
                  </span>
                )}
              </h2>
              <div className="h-[3px] w-8 rounded-full bg-ds-red mb-6" />

              {baseReviewCount > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <Card
                      key={review.id}
                      padding="md"
                      className="flex flex-col"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ds-red/20 text-xs font-bold text-ds-red">
                          {review.user.firstName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-ds-white">
                            {review.user.firstName}
                          </p>
                          <div className="mt-0.5 flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`h-3 w-3 ${i < review.rating ? "text-ds-gold" : "text-ds-gray-700"}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.title && (
                        <p className="mt-3 text-sm font-semibold text-ds-gray-200">
                          {review.title}
                        </p>
                      )}
                      {review.body && (
                        <p className="mt-1 text-sm text-ds-gray-300">
                          {review.body}
                        </p>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-ds-gray-400">
                  No reviews yet. Be the first to review this product!
                </p>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="bg-ds-black section-padding">
          <Container>
            <div className="mb-10">
              <h2 className="font-display text-2xl font-bold text-ds-white">
                You Might Also Like
              </h2>
              <div className="mt-3 h-[3px] w-8 rounded-full bg-ds-red" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard
                  key={p.slug}
                  product={{
                    slug: p.slug,
                    name: p.name,
                    price: p.price,
                    salePrice: p.salePrice,
                    category: p.category,
                    images: p.images,
                    isFeatured: p.isFeatured,
                  }}
                  badgeVariant={
                    p.category.slug.startsWith("acc") ? "gold" : "red"
                  }
                />
              ))}
            </div>
          </Container>
        </section>
      )}

      <NewsletterBanner />
    </>
  );
}

export const dynamic = "force-dynamic";
