/**
 * Printful REST API client.
 *
 * Base URL: https://api.printful.com
 * Auth: Bearer token from PRINTFUL_API_KEY env var.
 * Docs: https://developers.printful.com/docs/
 */

const PRINTFUL_BASE = "https://api.printful.com";

function getApiKey(): string {
  const key = process.env.PRINTFUL_API_KEY;
  if (!key) {
    throw new Error("PRINTFUL_API_KEY is not set in environment variables.");
  }
  return key;
}

interface PrintfulHeaders {
  Authorization: string;
  "Content-Type"?: string;
}

function headers(contentType = false): PrintfulHeaders {
  const h: PrintfulHeaders = {
    Authorization: `Bearer ${getApiKey()}`,
  };
  if (contentType) {
    h["Content-Type"] = "application/json";
  }
  return h;
}

// ── Types ──────────────────────────────────────────────

export interface PrintfulFile {
  id: number;
  type: string;
  hash: string;
  url: string | null;
  filename: string;
  mime_type: string;
  size: number;
  width: number;
  height: number;
  dpi: number;
  status: string;
  created: number;
  thumbnail_url: string;
  preview_url: string;
  visible: boolean;
  is_temporary: boolean;
  message: string | null;
}

export interface PrintfulVariantOption {
  id: string;
  value: string;
}

export interface PrintfulProduct {
  id: number;
  main_category_id: number;
  type: string;
  type_name?: string;
  title?: string;
  brand: string | null;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  files: PrintfulFile[];
  options: PrintfulVariantOption[];
  is_discontinued: boolean;
  avg_fulfillment_time: number | null;
  description: string;
  techniques?: Array<{
    key: string;
    display_name: string;
    is_default: boolean;
  }>;
  origin_country?: string | null;
}

export interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string | null;
  color: string | null;
  color_code: string | null;
  color_code2: string | null;
  image: string | null;
  price: string | null;
  in_stock: boolean;
  availability_regions: Record<string, string>;
}

export interface PrintfulSyncVariant extends PrintfulVariant {
  sync_product_id: number;
  synced: boolean;
  external_id?: string;
  sync_variant_id: number;
  warehouse_product_variant_id: number | null;
  retail_price: string | null;
  sku?: string;
  currency?: string;
  product: {
    variant_id: number;
    product_id: number;
    image: string | null;
    name: string;
  };
}

export interface PrintfulSyncProduct {
  id: number;
  external_id?: string;
  name: string;
  variants: number;
  synced: number;
  thumbnail_url: string | null;
  is_ignored: boolean;
}

export interface PrintfulPaginatedResponse<T> {
  code: number;
  result: T[];
  paging: {
    total: number;
    offset: number;
    limit: number;
  };
}

export interface PrintfulSingleResponse<T> {
  code: number;
  result: T;
}

export interface PrintfulError {
  code: number;
  result: string;
  error: {
    reason: string;
    message: string;
  };
}

// ── Helpers ────────────────────────────────────────────

async function printfulFetch<T>(
  endpoint: string,
  init?: RequestInit
): Promise<T> {
  const url = `${PRINTFUL_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      ...headers(init?.method === "POST" || init?.method === "PUT"),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    let errorBody = "";
    try {
      errorBody = await res.text();
    } catch {
      // ignore
    }
    throw new Error(
      `Printful API error ${res.status} on ${endpoint}: ${errorBody || res.statusText}`
    );
  }

  const json = await res.json();
  return json as T;
}

// ── Store Products ─────────────────────────────────────

/**
 * GET /store/products
 * Returns a paginated list of all sync products in the Printful store.
 */
export async function getStoreProducts(
  offset = 0,
  limit = 50
): Promise<PrintfulPaginatedResponse<PrintfulSyncProduct>> {
  return printfulFetch<PrintfulPaginatedResponse<PrintfulSyncProduct>>(
    `/store/products?offset=${offset}&limit=${limit}`
  );
}

/**
 * GET /store/products/{id}
 * Returns detailed product info for a single Printful store product,
 * including all its variants.
 */
export async function getProductVariants(
  productId: number
): Promise<PrintfulSingleResponse<PrintfulSyncProduct & { sync_variants: PrintfulSyncVariant[] }>> {
  return printfulFetch<
    PrintfulSingleResponse<PrintfulSyncProduct & { sync_variants: PrintfulSyncVariant[] }>
  >(`/store/products/${productId}`);
}

/**
 * GET /store/variants/{id}
 * Returns a single synced variant with pricing/details.
 */
export async function getSyncVariant(
  variantId: number
): Promise<PrintfulSingleResponse<PrintfulSyncVariant>> {
  return printfulFetch<PrintfulSingleResponse<PrintfulSyncVariant>>(
    `/store/variants/${variantId}`
  );
}

// ── Catalog (generic Printful catalog, not store) ──────

/**
 * GET /products/{id}
 * Returns catalog product details from Printful's catalog (not store-specific).
 */
export async function getCatalogProduct(
  productId: number
): Promise<PrintfulSingleResponse<PrintfulProduct>> {
  return printfulFetch<PrintfulSingleResponse<PrintfulProduct>>(
    `/products/${productId}`
  );
}

/**
 * GET /products/variant/{id}
 * Returns a single catalog variant (non-store).
 */
export async function getCatalogVariant(
  variantId: number
): Promise<PrintfulSingleResponse<PrintfulVariant>> {
  return printfulFetch<PrintfulSingleResponse<PrintfulVariant>>(
    `/products/variant/${variantId}`
  );
}
