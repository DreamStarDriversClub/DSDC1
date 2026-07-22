"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Variant {
  id?: string;
  name: string;
  sku: string;
  price: number;
  inventory: number;
}

interface ProductData {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  cost: number | null;
  inventory: number;
  weight: number | null;
  dimensions: string | null;
  images: string[];
  specifications: { key: string; value: string }[];
  compatibleVehicles: string[];
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  variants: Variant[];
}

interface ProductFormProps {
  initialData?: ProductData;
  productId?: string;
}

const emptyProduct: ProductData = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  price: 0,
  salePrice: null,
  cost: null,
  inventory: 0,
  weight: null,
  dimensions: null,
  images: [],
  specifications: [],
  compatibleVehicles: [],
  isActive: true,
  isFeatured: false,
  categoryId: "",
  variants: [],
};

export function ProductForm({ initialData, productId }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!productId;
  const [form, setForm] = useState<ProductData>(initialData ?? emptyProduct);
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Image URL input
  const [newImageUrl, setNewImageUrl] = useState("");

  // Spec input
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");

  // Vehicle input
  const [newVehicle, setNewVehicle] = useState("");

  // Variant input
  const [newVariant, setNewVariant] = useState<Variant>({
    name: "",
    sku: "",
    price: 0,
    inventory: 0,
  });

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  function update<K extends keyof ProductData>(key: K, value: ProductData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Auto-generate slug from name
    if (key === "name" && !isEdit) {
      const slug = (value as string).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      setForm((prev) => ({ ...prev, slug }));
    }
  }

  function addImage() {
    const url = newImageUrl.trim();
    if (!url || form.images.includes(url)) return;
    update("images", [...form.images, url]);
    setNewImageUrl("");
  }

  function removeImage(url: string) {
    update("images", form.images.filter((u) => u !== url));
  }

  function addSpec() {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    update("specifications", [...form.specifications, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
    setNewSpecKey("");
    setNewSpecValue("");
  }

  function removeSpec(index: number) {
    update("specifications", form.specifications.filter((_, i) => i !== index));
  }

  function addVehicle() {
    const v = newVehicle.trim();
    if (!v || form.compatibleVehicles.includes(v)) return;
    update("compatibleVehicles", [...form.compatibleVehicles, v]);
    setNewVehicle("");
  }

  function removeVehicle(v: string) {
    update("compatibleVehicles", form.compatibleVehicles.filter((x) => x !== v));
  }

  function addVariant() {
    if (!newVariant.name.trim() || !newVariant.sku.trim()) return;
    update("variants", [
      ...form.variants,
      { ...newVariant, price: Number(newVariant.price) || 0, inventory: Number(newVariant.inventory) || 0 },
    ]);
    setNewVariant({ name: "", sku: "", price: 0, inventory: 0 });
  }

  function removeVariant(index: number) {
    update("variants", form.variants.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    setError("");

    try {
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit ? `/api/admin/products/${productId}` : "/api/admin/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          salePrice: form.salePrice ? Number(form.salePrice) : null,
          cost: form.cost ? Number(form.cost) : null,
          weight: form.weight ? Number(form.weight) : null,
          variants: form.variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            price: Number(v.price),
            inventory: Number(v.inventory),
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
      setShowDelete(false);
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-6 rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
            Basic Information
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Product Name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g., Rotary Spirit T-Shirt"
            />
            <Input
              label="Slug"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="e.g., rotary-spirit-tshirt"
            />
            <Input
              label="SKU"
              value={form.sku}
              onChange={(e) => update("sku", e.target.value)}
              placeholder="e.g., DS-T-RS-001"
            />
            <div className="w-full">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => update("categoryId", e.target.value)}
                className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={5}
              placeholder="Product description..."
              className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            />
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
            Pricing &amp; Inventory
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              value={form.price || ""}
              onChange={(e) => update("price", parseFloat(e.target.value) || 0)}
            />
            <Input
              label="Sale Price ($)"
              type="number"
              step="0.01"
              value={form.salePrice ?? ""}
              onChange={(e) => update("salePrice", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Optional"
            />
            <Input
              label="Cost ($)"
              type="number"
              step="0.01"
              value={form.cost ?? ""}
              onChange={(e) => update("cost", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Optional"
            />
            <Input
              label="Inventory"
              type="number"
              value={form.inventory}
              onChange={(e) => update("inventory", parseInt(e.target.value) || 0)}
            />
            <Input
              label="Weight (lbs)"
              type="number"
              step="0.01"
              value={form.weight ?? ""}
              onChange={(e) => update("weight", e.target.value ? parseFloat(e.target.value) : null)}
              placeholder="Optional"
            />
            <Input
              label="Dimensions (LxWxH)"
              value={form.dimensions ?? ""}
              onChange={(e) => update("dimensions", e.target.value || null)}
              placeholder='e.g., 12x10x2"'
            />
          </div>
        </div>

        {/* Images */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
            Images
          </h2>
          <div className="flex gap-2 mb-4">
            <Input
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="Paste image URL..."
              className="flex-1"
            />
            <Button variant="outline" onClick={addImage} size="sm">
              Add
            </Button>
          </div>
          {form.images.length === 0 ? (
            <p className="text-xs text-ds-gray-500">No images yet. Add URLs above.</p>
          ) : (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {form.images.map((url, i) => (
                <div key={i} className="group relative aspect-square rounded-lg overflow-hidden border border-white/[0.06]">
                  <img src={url} alt={`Product image ${i + 1}`} className="h-full w-full object-cover" />
                  <button
                    onClick={() => removeImage(url)}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <svg className="h-5 w-5 text-ds-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
            Specifications
          </h2>
          <div className="flex gap-2 mb-4">
            <Input
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              placeholder="Key (e.g., Material)"
              className="flex-1"
            />
            <Input
              value={newSpecValue}
              onChange={(e) => setNewSpecValue(e.target.value)}
              placeholder="Value (e.g., 100% Cotton)"
              className="flex-1"
            />
            <Button variant="outline" onClick={addSpec} size="sm">
              Add
            </Button>
          </div>
          {form.specifications.length === 0 ? (
            <p className="text-xs text-ds-gray-500">No specifications yet.</p>
          ) : (
            <div className="space-y-1">
              {form.specifications.map((spec, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2 bg-ds-black/30">
                  <span className="text-sm text-ds-white">{spec.key}: <span className="text-ds-gray-400">{spec.value}</span></span>
                  <button onClick={() => removeSpec(i)} className="text-ds-gray-500 hover:text-ds-red">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compatible Vehicles */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
            Compatible Vehicles
          </h2>
          <div className="flex gap-2 mb-4">
            <Input
              value={newVehicle}
              onChange={(e) => setNewVehicle(e.target.value)}
              placeholder="e.g., Mazda RX-7 FD3S"
              className="flex-1"
            />
            <Button variant="outline" onClick={addVehicle} size="sm">
              Add
            </Button>
          </div>
          {form.compatibleVehicles.length === 0 ? (
            <p className="text-xs text-ds-gray-500">No vehicles added.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {form.compatibleVehicles.map((v, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-ds-black/30 px-3 py-1 text-xs text-ds-gray-300"
                >
                  {v}
                  <button onClick={() => removeVehicle(v)} className="text-ds-gray-500 hover:text-ds-red">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Variants */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
            Variants
          </h2>
          <div className="grid gap-2 sm:grid-cols-5 mb-4">
            <Input
              value={newVariant.name}
              onChange={(e) => setNewVariant((v) => ({ ...v, name: e.target.value }))}
              placeholder="Name (e.g., Size M)"
              className="sm:col-span-1"
            />
            <Input
              value={newVariant.sku}
              onChange={(e) => setNewVariant((v) => ({ ...v, sku: e.target.value }))}
              placeholder="SKU"
              className="sm:col-span-1"
            />
            <Input
              type="number"
              step="0.01"
              value={newVariant.price || ""}
              onChange={(e) => setNewVariant((v) => ({ ...v, price: parseFloat(e.target.value) || 0 }))}
              placeholder="Price"
              className="sm:col-span-1"
            />
            <Input
              type="number"
              value={newVariant.inventory || ""}
              onChange={(e) => setNewVariant((v) => ({ ...v, inventory: parseInt(e.target.value) || 0 }))}
              placeholder="Stock"
              className="sm:col-span-1"
            />
            <Button variant="outline" onClick={addVariant} size="sm" className="sm:col-span-1">
              Add
            </Button>
          </div>
          {form.variants.length === 0 ? (
            <p className="text-xs text-ds-gray-500">No variants yet.</p>
          ) : (
            <div className="space-y-1">
              {form.variants.map((v, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2 bg-ds-black/30">
                  <div className="flex gap-4 text-sm">
                    <span className="font-medium text-ds-white">{v.name}</span>
                    <span className="text-ds-gray-500">SKU: {v.sku}</span>
                    <span className="text-ds-gray-300">${Number(v.price).toFixed(2)}</span>
                    <span className="text-ds-gray-500">Stock: {v.inventory}</span>
                  </div>
                  <button onClick={() => removeVariant(i)} className="text-ds-gray-500 hover:text-ds-red">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Toggles */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
            Settings
          </h2>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
                className="h-4 w-4 rounded border-white/[0.15] bg-ds-black accent-ds-red"
              />
              <span className="text-sm text-ds-gray-300">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => update("isFeatured", e.target.checked)}
                className="h-4 w-4 rounded border-white/[0.15] bg-ds-black accent-ds-red"
              />
              <span className="text-sm text-ds-gray-300">Featured</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div>
            {isEdit && (
              <Button variant="danger" onClick={() => setShowDelete(true)} size="sm">
                Delete Product
              </Button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => router.push("/admin/products")}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      <Modal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete Product"
        size="sm"
        actions={
          <>
            <Button variant="ghost" onClick={() => setShowDelete(false)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ds-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-ds-white">&ldquo;{form.name}&rdquo;</span>
          ? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
