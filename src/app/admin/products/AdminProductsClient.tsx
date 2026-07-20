"use client";

import { useState, useEffect, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  price: number;
  salePrice: number | null;
  inventory: number;
  isActive: boolean;
  isFeatured: boolean;
  variantCount: number;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [toggling, setToggling] = useState<string | null>(null);

  const fetchProducts = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products?page=${p}&limit=20`);
      const data = await res.json();
      setProducts(data.products ?? []);
      setPagination(data.pagination ?? null);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  async function toggleActive(productId: string, current: boolean) {
    setToggling(productId);
    try {
      const res = await fetch(`/api/admin/products/${productId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, isActive: !current } : p))
        );
      }
    } catch (err) {
      console.error("Failed to toggle product:", err);
    } finally {
      setToggling(null);
    }
  }

  return (
    <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-sm text-ds-gray-500">No products found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-ds-black/30">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Product
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Category
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Price
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Stock
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/[0.03] transition-colors hover:bg-ds-white/[0.02]"
                  >
                    <td className="px-5 py-3">
                      <p className="font-medium text-ds-white">{product.name}</p>
                      <p className="text-xs text-ds-gray-500">SKU: {product.sku}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-full border border-white/[0.08] bg-ds-black/30 px-2 py-0.5 text-xs text-ds-gray-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {product.salePrice ? (
                        <>
                          <span className="font-medium text-ds-red">
                            ${product.salePrice.toFixed(2)}
                          </span>
                          <span className="ml-1.5 text-xs text-ds-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-ds-gray-300">
                          ${product.price.toFixed(2)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          product.inventory === 0
                            ? "text-ds-red-400"
                            : product.inventory < 10
                              ? "text-yellow-400"
                              : "text-ds-gray-300"
                        }
                      >
                        {product.inventory}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleActive(product.id, product.isActive)}
                        disabled={toggling === product.id}
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                          product.isActive
                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                            : "border-gray-500/30 bg-gray-500/10 text-gray-500"
                        }`}
                      >
                        {toggling === product.id ? (
                          <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : product.isActive ? (
                          "Active"
                        ) : (
                          "Inactive"
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <a
                        href={`/products/${product.slug}`}
                        className="text-xs font-medium text-ds-red transition-colors hover:text-ds-red-400"
                      >
                        View
                      </a>
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
