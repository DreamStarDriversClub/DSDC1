/**
 * One-off script to sync Printful products into the database.
 * Run with: bun run scripts/sync-printful.ts
 */

import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env manually since we're running standalone
const envPath = resolve(__dirname, "..", ".env");
try {
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.error("Could not load .env file from", envPath);
  process.exit(1);
}

const PRINTFUL_API = "https://api.printful.com";
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

if (!PRINTFUL_API_KEY) {
  console.error("PRINTFUL_API_KEY is not set");
  process.exit(1);
}

const prisma = new PrismaClient();

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
  const response = await fetch(`${PRINTFUL_API}${path}`, {
    headers: { Authorization: `Bearer ${PRINTFUL_API_KEY}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Printful API returned ${response.status}`);
  const body = (await response.json()) as { result: T; error?: { message?: string } };
  if (body.error) throw new Error(body.error.message || "Printful API error");
  return body.result;
}

async function main() {
  console.log("Fetching Printful products...");
  const summaries = await printfulFetch<PrintfulProductSummary[]>("/store/products");
  console.log(`Found ${summaries.length} products`);

  let variantCount = 0;

  for (const summary of summaries) {
    console.log(`  Syncing: "${summary.name}" (ID: ${summary.id})`);
    const detail = await printfulFetch<PrintfulDetail>(`/store/products/${summary.id}`);
    const variants = detail.sync_variants || [];

    await prisma.printfulProduct.upsert({
      where: { printfulId: String(summary.id) },
      create: {
        id: summary.id,
        printfulId: String(summary.id),
        name: summary.name,
        thumbnailUrl: summary.thumbnail_url ?? null,
        variantCount: variants.length,
        syncedAt: new Date(),
      },
      update: {
        name: summary.name,
        thumbnailUrl: summary.thumbnail_url ?? null,
        variantCount: variants.length,
        syncedAt: new Date(),
      },
    });

    for (const variant of variants) {
      const options = Object.fromEntries(
        (variant.options || [])
          .filter((option) => option && option.name)
          .map((option) => [option.name.toLowerCase(), option.value || ""])
      );
      const price = Number(variant.retail_price ?? variant.price ?? 0);

      await prisma.printfulVariant.upsert({
        where: { printfulId: String(variant.id) },
        create: {
          printfulId: String(variant.id),
          catalogVariantId: variant.variant_id ?? null,
          productId: String(summary.id),
          name: variant.name,
          size: options.size ?? null,
          color: options.color ?? null,
          price,
          currency: variant.currency ?? "USD",
          syncedAt: new Date(),
        },
        update: {
          catalogVariantId: variant.variant_id ?? null,
          productId: String(summary.id),
          name: variant.name,
          size: options.size ?? null,
          color: options.color ?? null,
          price,
          currency: variant.currency ?? "USD",
          syncedAt: new Date(),
        },
      });
      variantCount++;
    }
  }

  console.log(`\nDone! Synced ${summaries.length} products and ${variantCount} variants.`);

  // Verify
  const productCount = await prisma.printfulProduct.count();
  const dbVariantCount = await prisma.printfulVariant.count();
  console.log(`DB verification: ${productCount} PrintfulProduct rows, ${dbVariantCount} PrintfulVariant rows`);
}

main()
  .catch((err) => {
    console.error("Sync failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
