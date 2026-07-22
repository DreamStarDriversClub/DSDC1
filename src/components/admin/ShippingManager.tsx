"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface ShippingRate {
  id: string;
  zoneId: string;
  name: string;
  rate: number;
  minOrder: number | null;
  estimatedDays: string | null;
  isActive: boolean;
}

interface ShippingZone {
  id: string;
  name: string;
  countries: string[];
  isActive: boolean;
  createdAt: string;
  rates: ShippingRate[];
}

const COUNTRY_OPTIONS = [
  "US", "CA", "MX", "GB", "DE", "FR", "IT", "ES", "NL", "BE",
  "AU", "NZ", "JP", "KR", "BR", "AR", "CL", "IN", "SG", "MY",
  "AE", "SA", "ZA", "NO", "SE", "DK", "FI", "PL", "PT", "IE",
  "AT", "CH", "HK", "TW", "TH", "PH", "ID", "VN", "CO", "PE",
];

export function ShippingManager() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set());

  // Zone form
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const [zoneName, setZoneName] = useState("");
  const [zoneCountries, setZoneCountries] = useState<string[]>([]);
  const [zoneIsActive, setZoneIsActive] = useState(true);

  // Rate form
  const [showRateForm, setShowRateForm] = useState(false);
  const [rateZoneId, setRateZoneId] = useState("");
  const [editingRate, setEditingRate] = useState<ShippingRate | null>(null);
  const [rateName, setRateName] = useState("");
  const [rateAmount, setRateAmount] = useState("");
  const [rateMinOrder, setRateMinOrder] = useState("");
  const [rateEstimatedDays, setRateEstimatedDays] = useState("");
  const [rateIsActive, setRateIsActive] = useState(true);

  // Delete
  const [deleteZoneTarget, setDeleteZoneTarget] = useState<ShippingZone | null>(null);
  const [deleteRateTarget, setDeleteRateTarget] = useState<ShippingRate | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchZones = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/shipping/zones");
      const data = await res.json();
      setZones(data.zones ?? []);
    } catch {
      setError("Failed to load shipping zones");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  function toggleExpand(zoneId: string) {
    setExpandedZones((prev) => {
      const next = new Set(prev);
      if (next.has(zoneId)) next.delete(zoneId);
      else next.add(zoneId);
      return next;
    });
  }

  // --- Zone handlers ---
  function openNewZone() {
    setEditingZone(null);
    setZoneName("");
    setZoneCountries([]);
    setZoneIsActive(true);
    setShowZoneForm(true);
  }

  function openEditZone(zone: ShippingZone) {
    setEditingZone(zone);
    setZoneName(zone.name);
    setZoneCountries(zone.countries as string[]);
    setZoneIsActive(zone.isActive);
    setShowZoneForm(true);
  }

  function closeZoneForm() {
    setShowZoneForm(false);
    setEditingZone(null);
    setError("");
  }

  async function saveZone() {
    if (!zoneName.trim()) {
      setError("Zone name is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const method = editingZone ? "PUT" : "POST";
      const url = editingZone
        ? `/api/admin/shipping/zones/${editingZone.id}`
        : "/api/admin/shipping/zones";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: zoneName.trim(),
          countries: zoneCountries,
          isActive: zoneIsActive,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      closeZoneForm();
      fetchZones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteZone() {
    if (!deleteZoneTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/shipping/zones/${deleteZoneTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteZoneTarget(null);
      fetchZones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  // --- Rate handlers ---
  function openNewRate(zoneId: string) {
    setRateZoneId(zoneId);
    setEditingRate(null);
    setRateName("");
    setRateAmount("");
    setRateMinOrder("");
    setRateEstimatedDays("");
    setRateIsActive(true);
    setShowRateForm(true);
  }

  function openEditRate(rate: ShippingRate) {
    setRateZoneId(rate.zoneId);
    setEditingRate(rate);
    setRateName(rate.name);
    setRateAmount(String(rate.rate));
    setRateMinOrder(rate.minOrder != null ? String(rate.minOrder) : "");
    setRateEstimatedDays(rate.estimatedDays ?? "");
    setRateIsActive(rate.isActive);
    setShowRateForm(true);
  }

  function closeRateForm() {
    setShowRateForm(false);
    setEditingRate(null);
    setError("");
  }

  async function saveRate() {
    if (!rateName.trim()) {
      setError("Rate name is required");
      return;
    }
    const amt = parseFloat(rateAmount);
    if (isNaN(amt) || amt < 0) {
      setError("Valid rate amount is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const method = editingRate ? "PUT" : "POST";
      const url = editingRate
        ? `/api/admin/shipping/rates/${editingRate.id}`
        : `/api/admin/shipping/zones/${rateZoneId}/rates`;

      const body: Record<string, unknown> = {
        name: rateName.trim(),
        rate: amt,
        estimatedDays: rateEstimatedDays.trim() || null,
        isActive: rateIsActive,
      };

      if (rateMinOrder.trim()) {
        const min = parseFloat(rateMinOrder);
        if (!isNaN(min) && min >= 0) body.minOrder = min;
      } else {
        body.minOrder = null;
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
      closeRateForm();
      fetchZones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteRate() {
    if (!deleteRateTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/shipping/rates/${deleteRateTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setDeleteRateTarget(null);
      fetchZones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleZoneActive(zone: ShippingZone) {
    try {
      const res = await fetch(`/api/admin/shipping/zones/${zone.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !zone.isActive }),
      });
      if (!res.ok) throw new Error("Toggle failed");
      fetchZones();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Toggle failed");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-ds-gray-400">
          {zones.length} zone{zones.length !== 1 ? "s" : ""}
        </span>
        <Button onClick={openNewZone} size="sm">
          + Create Zone
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : zones.length === 0 ? (
          <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal py-20 text-center">
            <p className="text-sm text-ds-gray-500">No shipping zones yet.</p>
            <Button onClick={openNewZone} variant="outline" size="sm" className="mt-4">
              + Create Zone
            </Button>
          </div>
        ) : (
          zones.map((zone) => (
            <div
              key={zone.id}
              className="rounded-xl border border-white/[0.06] bg-ds-charcoal overflow-hidden"
            >
              {/* Zone header */}
              <div className="flex items-center gap-3 px-5 py-4">
                <button
                  onClick={() => toggleExpand(zone.id)}
                  className="text-ds-gray-400 hover:text-ds-white transition-colors"
                >
                  <svg
                    className={`h-4 w-4 transition-transform ${expandedZones.has(zone.id) ? "rotate-90" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-ds-white">{zone.name}</h3>
                  <p className="text-xs text-ds-gray-500">
                    {(zone.countries as string[]).join(", ") || "No countries"} — {zone.rates.length} rate{zone.rates.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button
                  onClick={() => toggleZoneActive(zone)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    zone.isActive ? "bg-ds-red" : "bg-ds-darkgray"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 rounded-full bg-white transition-transform duration-200 ${
                      zone.isActive ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </button>
                <button
                  onClick={() => openEditZone(zone)}
                  className="rounded px-2 py-1 text-xs text-ds-gray-400 hover:text-ds-white hover:bg-ds-white/[0.06]"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteZoneTarget(zone)}
                  className="rounded px-2 py-1 text-xs text-ds-gray-400 hover:text-ds-red hover:bg-ds-red/10"
                >
                  Delete
                </button>
              </div>

              {/* Expanded rates */}
              {expandedZones.has(zone.id) && (
                <div className="border-t border-white/[0.06] px-5 pb-4 pt-3">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-ds-gray-500">
                      Rates
                    </span>
                    <Button size="xs" onClick={() => openNewRate(zone.id)}>
                      + Add Rate
                    </Button>
                  </div>
                  {zone.rates.length === 0 ? (
                    <p className="py-3 text-center text-xs text-ds-gray-500">No rates defined</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/[0.06]">
                          <th className="py-2 text-left text-xs font-medium text-ds-gray-500">Name</th>
                          <th className="py-2 text-left text-xs font-medium text-ds-gray-500">Rate</th>
                          <th className="py-2 text-left text-xs font-medium text-ds-gray-500">Free Over</th>
                          <th className="py-2 text-left text-xs font-medium text-ds-gray-500">Est.</th>
                          <th className="py-2 text-center text-xs font-medium text-ds-gray-500">Active</th>
                          <th className="py-2 text-right text-xs font-medium text-ds-gray-500"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {zone.rates.map((rate) => (
                          <tr key={rate.id} className="border-b border-white/[0.03]">
                            <td className="py-2 text-ds-white">{rate.name}</td>
                            <td className="py-2 text-ds-white">${rate.rate.toFixed(2)}</td>
                            <td className="py-2 text-ds-gray-400">
                              {rate.minOrder ? `$${rate.minOrder.toFixed(2)}` : "—"}
                            </td>
                            <td className="py-2 text-ds-gray-400">{rate.estimatedDays || "—"}</td>
                            <td className="py-2 text-center">
                              <span
                                className={`inline-block h-2 w-2 rounded-full ${
                                  rate.isActive ? "bg-green-500" : "bg-ds-darkgray"
                                }`}
                              />
                            </td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => openEditRate(rate)}
                                className="rounded px-2 py-0.5 text-xs text-ds-gray-400 hover:text-ds-white"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => setDeleteRateTarget(rate)}
                                className="rounded px-2 py-0.5 text-xs text-ds-gray-400 hover:text-ds-red"
                              >
                                Del
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Zone create/edit modal */}
      <Modal
        isOpen={showZoneForm}
        onClose={closeZoneForm}
        title={editingZone ? "Edit Zone" : "Create Zone"}
        size="md"
        actions={
          <>
            <Button variant="ghost" onClick={closeZoneForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveZone} disabled={saving}>
              {saving ? "Saving..." : editingZone ? "Save Changes" : "Create Zone"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Zone Name"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
            placeholder="e.g., Domestic US"
          />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
              Countries
            </label>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-white/[0.08] bg-ds-black p-3">
              <div className="grid grid-cols-3 gap-2">
                {COUNTRY_OPTIONS.map((c) => (
                  <label key={c} className="flex items-center gap-2 text-sm text-ds-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={zoneCountries.includes(c)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setZoneCountries([...zoneCountries, c]);
                        } else {
                          setZoneCountries(zoneCountries.filter((x) => x !== c));
                        }
                      }}
                      className="rounded border-white/[0.15] bg-ds-black text-ds-red focus:ring-ds-red/30"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5">
            <input
              type="checkbox"
              checked={zoneIsActive}
              onChange={(e) => setZoneIsActive(e.target.checked)}
              className="rounded border-white/[0.15] bg-ds-black text-ds-red focus:ring-ds-red/30"
            />
            <span className="text-sm text-ds-white">Active</span>
          </label>
        </div>
      </Modal>

      {/* Rate create/edit modal */}
      <Modal
        isOpen={showRateForm}
        onClose={closeRateForm}
        title={editingRate ? "Edit Rate" : "Add Rate"}
        size="md"
        actions={
          <>
            <Button variant="ghost" onClick={closeRateForm} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveRate} disabled={saving}>
              {saving ? "Saving..." : editingRate ? "Save Changes" : "Add Rate"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Rate Name"
            value={rateName}
            onChange={(e) => setRateName(e.target.value)}
            placeholder="e.g., Standard Shipping"
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Rate ($)"
              type="number"
              min={0}
              step="0.01"
              value={rateAmount}
              onChange={(e) => setRateAmount(e.target.value)}
              placeholder="5.99"
            />
            <Input
              label="Free Shipping Min Order ($)"
              type="number"
              min={0}
              step="0.01"
              value={rateMinOrder}
              onChange={(e) => setRateMinOrder(e.target.value)}
              placeholder="Leave empty for none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Estimated Days"
              value={rateEstimatedDays}
              onChange={(e) => setRateEstimatedDays(e.target.value)}
              placeholder="e.g., 3-5 business days"
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                Status
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5">
                <input
                  type="checkbox"
                  checked={rateIsActive}
                  onChange={(e) => setRateIsActive(e.target.checked)}
                  className="rounded border-white/[0.15] bg-ds-black text-ds-red focus:ring-ds-red/30"
                />
                <span className="text-sm text-ds-white">Active</span>
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Delete zone confirmation */}
      <Modal
        isOpen={!!deleteZoneTarget}
        onClose={() => setDeleteZoneTarget(null)}
        title="Delete Zone"
        size="sm"
        actions={
          <>
            <Button variant="ghost" onClick={() => setDeleteZoneTarget(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteZone} disabled={saving}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ds-gray-300">
          Delete zone <span className="font-bold text-ds-white">&ldquo;{deleteZoneTarget?.name}&rdquo;</span> and all its rates?
        </p>
      </Modal>

      {/* Delete rate confirmation */}
      <Modal
        isOpen={!!deleteRateTarget}
        onClose={() => setDeleteRateTarget(null)}
        title="Delete Rate"
        size="sm"
        actions={
          <>
            <Button variant="ghost" onClick={() => setDeleteRateTarget(null)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDeleteRate} disabled={saving}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ds-gray-300">
          Delete rate <span className="font-bold text-ds-white">&ldquo;{deleteRateTarget?.name}&rdquo;</span>?
        </p>
      </Modal>
    </div>
  );
}
