"use client";
import { useState } from "react";

type Product = { id: number; name: string; thumbnailUrl: string | null; variantCount: number; syncedAt: string };
export function PrintfulSyncClient({ initialProducts, lastSynced }: { initialProducts: Product[]; lastSynced: string | null }) {
  const [products, setProducts] = useState(initialProducts);
  const [synced, setSynced] = useState(lastSynced);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  async function sync() {
    setBusy(true); setMessage(null);
    try {
      const response = await fetch("/api/admin/printful/sync", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Sync failed");
      setMessage(data.message); setSynced(data.syncedAt);
      const refresh = await fetch("/api/admin/printful/products", { cache: "no-store" });
      if (refresh.ok) setProducts(await refresh.json());
    } catch (error) { setMessage(error instanceof Error ? error.message : "Sync failed"); }
    finally { setBusy(false); }
  }
  return <>
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-ds-white/10 bg-ds-charcoal p-4"><p className="text-xs uppercase tracking-wider text-ds-gray-400">Products</p><p className="mt-2 text-2xl font-bold text-ds-white">{products.length}</p></div>
      <div className="rounded-lg border border-ds-white/10 bg-ds-charcoal p-4"><p className="text-xs uppercase tracking-wider text-ds-gray-400">Variants</p><p className="mt-2 text-2xl font-bold text-ds-white">{products.reduce((sum, p) => sum + p.variantCount, 0)}</p></div>
      <div className="rounded-lg border border-ds-white/10 bg-ds-charcoal p-4"><p className="text-xs uppercase tracking-wider text-ds-gray-400">Last synced</p><p className="mt-2 text-sm text-ds-white">{synced ? new Date(synced).toLocaleString() : "Never"}</p></div>
    </div>
    <button onClick={sync} disabled={busy} className="rounded-md bg-ds-red px-5 py-3 text-sm font-semibold text-white hover:bg-ds-red-light disabled:opacity-50">{busy ? "Syncing…" : "Sync Printful catalog"}</button>
    {message && <p className="mt-4 text-sm text-ds-gray-300">{message}</p>}
    <div className="mt-8 overflow-hidden rounded-lg border border-ds-white/10"><table className="w-full text-left text-sm"><thead className="bg-ds-charcoal text-xs uppercase text-ds-gray-400"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Variants</th><th className="px-4 py-3">Synced</th></tr></thead><tbody className="divide-y divide-ds-white/10">{products.map((product) => <tr key={product.id}><td className="px-4 py-4 text-ds-white">{product.name}</td><td className="px-4 py-4 text-ds-gray-300">{product.variantCount}</td><td className="px-4 py-4 text-ds-gray-400">{new Date(product.syncedAt).toLocaleString()}</td></tr>)}</tbody></table>{products.length === 0 && <p className="p-8 text-center text-sm text-ds-gray-400">No Printful products synced yet.</p>}</div>
  </>;
}
