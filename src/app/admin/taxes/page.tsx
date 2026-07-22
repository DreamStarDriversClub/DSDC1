import { TaxManager } from "@/components/admin/TaxManager";

export const dynamic = "force-dynamic";

export default function AdminTaxesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Taxes
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Configure tax rates by country and state
        </p>
      </div>
      <TaxManager />
    </div>
  );
}
