"use client";

import { ProductForm } from "@/components/admin/ProductForm";

interface ProductData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  cost: number | null;
  inventory: number;
  weight: number | null;
  dimensions: string | null;
  images: string[];
  specifications: { key: string; value: string }[];
  compatibleVehicles: string[];
  isActive: boolean;
  isFeatured: boolean;
  categoryId: string;
  variants: { id?: string; name: string; sku: string; price: number; inventory: number }[];
}

interface EditProductClientProps {
  initialData: ProductData;
  productId: string;
}

export function EditProductClient({ initialData, productId }: EditProductClientProps) {
  return <ProductForm initialData={initialData} productId={productId} />;
}
