import { AdminCustomersClient } from "./AdminCustomersClient";

export const dynamic = "force-dynamic";

export default function AdminCustomersPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Customers
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          View and manage your customer base
        </p>
      </div>
      <AdminCustomersClient />
    </div>
  );
}
