import { ShippingManager } from "@/components/admin/ShippingManager";

export const dynamic = "force-dynamic";

export default function AdminShippingPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Shipping
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Manage shipping zones and rates
        </p>
      </div>
      <ShippingManager />
    </div>
  );
}
