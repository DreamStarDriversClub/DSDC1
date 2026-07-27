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
}): Promise<StripeCheckoutSession> {
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", params.successUrl);
  body.set("cancel_url", params.cancelUrl);

  params.lineItems.forEach((item, i) => {
    body.set(`line_items[${i}][price_data][currency]`, "usd");
    body.set(
      `line_items[${i}][price_data][product_data][name]`,
      item.name + (item.variantName ? ` — ${item.variantName}` : ""),
    );
    body.set(`line_items[${i}][price_data][unit_amount]`, String(item.unitAmount));
    body.set(`line_items[${i}][quantity]`, String(item.quantity));
  });

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
