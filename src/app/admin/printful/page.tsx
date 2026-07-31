import { prisma } from "@/lib/prisma";
import { PrintfulSyncClient } from "./PrintfulSyncClient";

export const dynamic = "force-dynamic";

export default async function PrintfulSyncPage() {
  const products = await prisma.printfulProduct.findMany({ orderBy: { syncedAt: "desc" } });
  const lastSynced = products[0]?.syncedAt ?? null;
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">Printful Sync</h1>
        <p className="mt-1 text-sm text-ds-gray-400">Import your Printful store catalog and create matching Stripe products.</p>
      </div>
      <PrintfulSyncClient initialProducts={products.map((p) => ({ id: p.id, name: p.name, thumbnailUrl: p.thumbnailUrl, variantCount: p.variantCount, syncedAt: p.syncedAt.toISOString() }))} lastSynced={lastSynced?.toISOString() ?? null} />
    </div>
  );
}
