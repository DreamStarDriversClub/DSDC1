interface ProductSchemaProps {
  name: string;
  description: string;
  sku: string;
  price: number;
  image?: string;
  slug: string;
  category: string;
}

export function ProductSchema({
  name,
  description,
  sku,
  price,
  image,
  slug,
  category,
}: ProductSchemaProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamstardc.com";
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name,
    description: description.slice(0, 300),
    sku,
    category,
    image: image ? [image] : [],
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/shop/${slug}`,
      priceCurrency: "USD",
      price: price.toFixed(2),
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamstardc.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Dream Star Drivers Club",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    sameAs: [
      "https://instagram.com/dreamstardc",
      "https://youtube.com/@dreamstardc",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteSchema() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://dreamstardc.com";
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Dream Star Drivers Club",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
