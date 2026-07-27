/**
 * Stripe REST API helpers — no SDK dependency.
 * Uses raw fetch() to Stripe's REST API to avoid build issues.
 */

const STRIPE_API = "https://api.stripe.com/v1";

function authHeader(): string {
  return `Basic ${btoa(`${process.env.STRIPE_SECRET_KEY}:`)}`;
}

async function stripeFetch<T>(
  path: string,
  options: { method?: string; body?: URLSearchParams } = {},
): Promise<T> {
  const url = `${STRIPE_API}${path}`;
  const res = await fetch(url, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: options.body?.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Stripe API error ${res.status}: ${err}`);
  }

  return res.json() as Promise<T>;
}

export interface StripeCheckoutSession {
  id: string;
  url: string | null;
  payment_status: string;
  metadata: Record<string, string>;
}

export async function createCheckoutSession(params: {
  lineItems: Array<{
    name: string;
    unitAmount: number; // in cents
    quantity: number;
    image?: string;
    variantName?: string;
  }>;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
  shippingAmount?: number; // dollars — added as shipping_options
  taxAmount?: number; // dollars — added as a line item
}): Promise<StripeCheckoutSession> {
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", params.successUrl);
  body.set("cancel_url", params.cancelUrl);

  let lineIndex = 0;

  params.lineItems.forEach((item) => {
    body.set(`line_items[${lineIndex}][price_data][currency]`, "usd");
    body.set(
      `line_items[${lineIndex}][price_data][product_data][name]`,
      item.name + (item.variantName ? ` — ${item.variantName}` : ""),
    );
    body.set(`line_items[${lineIndex}][price_data][unit_amount]`, String(item.unitAmount));
    body.set(`line_items[${lineIndex}][quantity]`, String(item.quantity));
    lineIndex++;
  });

  // Add shipping as a shipping_option (not a line item — cleaner UX)
  if (params.shippingAmount && params.shippingAmount > 0) {
    const shippingCents = Math.round(params.shippingAmount * 100);
    body.set("shipping_options[0][shipping_rate_data][display_name]", "Shipping");
    body.set(
      `shipping_options[0][shipping_rate_data][fixed_amount][amount]`,
      String(shippingCents),
    );
    body.set(
      `shipping_options[0][shipping_rate_data][fixed_amount][currency]`,
      "usd",
    );
    body.set("shipping_options[0][shipping_rate_data][type]", "fixed_amount");
  }

  // Add tax as a line item (Stripe Tax auto-calculation requires dashboard setup)
  if (params.taxAmount && params.taxAmount > 0) {
    const taxCents = Math.round(params.taxAmount * 100);
    body.set(`line_items[${lineIndex}][price_data][currency]`, "usd");
    body.set(`line_items[${lineIndex}][price_data][product_data][name]`, "Tax");
    body.set(`line_items[${lineIndex}][price_data][unit_amount]`, String(taxCents));
    body.set(`line_items[${lineIndex}][quantity]`, "1");
    lineIndex++;
  }

  if (params.metadata) {
    Object.entries(params.metadata).forEach(([key, value]) => {
      body.set(`metadata[${key}]`, value);
    });
  }

  return stripeFetch<StripeCheckoutSession>("/checkout/sessions", {
    method: "POST",
    body,
  });
}

export async function retrieveCheckoutSession(
  sessionId: string,
): Promise<StripeCheckoutSession> {
  return stripeFetch<StripeCheckoutSession>(
    `/checkout/sessions/${encodeURIComponent(sessionId)}`,
  );
}
