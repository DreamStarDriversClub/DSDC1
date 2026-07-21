import { BRAND_NAME, TAGLINE, SOCIAL_LINKS, SITE_URL } from "@/lib/constants";

export function OrganizationSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: BRAND_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: `Premium automotive lifestyle brand rooted in Japanese car culture. ${TAGLINE}`,
    sameAs: [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.youtube,
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.tiktok,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "dreamstardriversclub@yahoo.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function ProductSchema({
  name,
  description,
  sku,
  price,
  image,
  slug,
  category,
  brand = BRAND_NAME,
}: {
  name: string;
  description: string;
  sku: string;
  price: number;
  image?: string;
  slug: string;
  category: string;
  brand?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description.slice(0, 200),
    sku,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    category,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${slug}`,
      priceCurrency: "USD",
      price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(image && { image }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebSiteSchema() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: BRAND_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
