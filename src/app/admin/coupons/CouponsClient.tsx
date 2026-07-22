"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount: number | null;
  maxUses: number | null;
  currentUses: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

function randomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function CouponsClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [formCode, setFormCode] = useState("");
  const [formType, setFormType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [formValue, setFormValue] = useState("");
  const [formMinOrder, setFormMinOrder] = useState("");
  const [formMaxUses, setFormMaxUses] = useState("");
  const [formExpiresAt, setFormExpiresAt] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      setCoupons(data.coupons ?? []);
    } catch {
      setError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  function resetForm() {
    setFormCode("");
    setFormType("PERCENTAGE");
    setFormValue("");
    setFormMinOrder("");
    setFormMaxUses("");
    setFormExpiresAt("");
    setFormIsActive(true);
    setError("");
    setEditing(null);
  }

  function openNew() {
    resetForm();
    setFormCode(randomCode());
    setShowForm(true);
  }

  function openEdit(coupon: Coupon) {
    setFormCode(coupon.code);
    setFormType(coupon.discountType);
    setFormValue(String(coupon.discountValue));
    setFormMinOrder(coupon.minOrderAmount ? String(coupon.minOrderAmount) : "");
    setFormMaxUses(coupon.maxUses ? String(coupon.maxUses) : "");
    setFormExpiresAt(coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "");
    setFormIsActive(coupon.isActive);
    setEditing(coupon);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  async function toggleActive(coupon: Coupon) {
    try {
      const res = await fetch(`/api/admin/coupons/${coupon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Toggle failed");
      }

      fetchCoupons();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Toggle failed");
    }
  }

  async function saveCoupon() {
    if (!formCode.trim()) {
      setError("Code is required");
      return;
    }
    const value = parseFloat(formValue);
    if (isNaN(value) || value <= 0) {
      setError("Valid discount value is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `/api/admin/coupons/${editing.id}`
        : "/api/admin/coupons";

      const body: Record<string, unknown> = {
        code: formCode.trim(),
        discountType: formType,
        discountValue: value,
        isActive: formIsActive,
      };

      if (formMinOrder.trim()) {
        const minOrder = parseFloat(formMinOrder);
        if (!isNaN(minOrder) && minOrder >= 0) body.minOrderAmount = minOrder;
      } else {
        body.minOrderAmount = null;
      }

      if (formMaxUses.trim()) {
        const maxUses = parseInt(formMaxUses, 10);
        if (!isNaN(maxUses) && maxUses > 0) body.maxUses = maxUses;
      } else {
        body.maxUses = null;
      }

      if (formExpiresAt) {
        body.expiresAt = new Date(formExpiresAt).toISOString();
      } else {
        body.expiresAt = null;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }

      closeForm();
      fetchCoupons();
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
      const res = await fetch(`/api/admin/coupons/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }

      setDeleteTarget(null);
      fetchCoupons();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  const isExpired = (coupon: Coupon) => {
    if (!coupon.expiresAt) return false;
    return new Date(coupon.expiresAt) < new Date();
  };

  const usagePercent = (coupon: Coupon) => {
    if (!coupon.maxUses) return 0;
    return Math.min(100, Math.round((coupon.currentUses / coupon.maxUses) * 100));
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-ds-gray-400">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
          </span>
        </div>
        <Button onClick={openNew} size="sm">
          + Create Coupon
        </Button>
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
        ) : coupons.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-ds-gray-500">No coupons yet. Create your first one.</p>
            <Button onClick={openNew} variant="outline" size="sm" className="mt-4">
              + Create Coupon
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-ds-black/30">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Code
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Type
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Value
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Min Order
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Usage
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Expires
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Active
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="border-b border-white/[0.03] transition-colors hover:bg-ds-white/[0.02]"
                  >
                    <td className="px-5 py-3">
                      <span className="font-mono text-sm font-bold text-ds-white">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-full border border-white/[0.12] bg-ds-white/[0.04] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-gray-300">
                        {coupon.discountType === "PERCENTAGE" ? "%" : "$"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ds-white">
                      {coupon.discountType === "PERCENTAGE"
                        ? `${coupon.discountValue}%`
                        : `$${coupon.discountValue.toFixed(2)}`}
                    </td>
                    <td className="px-5 py-3 text-ds-gray-400">
                      {coupon.minOrderAmount
                        ? `$${coupon.minOrderAmount.toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-ds-gray-300">
                          {coupon.currentUses}
                          {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                        </span>
                        {coupon.maxUses && (
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ds-darkgray">
                            <div
                              className={`h-full rounded-full transition-all ${
                                usagePercent(coupon) >= 90
                                  ? "bg-red-500"
                                  : usagePercent(coupon) >= 70
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{ width: `${usagePercent(coupon)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {coupon.expiresAt ? (
                        <span
                          className={`text-xs ${
                            isExpired(coupon) ? "text-red-400" : "text-ds-gray-400"
                          }`}
                        >
                          {new Date(coupon.expiresAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      ) : (
                        <span className="text-xs text-ds-gray-500">Never</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(coupon)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                          coupon.isActive ? "bg-ds-red" : "bg-ds-darkgray"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                            coupon.isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(coupon)}
                          className="rounded px-2 py-1 text-xs text-ds-gray-400 transition-colors hover:bg-ds-white/[0.06] hover:text-ds-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(coupon)}
                          className="rounded px-2 py-1 text-xs text-ds-gray-400 transition-colors hover:bg-ds-red/10 hover:text-ds-red"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={closeForm}
        title={editing ? "Edit Coupon" : "Create Coupon"}
        size="md"
        actions={
          <>
            <Button variant="ghost" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveCoupon} disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Coupon"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                label="Code"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value.toUpperCase())}
                placeholder="e.g., SUMMER20"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFormCode(randomCode())}
              className="mb-0.5"
            >
              Generate
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                Type
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as "PERCENTAGE" | "FIXED")}
                className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>
            <Input
              label={formType === "PERCENTAGE" ? "Value (%)" : "Value ($)"}
              type="number"
              min={0}
              step={formType === "PERCENTAGE" ? "1" : "0.01"}
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder={formType === "PERCENTAGE" ? "20" : "10.00"}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Minimum Order Amount ($)"
              type="number"
              min={0}
              step="0.01"
              value={formMinOrder}
              onChange={(e) => setFormMinOrder(e.target.value)}
              placeholder="Leave empty for no minimum"
            />
            <Input
              label="Maximum Uses"
              type="number"
              min={1}
              value={formMaxUses}
              onChange={(e) => setFormMaxUses(e.target.value)}
              placeholder="Leave empty for unlimited"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              type="date"
              value={formExpiresAt}
              onChange={(e) => setFormExpiresAt(e.target.value)}
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                Status
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 transition-colors hover:border-ds-red/30">
                <input
                  type="checkbox"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded border-white/[0.15] bg-ds-black text-ds-red focus:ring-ds-red/30"
                />
                <span className="text-sm text-ds-white">Active</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Coupon"
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
          Are you sure you want to delete the coupon{" "}
          <span className="font-mono font-bold text-ds-white">
            &ldquo;{deleteTarget?.code}&rdquo;
          </span>
          ?
        </p>
        {deleteTarget && deleteTarget.currentUses > 0 && (
          <p className="mt-2 text-xs text-ds-red-400">
            This coupon has been used {deleteTarget.currentUses} times.
          </p>
        )}
      </Modal>
    </div>
  );
}
