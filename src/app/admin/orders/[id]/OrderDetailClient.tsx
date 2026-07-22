"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Address {
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface OrderItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  productId: string | null;
  variantId: string | null;
}

interface Order {
  id: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number | null;
  total: number;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: string;
  customer: Customer | null;
  shippingAddress: Address | null;
  items: OrderItem[];
}

const VALID_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

const statusBadgeClasses: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  SHIPPED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-green-500/10 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
};

export function AdminOrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Status change
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");

  // Tracking / Notes
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [showTrackingForm, setShowTrackingForm] = useState(false);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Order not found");
      }
      const data = await res.json();
      setOrder(data.order);
      setTrackingNumber(data.order.trackingNumber ?? "");
      setNotes(data.order.notes ?? "");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  function initiateStatusChange(status: string) {
    setPendingStatus(status);
    setShowStatusConfirm(true);
  }

  async function confirmStatusChange() {
    if (!pendingStatus) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: pendingStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Status update failed");
      }

      setShowStatusConfirm(false);
      fetchOrder();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Status update failed");
    } finally {
      setSaving(false);
    }
  }

  async function saveTracking() {
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingNumber: trackingNumber || null, notes: notes || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Update failed");
      }

      setShowTrackingForm(false);
      fetchOrder();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal py-20 text-center">
        <p className="text-sm text-ds-gray-500">{error || "Order not found."}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => (window.location.href = "/admin/orders")}
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}

      {/* Header: status + actions */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs text-ds-gray-500">
            Ordered on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span
              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${statusBadgeClasses[order.status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}
            >
              {order.status}
            </span>
            {/* Status dropdown */}
            <select
              value=""
              onChange={(e) => {
                if (e.target.value) initiateStatusChange(e.target.value);
              }}
              className="rounded-lg border border-white/[0.08] bg-ds-black px-3 py-1.5 text-xs text-ds-gray-300 transition-colors focus:border-ds-red/50 focus:outline-none"
            >
              <option value="">Change status...</option>
              {VALID_STATUSES.map((s) => (
                <option key={s} value={s} disabled={s === order.status}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = "/admin/orders")}
        >
          ← Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Line Items */}
          <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-ds-white">
                Line Items ({order.items.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-ds-black/30">
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Product
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      SKU
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Qty
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Price
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-white/[0.03]"
                    >
                      <td className="px-5 py-3">
                        <p className="text-ds-white">{item.name}</p>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-ds-gray-500">
                        {item.sku}
                      </td>
                      <td className="px-5 py-3 text-center text-ds-white">
                        {item.quantity}
                      </td>
                      <td className="px-5 py-3 text-right text-ds-gray-300">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-ds-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tracking & Notes */}
          <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-ds-white">
                Tracking &amp; Notes
              </h2>
              {!showTrackingForm && (
                <Button size="sm" variant="ghost" onClick={() => setShowTrackingForm(true)}>
                  {order.trackingNumber || order.notes ? "Edit" : "Add"}
                </Button>
              )}
            </div>
            {showTrackingForm ? (
              <div className="space-y-4 p-5">
                <Input
                  label="Tracking Number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g., 1Z999AA10123456784"
                />
                <div className="w-full">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                    Notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Internal order notes..."
                    className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={saveTracking} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowTrackingForm(false);
                      setTrackingNumber(order.trackingNumber ?? "");
                      setNotes(order.notes ?? "");
                    }}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Tracking
                  </p>
                  <p className="mt-1 text-sm text-ds-white">
                    {order.trackingNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Notes
                  </p>
                  <p className="mt-1 text-sm text-ds-gray-300">
                    {order.notes || "—"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column: summary + customer */}
        <div className="space-y-6">
          {/* Order Totals */}
          <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-ds-white">Order Summary</h2>
            </div>
            <div className="space-y-2 p-5">
              <div className="flex justify-between text-sm">
                <span className="text-ds-gray-400">Subtotal</span>
                <span className="text-ds-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ds-gray-400">Shipping</span>
                <span className="text-ds-white">${order.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ds-gray-400">Tax</span>
                <span className="text-ds-white">${order.tax.toFixed(2)}</span>
              </div>
              {order.discount != null && order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-ds-gray-400">Discount</span>
                  <span className="text-ds-red">-${order.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-white/[0.06] pt-2">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-ds-white">Total</span>
                  <span className="text-ds-white">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
            <div className="border-b border-white/[0.06] px-5 py-4">
              <h2 className="text-sm font-semibold text-ds-white">Customer</h2>
            </div>
            <div className="p-5 space-y-3">
              {order.customer ? (
                <>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Name
                    </p>
                    <p className="mt-1 text-sm text-ds-white">{order.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-ds-gray-300">{order.customer.email}</p>
                  </div>
                </>
              ) : (
                <p className="text-sm text-ds-gray-500">Guest checkout</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
              <div className="border-b border-white/[0.06] px-5 py-4">
                <h2 className="text-sm font-semibold text-ds-white">Shipping Address</h2>
              </div>
              <div className="p-5">
                <p className="text-sm text-ds-white">{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p className="text-sm text-ds-gray-300">{order.shippingAddress.line2}</p>
                )}
                <p className="text-sm text-ds-gray-300">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zip}
                </p>
                <p className="text-sm text-ds-gray-400">{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Order ID */}
          <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
            <div className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                Order ID
              </p>
              <p className="mt-1 font-mono text-xs text-ds-gray-400 break-all">
                {order.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Confirmation Modal */}
      {showStatusConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-ds-black/80" onClick={() => setShowStatusConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-xl border border-white/[0.08] bg-ds-charcoal p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-ds-white">Change Status</h3>
            <p className="mt-2 text-sm text-ds-gray-300">
              Change order status from{" "}
              <span className="font-semibold text-ds-white">{order.status}</span> to{" "}
              <span className="font-semibold text-ds-white">{pendingStatus}</span>?
            </p>
            {pendingStatus === "CANCELLED" && (
              <p className="mt-2 text-xs text-ds-red-400">
                This cannot be undone. The customer will be notified.
              </p>
            )}
            <div className="mt-6 flex items-center justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowStatusConfirm(false)} disabled={saving}>
                Cancel
              </Button>
              <Button
                variant={pendingStatus === "CANCELLED" ? "danger" : "primary"}
                onClick={confirmStatusChange}
                disabled={saving}
              >
                {saving ? "Updating..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
