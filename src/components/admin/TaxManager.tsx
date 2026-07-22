"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface TaxRate {
  id: string;
  name: string;
  country: string;
  state: string | null;
  rate: number;
  isActive: boolean;
  createdAt: string;
}

const COUNTRY_OPTIONS = ["US", "CA", "MX", "GB", "DE", "FR", "AU", "JP"];
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN",
  "IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV",
  "NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN",
  "TX","UT","VT","VA","WA","WV","WI","WY",
];

export function TaxManager() {
  const [taxes, setTaxes] = useState<TaxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TaxRate | null>(null);
  const [formName, setFormName] = useState("");
  const [formCountry, setFormCountry] = useState("US");
  const [formState, setFormState] = useState("");
  const [formRate, setFormRate] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<TaxRate | null>(null);

  const fetchTaxes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/taxes");
      const data = await res.json();
      setTaxes(data.taxes ?? []);
    } catch {
      setError("Failed to load tax rates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTaxes();
  }, [fetchTaxes]);

  function resetForm() {
    setFormName("");
    setFormCountry("US");
    setFormState("");
    setFormRate("");
    setFormIsActive(true);
    setEditing(null);
    setError("");
  }

  function openNew() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(tax: TaxRate) {
    setFormName(tax.name);
    setFormCountry(tax.country);
    setFormState(tax.state ?? "");
    setFormRate(String(tax.rate));
    setFormIsActive(tax.isActive);
    setEditing(tax);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    resetForm();
  }

  async function saveTax() {
    if (!formName.trim()) {
      setError("Name is required");
      return;
    }
    const rate = parseFloat(formRate);
    if (isNaN(rate) || rate < 0) {
      setError("Valid rate is required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const method = editing ? "PUT" : "POST";
      const url = editing ? `/api/admin/taxes/${editing.id}` : "/api/admin/taxes";

      const body: Record<string, unknown> = {
        name: formName.trim(),
        country: formCountry,
        state: formState.trim() || null,
        rate,
        isActive: formIsActive,
      };

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
      fetchTaxes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/taxes/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteTarget(null);
      fetchTaxes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(tax: TaxRate) {
    try {
      const res = await fetch(`/api/admin/taxes/${tax.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !tax.isActive }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      fetchTaxes();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Toggle failed");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-ds-gray-400">
          {taxes.length} tax rate{taxes.length !== 1 ? "s" : ""}
        </span>
        <Button onClick={openNew} size="sm">
          + Add Tax Rate
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
        ) : taxes.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-ds-gray-500">No tax rates defined yet.</p>
            <Button onClick={openNew} variant="outline" size="sm" className="mt-4">
              + Add Tax Rate
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-ds-black/30">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Name
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Country
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    State
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Rate
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
                {taxes.map((tax) => (
                  <tr
                    key={tax.id}
                    className="border-b border-white/[0.03] transition-colors hover:bg-ds-white/[0.02]"
                  >
                    <td className="px-5 py-3 font-medium text-ds-white">{tax.name}</td>
                    <td className="px-5 py-3 text-ds-gray-400">{tax.country}</td>
                    <td className="px-5 py-3 text-ds-gray-400">{tax.state || "—"}</td>
                    <td className="px-5 py-3 text-ds-white">{(tax.rate * 100).toFixed(2)}%</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(tax)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                          tax.isActive ? "bg-ds-red" : "bg-ds-darkgray"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                            tax.isActive ? "translate-x-4" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(tax)}
                          className="rounded px-2 py-1 text-xs text-ds-gray-400 hover:text-ds-white hover:bg-ds-white/[0.06]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteTarget(tax)}
                          className="rounded px-2 py-1 text-xs text-ds-gray-400 hover:text-ds-red hover:bg-ds-red/10"
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
        title={editing ? "Edit Tax Rate" : "Add Tax Rate"}
        size="md"
        actions={
          <>
            <Button variant="ghost" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveTax} disabled={saving}>
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Tax Rate"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g., US Sales Tax"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                Country
              </label>
              <select
                value={formCountry}
                onChange={(e) => setFormCountry(e.target.value)}
                className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
              >
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {formCountry === "US" ? (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                  State
                </label>
                <select
                  value={formState}
                  onChange={(e) => setFormState(e.target.value)}
                  className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                >
                  <option value="">All States</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            ) : (
              <Input
                label="State/Province"
                value={formState}
                onChange={(e) => setFormState(e.target.value)}
                placeholder="Leave blank for all"
              />
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Rate (decimal, e.g. 0.0825 = 8.25%)"
              type="number"
              min={0}
              step="0.001"
              value={formRate}
              onChange={(e) => setFormRate(e.target.value)}
              placeholder="0.0825"
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                Status
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5">
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

      {/* Delete confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Tax Rate"
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
          Delete tax rate <span className="font-bold text-ds-white">&ldquo;{deleteTarget?.name}&rdquo;</span>?
        </p>
      </Modal>
    </div>
  );
}
