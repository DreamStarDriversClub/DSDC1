/**
 * Printful REST API helpers — no SDK dependency.
 * Uses raw fetch() to Printful's API.
 */

const PRINTFUL_API = "https://api.printful.com";

function authHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.PRINTFUL_API_KEY || ""}`,
    "Content-Type": "application/json",
  };
}

async function printfulFetch<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const url = `${PRINTFUL_API}${path}`;
  const res = await fetch(url, {
    method: options.method || "GET",
    headers: authHeaders(),
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      `Printful API error ${res.status}: ${JSON.stringify(data)}`,
    );
  }

  return data as T;
}

export interface PrintfulOrderResult {
  code: number;
  result: {
    id: number;
    external_id: string;
    status: string;
  };
}

export interface PrintfulOrderStatusResult {
  code: number;
  result: {
    id: number;
    status: string;
    shipments?: Array<{
      tracking_number?: string;
      tracking_url?: string;
      carrier?: string;
    }>;
  };
}

export async function createPrintfulOrder(params: {
  externalId: string;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone?: string;
    email: string;
  };
  items: Array<{
    printfulVariantId: string;
    quantity: number;
    retailPrice: number;
    name: string;
  }>;
  retailCosts: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
  shippingMethod: string;
}): Promise<{ printfulOrderId: number; status: string }> {
  const body = {
    external_id: params.externalId,
    shipping: shippingMethodToPrintful(params.shippingMethod),
    recipient: {
      name: params.shippingAddress.name,
      address1: params.shippingAddress.line1,
      address2: params.shippingAddress.line2 || "",
      city: params.shippingAddress.city,
      state_code: params.shippingAddress.state,
      country_code: params.shippingAddress.country || "US",
      zip: params.shippingAddress.zip,
      phone: params.shippingAddress.phone || "",
      email: params.shippingAddress.email,
    },
    items: params.items.map((item) => ({
      sync_variant_id: item.printfulVariantId,
      quantity: item.quantity,
      retail_price: String(item.retailPrice.toFixed(2)),
      name: item.name,
    })),
    retail_costs: {
      subtotal: String(params.retailCosts.subtotal.toFixed(2)),
      shipping: String(params.retailCosts.shipping.toFixed(2)),
      tax: String(params.retailCosts.tax.toFixed(2)),
      discount: String(params.retailCosts.discount.toFixed(2)),
      total: String(params.retailCosts.total.toFixed(2)),
    },
  };

  const data = await printfulFetch<PrintfulOrderResult>("/orders", {
    method: "POST",
    body,
  });

  return {
    printfulOrderId: data.result.id,
    status: data.result.status,
  };
}

export async function getPrintfulOrder(
  printfulOrderId: number,
): Promise<{ status: string; trackingNumber?: string; trackingUrl?: string }> {
  const data = await printfulFetch<PrintfulOrderStatusResult>(
    `/orders/${printfulOrderId}`,
  );

  const shipment = data.result.shipments?.[0];
  return {
    status: data.result.status,
    trackingNumber: shipment?.tracking_number,
    trackingUrl: shipment?.tracking_url,
  };
}

function shippingMethodToPrintful(method: string): string {
  const map: Record<string, string> = {
    standard: "STANDARD",
    express: "EXPRESS",
    overnight: "OVERNIGHT",
  };
  return map[method.toLowerCase()] || "STANDARD";
}

// ── Admin sync functions ─────────────────────────────────

export interface PrintfulStoreProduct {
  id: number;
  external_id: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
}

export interface PrintfulPagedResult<T> {
  code: number;
  result: T[];
  paging: { total: number; offset: number; limit: number };
}

export interface PrintfulProductDetail {
  code: number;
  result: {
    sync_product: PrintfulStoreProduct;
    sync_variants: PrintfulSyncVariant[];
  };
}

export interface PrintfulSyncVariant {
  id: number;
  external_id: string;
  sync_product_id: number;
  name: string;
  variant_id: number;
  size: string;
  color: string;
  retail_price: string;
  currency: string;
  sku: string;
}

export async function getStoreProducts(
  offset = 0,
  limit = 50,
): Promise<PrintfulPagedResult<PrintfulStoreProduct>> {
  const params = new URLSearchParams({ offset: String(offset), limit: String(limit) });
  return printfulFetch(`/store/products?${params}`);
}

export async function getProductVariants(
  productId: number,
): Promise<PrintfulProductDetail> {
  return printfulFetch(`/store/products/${productId}`);
}
