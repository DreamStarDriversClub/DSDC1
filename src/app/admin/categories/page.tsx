"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  productCount: number;
  childCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formParentId, setFormParentId] = useState("");

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data.categories ?? []);
    } catch {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function resetForm() {
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormParentId("");
    setError("");
    setEditing(null);
  }

  function openNew() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description ?? "");
    setFormParentId(cat.parentId ?? "");
    setEditing(cat);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  async function saveCategory() {
    if (!formName.trim() || !formSlug.trim()) {
      setError("Name and slug are required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `/api/admin/categories/${editing.id}`
        : "/api/admin/categories";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          slug: formSlug.trim().toLowerCase().replace(/\s+/g, "-"),
          description: formDesc.trim() || null,
          parentId: formParentId || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }

      closeForm();
      fetchCategories();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }

      setDeleteTarget(null);
      fetchCategories();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  // Build tree structure
  const rootCategories = categories.filter((c) => !c.parentId);
  const getChildren = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  // Parent options (exclude self and children when editing)
  const parentOptions = categories.filter((c) => {
    if (!editing) return true;
    if (c.id === editing.id) return false;
    // Also exclude children of the editing category to avoid circular refs
    const childIds = new Set<string>();
    const collectChildren = (id: string) => {
      getChildren(id).forEach((child) => {
        childIds.add(child.id);
        collectChildren(child.id);
      });
    };
    collectChildren(editing.id);
    return !childIds.has(c.id);
  });

  function renderTree(cat: Category, depth: number = 0) {
    const children = getChildren(cat.id);
    return (
      <div key={cat.id}>
        <div
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-ds-white/[0.03]"
          style={{ marginLeft: depth * 20 }}
        >
          <span className="text-xs text-ds-gray-500">
            {children.length > 0 ? "📁" : "📄"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ds-white truncate">{cat.name}</p>
            <p className="text-xs text-ds-gray-500">/{cat.slug}</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-ds-gray-500">
            <span>{cat.productCount} products</span>
            {cat.childCount > 0 && <span>· {cat.childCount} sub</span>}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => openEdit(cat)}
              className="rounded px-2 py-1 text-xs text-ds-gray-400 transition-colors hover:bg-ds-white/[0.06] hover:text-ds-white"
            >
              Edit
            </button>
            <button
              onClick={() => setDeleteTarget(cat)}
              className="rounded px-2 py-1 text-xs text-ds-gray-400 transition-colors hover:bg-ds-red/10 hover:text-ds-red"
            >
              Delete
            </button>
          </div>
        </div>
        {children.map((child) => renderTree(child, depth + 1))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
            Categories
          </h1>
          <p className="mt-1 text-sm text-ds-gray-400">
            Manage product categories and subcategories
          </p>
        </div>
        <Button onClick={openNew} size="sm">
          + Add Category
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-20 text-center">
            <svg
              className="mx-auto h-12 w-12 text-ds-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            <p className="mt-4 text-sm text-ds-gray-500">
              No categories yet. Create your first one.
            </p>
            <Button onClick={openNew} variant="outline" size="sm" className="mt-4">
              + Add Category
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04] p-2">
            {rootCategories.map((cat) => renderTree(cat))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editing ? "Edit Category" : "New Category"}
        size="md"
        actions={
          <>
            <Button variant="ghost" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveCategory} disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Category"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={formName}
            onChange={(e) => {
              setFormName(e.target.value);
              if (!editing) {
                setFormSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }
            }}
            placeholder="e.g., Apparel"
          />
          <Input
            label="Slug"
            value={formSlug}
            onChange={(e) => setFormSlug(e.target.value)}
            placeholder="e.g., apparel"
          />
          <div className="w-full">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
              Description
            </label>
            <textarea
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              rows={3}
              placeholder="Brief category description"
              className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            />
          </div>
          <div className="w-full">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
              Parent Category
            </label>
            <select
              value={formParentId}
              onChange={(e) => setFormParentId(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            >
              <option value="">None (top-level)</option>
              {parentOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Category"
        size="sm"
        actions={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} disabled={saving}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ds-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-ds-white">
            &ldquo;{deleteTarget?.name}&rdquo;
          </span>
          ?
        </p>
        {deleteTarget && deleteTarget.childCount > 0 && (
          <p className="mt-2 text-xs text-ds-red-400">
            This will also delete {deleteTarget.childCount} subcategories.
          </p>
        )}
        {deleteTarget && deleteTarget.productCount > 0 && (
          <p className="mt-2 text-xs text-ds-red-400">
            Cannot delete: {deleteTarget.productCount} products are assigned to this category.
          </p>
        )}
      </Modal>
    </div>
  );
}
