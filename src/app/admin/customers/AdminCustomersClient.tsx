"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  joined: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function AdminCustomersClient() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const fetchCustomers = useCallback(async (p: number, s: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: "20" });
      if (s) params.set("search", s);
      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      const data = await res.json();
      setCustomers(data.customers ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers(page, search);
  }, [page, fetchCustomers, search]);

  function handleSearch(value: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 300);
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ds-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or email..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full rounded-lg border border-white/[0.08] bg-ds-charcoal py-2 pl-10 pr-4 text-sm text-ds-white placeholder-ds-gray-500 focus:border-ds-red/40 focus:outline-none focus:ring-1 focus:ring-ds-red/40"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : customers.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm text-ds-gray-500">
              {search ? "No customers match your search." : "No customers found."}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-ds-black/30">
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Name
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Email
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Orders
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-white/[0.03] transition-colors hover:bg-ds-white/[0.02]"
                    >
                      <td className="px-5 py-3 font-medium text-ds-white">
                        {customer.name}
                      </td>
                      <td className="px-5 py-3 text-ds-gray-400">
                        {customer.email}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center rounded-full bg-ds-red/10 px-2 py-0.5 text-xs font-semibold text-ds-red">
                          {customer.orders}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ds-gray-400">
                        {new Date(customer.joined).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
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
    </div>
  );
}
