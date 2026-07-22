"use client";

import { useState, useEffect, useCallback } from "react";

interface RevenueMonth {
  month: string;
  revenue: number;
}

interface TopProduct {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  orders: number;
}

interface OrderStatus {
  status: string;
  count: number;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [revenue, setRevenue] = useState<RevenueMonth[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, revRes, prodRes, statusRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/analytics/revenue"),
        fetch("/api/admin/analytics/top-products"),
        fetch("/api/admin/analytics/order-status"),
      ]);

      const statsData = await statsRes.json();
      const revData = await revRes.json();
      const prodData = await prodRes.json();
      const statusData = await statusRes.json();

      setStats(statsData);
      setRevenue(revData.revenue ?? []);
      setTopProducts(prodData.products ?? []);
      setOrderStatuses(statusData.statuses ?? []);
    } catch {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const maxRevenue = Math.max(...revenue.map((r) => r.revenue), 1);
  const totalStatusCount = orderStatuses.reduce((sum, s) => sum + s.count, 0) || 1;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500",
    CONFIRMED: "bg-blue-500",
    SHIPPED: "bg-purple-500",
    DELIVERED: "bg-green-500",
    CANCELLED: "bg-ds-darkgray",
  };

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

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Revenue" value={`$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
          <StatCard label="Orders" value={String(stats.totalOrders)} />
          <StatCard label="Avg Order Value" value={
            stats.totalOrders > 0
              ? `$${(stats.totalRevenue / stats.totalOrders).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : "$0.00"
          } />
          <StatCard label="Customers" value={String(stats.totalCustomers)} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Revenue Bar Chart */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ds-gray-300">
            Revenue (Last 6 Months)
          </h3>
          <div className="flex items-end gap-2 h-48">
            {revenue.map((r) => (
              <div key={r.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] text-ds-gray-400 font-mono">
                  ${r.revenue > 0 ? (r.revenue / 1000).toFixed(1) + "k" : "0"}
                </span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className="w-full rounded-t bg-ds-red/80 hover:bg-ds-red transition-colors min-h-[4px]"
                    style={{ height: `${(r.revenue / maxRevenue) * 100}%` }}
                    title={`${r.month}: $${r.revenue.toFixed(2)}`}
                  />
                </div>
                <span className="text-[10px] text-ds-gray-500 mt-1">{r.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-ds-gray-300">
            Order Status
          </h3>
          {/* Stacked horizontal bar */}
          <div className="mb-4 h-8 w-full rounded-full overflow-hidden flex bg-ds-black">
            {orderStatuses.map((s) => (
              <div
                key={s.status}
                className={`h-full ${statusColors[s.status] || "bg-ds-darkgray"} transition-all`}
                style={{ width: `${(s.count / totalStatusCount) * 100}%` }}
                title={`${s.status}: ${s.count}`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            {orderStatuses.map((s) => (
              <div key={s.status} className="flex items-center gap-2 text-xs">
                <span className={`h-2.5 w-2.5 rounded-full ${statusColors[s.status] || "bg-ds-darkgray"}`} />
                <span className="text-ds-gray-400">{s.status}</span>
                <span className="font-semibold text-ds-white">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-ds-gray-300">
            Top 10 Products by Units Sold
          </h3>
        </div>
        {topProducts.length === 0 ? (
          <div className="py-12 text-center text-sm text-ds-gray-500">No order data yet</div>
        ) : (
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
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Units Sold
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Orders
                  </th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr
                    key={p.productId ?? `p-${i}`}
                    className="border-b border-white/[0.03] hover:bg-ds-white/[0.02]"
                  >
                    <td className="px-5 py-3 text-ds-white">{p.name}</td>
                    <td className="px-5 py-3 font-mono text-xs text-ds-gray-400">{p.sku}</td>
                    <td className="px-5 py-3 text-right font-semibold text-ds-white">{p.quantity}</td>
                    <td className="px-5 py-3 text-right text-ds-gray-400">{p.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-ds-gray-500">{label}</p>
      <p className="mt-2 font-display text-2xl font-bold text-ds-white">{value}</p>
    </div>
  );
}
