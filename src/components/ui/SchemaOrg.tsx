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
