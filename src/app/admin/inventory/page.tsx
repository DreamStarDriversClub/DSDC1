import { InventoryClient } from "./InventoryClient";

export const dynamic = "force-dynamic";

export default function AdminInventoryPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Inventory
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Monitor stock levels and manage inventory
        </p>
      </div>
      <InventoryClient />
    </div>
  );
}
