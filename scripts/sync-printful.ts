import { prisma } from "../src/lib/prisma";

const PRINTFUL_BASE = "https://api.printful.com";
const API_KEY = process.env.PRINTFUL_API_KEY || "";

async function fetchPrintful(endpoint: string) {
  const res = await fetch(PRINTFUL_BASE + endpoint, {
    headers: { Authorization: "Bearer " + API_KEY },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error("Printful " + res.status + ": " + err);
  }
  return res.json();
}

(async () => {
  try {
    let allProducts: any[] = [];
    let offset = 0, limit = 50;
    let total = 0;
    do {
      const page = await fetchPrintful("/store/products?offset=" + offset + "&limit=" + limit);
      allProducts = allProducts.concat(page.result);
      total = page.paging.total;
      offset += limit;
    } while (offset < total);

    console.log("Found " + allProducts.length + " Printful store products");

    let synced = 0;
    for (const sp of allProducts) {
      let variants: any[] = [];
      try {
        const detail = await fetchPrintful("/store/products/" + sp.id);
        variants = detail.result.sync_variants || [];
      } catch (e: any) {
        console.warn("  Could not get variants for", sp.id, sp.name);
      }

      await prisma.printfulProduct.upsert({
        where: { printfulId: String(sp.id) },
        update: {
          name: sp.name,
          thumbnailUrl: sp.thumbnail_url,
          variantCount: sp.variants,
          syncedAt: new Date(),
        },
        create: {
          id: sp.id,
          printfulId: String(sp.id),
          name: sp.name,
          thumbnailUrl: sp.thumbnail_url,
          variantCount: sp.variants,
        },
      });

      for (const sv of variants) {
        const price = sv.retail_price ? parseFloat(sv.retail_price) : 0;
        await prisma.printfulVariant.upsert({
          where: { printfulId: String(sv.id) },
          update: { name: sv.name, size: sv.size, color: sv.color, price, syncedAt: new Date() },
          create: {
            printfulId: String(sv.id),
            productId: String(sv.sync_product_id),
            name: sv.name,
            size: sv.size,
            color: sv.color,
            price,
          },
        });
      }
      synced++;
    }

    const pfCount = await prisma.printfulProduct.count();
    const pfVarCount = await prisma.printfulVariant.count();
    console.log("Synced " + synced + " products, now have " + pfCount + " products, " + pfVarCount + " variants");
  } catch (e: any) {
    console.error("Error:", e.message);
  }
})();
