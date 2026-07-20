"use client";

import { useState, useEffect, useCallback } from "react";

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const statusBadgeClasses: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  SHIPPED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  DELIVERED: "bg-green-500/10 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
};

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchOrders = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?page=${p}&limit=20`);
      const data = await res.json();
      setOrders(data.orders ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  return (
    <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-ds-gray-500">No orders found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-ds-black/30">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Order ID
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Customer
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Items
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-white/[0.03] transition-colors hover:bg-ds-white/[0.02]"
                  >
                    <td className="px-5 py-3 font-mono text-xs text-ds-gray-300">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-ds-white">{order.customerName}</p>
                      <p className="text-xs text-ds-gray-500">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3 text-ds-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3 text-ds-gray-300">{order.itemCount}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusBadgeClasses[order.status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-ds-white">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/[0.06] px-5 py-3">
              <p className="text-xs text-ds-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-ds-gray-400 transition-colors hover:bg-ds-white/[0.06] hover:text-ds-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-2 text-xs text-ds-gray-400">
                  {pagination.page} / {pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-ds-gray-400 transition-colors hover:bg-ds-white/[0.06] hover:text-ds-white disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
