"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface Variant {
  id: string;
  name: string;
  sku: string;
  price: number;
}

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  inventory: number;
  category: string;
  isLowStock: boolean;
  variants: Variant[];
}

const LOW_STOCK_THRESHOLD = 5;

export function InventoryClient() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [editStock, setEditStock] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (lowStockOnly) params.set("lowStock", "true");
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/inventory?${params.toString()}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setLowStockCount(data.lowStockCount ?? 0);
    } catch {
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, [search, lowStockOnly]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  function openEdit(item: InventoryItem) {
    setEditingItem(item);
    setEditStock(String(item.inventory));
    setError("");
  }

  function closeEdit() {
    setEditingItem(null);
    setEditStock("");
    setError("");
  }

  async function saveStock() {
    if (!editingItem) return;

    const newStock = parseInt(editStock, 10);
    if (isNaN(newStock) || newStock < 0) {
      setError("Please enter a valid stock number (0 or higher)");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: editingItem.id, inventory: newStock }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Update failed");
      }

      closeEdit();
      fetchInventory();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  const stockBadge = (item: InventoryItem) => {
    if (item.inventory === 0) {
      return (
        <span className="inline-flex rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-400">
          Out of Stock
        </span>
      );
    }
    if (item.isLowStock) {
      return (
        <span className="inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-400">
          Low Stock
        </span>
      );
    }
    return (
      <span className="inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-green-400">
        In Stock
      </span>
    );
  };

  return (
    <div>
      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-ds-gray-500">
            Total Products
          </p>
          <p className="mt-2 text-2xl font-bold text-ds-white">{items.length}</p>
        </div>
        <div className="rounded-xl border border-ds-red/20 bg-ds-red/5 p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-ds-red-400">
            Low Stock Alert
          </p>
          <p className="mt-2 text-2xl font-bold text-ds-red">{lowStockCount}</p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-ds-gray-500">
            Out of Stock
          </p>
          <p className="mt-2 text-2xl font-bold text-ds-white">
            {items.filter((i) => i.inventory === 0).length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/[0.08] bg-ds-black px-3 py-2.5 text-xs text-ds-gray-300 transition-colors hover:border-ds-red/30">
          <input
            type="checkbox"
            checked={lowStockOnly}
            onChange={(e) => setLowStockOnly(e.target.checked)}
            className="rounded border-white/[0.15] bg-ds-black text-ds-red focus:ring-ds-red/30"
          />
          Low stock only
        </label>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-ds-gray-500">No inventory items found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-ds-black/30">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Product
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    SKU
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Category
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Current Stock
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/[0.03] transition-colors hover:bg-ds-white/[0.02]"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-ds-white">{item.name}</p>
                      {item.variants.length > 0 && (
                        <p className="text-xs text-ds-gray-500">
                          {item.variants.length} variant{item.variants.length !== 1 ? "s" : ""}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-ds-gray-400">
                      {item.sku}
                    </td>
                    <td className="px-5 py-3 text-ds-gray-400">{item.category}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`font-mono text-sm font-bold ${
                          item.inventory === 0
                            ? "text-red-400"
                            : item.isLowStock
                            ? "text-yellow-400"
                            : "text-ds-white"
                        }`}
                      >
                        {item.inventory}
                      </span>
                    </td>
                    <td className="px-5 py-3">{stockBadge(item)}</td>
                    <td className="px-5 py-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(item)}>
                        Adjust
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={!!editingItem}
        onClose={closeEdit}
        title="Adjust Stock"
        size="sm"
        actions={
          <>
            <Button variant="ghost" onClick={closeEdit} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveStock} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {editingItem && (
            <>
              <div className="rounded-lg border border-white/[0.06] bg-ds-black/50 p-4">
                <p className="text-sm font-medium text-ds-white">{editingItem.name}</p>
                <p className="text-xs text-ds-gray-500">SKU: {editingItem.sku}</p>
                <p className="mt-1 text-xs text-ds-gray-400">
                  Current stock:{" "}
                  <span
                    className={
                      editingItem.inventory === 0
                        ? "text-red-400"
                        : editingItem.isLowStock
                        ? "text-yellow-400"
                        : "text-green-400"
                    }
                  >
                    {editingItem.inventory}
                  </span>
                </p>
              </div>
              <Input
                label="New Stock Level"
                type="number"
                min={0}
                value={editStock}
                onChange={(e) => setEditStock(e.target.value)}
                placeholder="0"
              />
              {editingItem.variants.length > 0 && (
                <div className="text-xs text-ds-gray-500">
                  <p className="mb-1 font-medium text-ds-gray-400">Variants:</p>
                  {editingItem.variants.map((v) => (
                    <p key={v.id} className="font-mono">
                      {v.name} — SKU: {v.sku}
                    </p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
