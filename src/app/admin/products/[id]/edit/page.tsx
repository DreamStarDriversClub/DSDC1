import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditProductClient } from "./EditProductClient";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      category: { select: { name: true } },
      variants: true,
    },
  });

  if (!product) notFound();

  const data = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    price: Number(product.price),
    salePrice: product.salePrice ? Number(product.salePrice) : null,
    cost: product.cost ? Number(product.cost) : null,
    inventory: product.inventory,
    weight: product.weight ? Number(product.weight) : null,
    dimensions: product.dimensions as string | null,
    images: product.images as string[],
    specifications: product.specifications as { key: string; value: string }[],
    compatibleVehicles: product.compatibleVehicles as string[],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    categoryId: product.categoryId,
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: Number(v.price),
      inventory: v.inventory,
    })),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Edit Product
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Editing: {data.name}
        </p>
      </div>
      <EditProductClient initialData={data} productId={data.id} />
    </div>
  );
}
