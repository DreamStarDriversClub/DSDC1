import { getProductBySlug, getPrintfulProductBySlug, getRelatedProducts } from "@/lib/shop-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductForm } from "@/components/shop/ProductForm";
import { StickyAddToCart } from "@/components/shop/StickyAddToCart";
import { ProductImageGallery } from "@/components/shop/ProductImageGallery";
import { NewsletterBanner } from "@/components/ui/NewsletterBanner";
import { ProductSchema } from "@/components/ui/SchemaOrg";
import { WishlistHeart } from "@/components/shop/WishlistHeart";
import { ReviewsSection } from "@/components/shop/ReviewsSection";
import { formatPrice } from "@/lib/utils";

/* ── Dynamic Params ─────────────────────────────────────── */

interface Props {
  params: { slug: string };
}

/* ── Metadata ──────────────────────────────────────────── */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let product = await getProductBySlug(params.slug);
  if (!product) {
    product = await getPrintfulProductBySlug(params.slug);
  }
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
  let product = await getProductBySlug(params.slug);
  if (!product) {
    product = await getPrintfulProductBySlug(params.slug);
  }

  if (!product) {
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

  // Blog post count — for conditional "Build Resources" cross-link
  let blogPostCount = 0;
  try {
    blogPostCount = await prisma.post.count({ where: { published: true } });
  } catch {
    // Silently fail — cross-link is non-critical
  }

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
        image={Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : undefined}
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
              <div className="mb-3 flex items-center gap-3">
                <Badge variant={badgeVariant} size="sm">
                  {product.category.name}
                </Badge>
                <WishlistHeart
                  productId={product.slug}
                  productName={product.name}
                  productImage={
                    Array.isArray(product.images) && product.images.length > 0
                      ? product.images[0]
                      : ""
                  }
                  productPrice={Math.round(
                    (product.salePrice ?? product.price) * 100
                  )}
                  productCategory={product.category.slug}
                />
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
              </h2>
              <div className="h-[3px] w-8 rounded-full bg-ds-red mb-6" />
              <ReviewsSection productId={product.id} />
            </div>

            {/* Build Resources — cross-link to blog */}
            <div className="mb-12">
              <h2 className="font-display text-2xl font-bold text-ds-white mb-4">
                Build Resources
              </h2>
              <div className="h-[3px] w-8 rounded-full bg-ds-red mb-6" />
              {blogPostCount > 0 ? (
                <div className="rounded-xl border border-white/[0.06] bg-ds-black-charcoal p-6">
                  <p className="text-sm leading-relaxed text-ds-gray-400">
                    Looking for build guides, maintenance walkthroughs, and deep
                    dives into the parts that make these machines legendary? Our
                    blog is packed with rotary rebuild diaries, 2JZ tuning
                    guides, event coverage, and stories from the garage.
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/blog"
                      className="inline-flex items-center gap-2 rounded-lg border border-ds-red/20 bg-ds-red/10 px-4 py-2 text-sm font-semibold text-ds-red-400 transition-all duration-300 hover:bg-ds-red/20 hover:text-ds-red-300"
                    >
                      Explore the Blog
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-ds-gold/10 bg-ds-gold/5 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full bg-ds-gold/60" />
                    <p className="text-sm font-semibold text-ds-gold/70">
                      Build guides and technical deep dives — coming soon.
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ds-gray-500">
                    Our team is putting together the definitive resource library
                    for rotary and 2JZ enthusiasts. Check back for step-by-step
                    build diaries, maintenance walkthroughs, and tuning guides
                    written by people who actually turn wrenches.
                  </p>
                </div>
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

      {/* Sticky mobile add-to-cart bar */}
      <StickyAddToCart
        productId={product.id}
        productName={product.name}
        productSlug={product.slug}
        productSku={product.sku}
        basePrice={product.price}
        salePrice={product.salePrice}
        images={product.images}
        variants={product.variants}
        inventory={product.inventory}
      />
    </>
  );
}

export const dynamic = "force-dynamic";
