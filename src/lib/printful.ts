import { prisma } from "@/lib/prisma";

const PRINTFUL_API = "https://api.printful.com";

type PrintfulProductSummary = { id: number; name: string; thumbnail_url?: string | null };
type PrintfulVariantResponse = {
  id: number;
  variant_id?: number;
  name: string;
  retail_price?: string | number;
  price?: string | number;
  currency?: string;
  options?: Array<{ name: string; value: string }>;
};
type PrintfulDetail = {
  sync_product: PrintfulProductSummary;
  sync_variants: PrintfulVariantResponse[];
};

async function printfulFetch<T>(path: string): Promise<T> {
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) throw new Error("PRINTFUL_API_KEY is not configured");
  const response = await fetch(`${PRINTFUL_API}${path}`, {
    headers: { Authorization: `Bearer ${key}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Printful API returned ${response.status}`);
  const body = (await response.json()) as { result: T; error?: { message?: string } };
  if (body.error) throw new Error(body.error.message || "Printful API error");
  return body.result;
}

async function stripeProductForVariant(variant: PrintfulVariantResponse, product: PrintfulProductSummary) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  const metadata = { printful_variant_id: String(variant.id), printful_product_id: String(product.id) };
  const search = await fetch(`https://api.stripe.com/v1/products/search?query=${encodeURIComponent(`metadata['printful_variant_id']:'${variant.id}'`)}`, {
    headers: { Authorization: `Bearer ${key}` }, cache: "no-store",
  });
  if (search.ok) {
    const found = (await search.json()) as { data?: Array<{ id: string }> };
    if (found.data?.[0]) return found.data[0].id;
  }
  const body = new URLSearchParams({
    name: `${product.name} — ${variant.name}`,
    "metadata[printful_variant_id]": metadata.printful_variant_id,
    "metadata[printful_product_id]": metadata.printful_product_id,
  });
  const created = await fetch("https://api.stripe.com/v1/products", {
    method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" }, body,
  });
  if (!created.ok) throw new Error(`Stripe product creation failed (${created.status})`);
  return ((await created.json()) as { id: string }).id;
}

export async function syncPrintfulProducts() {
  const summaries = await printfulFetch<PrintfulProductSummary[]>('/store/products');
  let variantCount = 0;
  let stripeCount = 0;
  for (const summary of summaries) {
    const detail = await printfulFetch<PrintfulDetail>(`/store/products/${summary.id}`);
    const variants = detail.sync_variants || [];
    await prisma.printfulProduct.upsert({
      where: { printfulId: String(summary.id) },
      create: { id: summary.id, printfulId: String(summary.id), name: summary.name, thumbnailUrl: summary.thumbnail_url ?? null, variantCount: variants.length, syncedAt: new Date() },
      update: { name: summary.name, thumbnailUrl: summary.thumbnail_url ?? null, variantCount: variants.length, syncedAt: new Date() },
    });
    for (const variant of variants) {
      const options = Object.fromEntries((variant.options || []).map((option) => [option.name.toLowerCase(), option.value]));
      const stripeId = await stripeProductForVariant(variant, summary);
      await prisma.printfulVariant.upsert({
        where: { printfulId: String(variant.id) },
        create: { printfulId: String(variant.id), catalogVariantId: variant.variant_id ?? null, productId: String(summary.id), name: variant.name, size: options.size ?? null, color: options.color ?? null, price: Number(variant.retail_price ?? variant.price ?? 0), currency: variant.currency ?? "USD" },
        update: { catalogVariantId: variant.variant_id ?? null, productId: String(summary.id), name: variant.name, size: options.size ?? null, color: options.color ?? null, price: Number(variant.retail_price ?? variant.price ?? 0), currency: variant.currency ?? "USD", syncedAt: new Date() },
      });
      variantCount++;
      if (stripeId) stripeCount++;
    }
  }
  return { productCount: summaries.length, variantCount, stripeCount, syncedAt: new Date() };
}
