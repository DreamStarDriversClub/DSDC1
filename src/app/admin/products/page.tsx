import { AdminProductsClient } from "./AdminProductsClient";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Products
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Manage your product catalog
        </p>
      </div>
      <AdminProductsClient />
    </div>
  );
}
