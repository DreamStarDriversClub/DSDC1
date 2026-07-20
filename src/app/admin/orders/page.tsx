import { AdminOrdersClient } from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export default function AdminOrdersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Orders
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Manage and fulfill customer orders
        </p>
      </div>
      <AdminOrdersClient />
    </div>
  );
}
