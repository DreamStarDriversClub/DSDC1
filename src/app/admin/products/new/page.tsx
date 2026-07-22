import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          New Product
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Add a new product to your catalog
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
