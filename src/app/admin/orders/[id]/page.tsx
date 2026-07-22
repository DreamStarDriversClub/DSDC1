import { AdminOrderDetailClient } from "./OrderDetailClient";

export const dynamic = "force-dynamic";

export default function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Order #{params.id.slice(-8).toUpperCase()}
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          View and manage order details
        </p>
      </div>
      <AdminOrderDetailClient orderId={params.id} />
    </div>
  );
}
