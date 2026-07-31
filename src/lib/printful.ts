import { prisma } from "@/lib/prisma";

const PRINTFUL_API = "https://api.printful.com";
const PRINTFUL_API_V2 = "https://api.printful.com/v2";

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

export interface CreatePrintfulOrderInput {
  externalId: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    email: string;
    phone?: string;
  };
  items: Array<{
    printfulVariantId: string;
    quantity: number;
    retailPrice: number;
    name?: string;
  }>;
  retailCosts: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  shippingMethod: string;
}

export interface CreatePrintfulOrderResult {
  printfulOrderId: number;
  status: string;
}

/** Create the paid order in Printful after the local/Stripe order succeeds. */
export async function createPrintfulOrder(
  input: CreatePrintfulOrderInput,
): Promise<CreatePrintfulOrderResult> {
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) throw new Error("Printful order could not be created: PRINTFUL_API_KEY is not configured");
  if (input.items.length === 0) throw new Error("Printful order could not be created: no items provided");

  const payload = {
    external_id: input.externalId,
    shipping: input.shippingMethod,
    recipient: {
      name: input.shippingAddress.name,
      address1: input.shippingAddress.line1,
      address2: input.shippingAddress.line2 || undefined,
      city: input.shippingAddress.city,
      state_code: input.shippingAddress.state,
      country_code: input.shippingAddress.country,
      zip: input.shippingAddress.zip,
      email: input.shippingAddress.email,
      phone: input.shippingAddress.phone || undefined,
    },
    items: input.items.map((item) => ({
      sync_variant_id: Number(item.printfulVariantId),
      quantity: item.quantity,
      retail_price: item.retailPrice.toFixed(2),
      name: item.name,
    })),
    retail_costs: Object.fromEntries(
      Object.entries(input.retailCosts).map(([key, value]) => [key, value.toFixed(2)]),
    ),
  };

  let response: Response;
  try {
    response = await fetch(`${PRINTFUL_API_V2}/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "network request failed";
    throw new Error(`Printful order could not be created: ${message}`);
  }

  const body = (await response.json().catch(() => null)) as
    | { result?: { id?: number; status?: string }; error?: { message?: string } }
    | null;
  if (!response.ok || !body?.result?.id) {
    const message = body?.error?.message || `Printful API returned ${response.status}`;
    throw new Error(`Printful order could not be created: ${message}`);
  }

  return {
    printfulOrderId: body.result.id,
    status: body.result.status || "draft",
  };
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
