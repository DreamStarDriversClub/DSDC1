import { notFound } from "next/navigation";
import Link from "next/link";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `Order #${params.id.slice(-8).toUpperCase()}`,
    description: "Order details for your Dream Star Drivers Club purchase.",
    robots: { index: false, follow: false },
  };
}

const statusSteps: { status: string; label: string }[] = [
  { status: "PENDING", label: "Order Placed" },
  { status: "CONFIRMED", label: "Confirmed" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];

const statusColorMap: Record<string, string> = {
  PENDING: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  CONFIRMED: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  SHIPPED: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  DELIVERED: "text-green-400 bg-green-500/10 border-green-500/20",
  CANCELLED: "text-red-400 bg-red-500/10 border-red-500/20",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: { slug: true, images: true },
          },
        },
      },
      shippingAddress: true,
      billingAddress: true,
    },
  });

  if (!order) {
    notFound();
  }

  const statusIndex = statusSteps.findIndex((s) => s.status === order.status);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/account/orders"
            className="mb-2 inline-flex items-center gap-1 text-sm text-ds-gray-500 hover:text-ds-white transition-colors"
          >
            ← Back to Orders
          </Link>
          <h1 className="font-display text-2xl text-ds-white sm:text-3xl">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="mt-1 text-sm text-ds-gray-400">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-sm font-medium ${
            statusColorMap[order.status] || statusColorMap.PENDING
          }`}
        >
          {order.status}
        </span>
      </div>

      {/* Status Timeline */}
      {!isCancelled && (
        <div className="mb-10 rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6">
          <h2 className="mb-6 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
            Order Status
          </h2>
          <div className="flex items-start justify-between">
            {statusSteps.map((step, i) => {
              const isComplete = i <= statusIndex;
              const isCurrent = i === statusIndex;
              return (
                <div
                  key={step.status}
                  className="flex flex-1 flex-col items-center text-center"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all ${
                      isComplete
                        ? "border-ds-red bg-ds-red text-white"
                        : "border-white/10 bg-ds-black-darkgray text-ds-gray-500"
                    } ${isCurrent ? "ring-4 ring-ds-red/20" : ""}`}
                  >
                    {isComplete ? "✓" : i + 1}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isComplete ? "text-ds-white" : "text-ds-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Connector lines */}
          <div className="relative mt-[-32px] h-px">
            <div className="absolute left-[calc(12.5%+20px)] right-[calc(12.5%+20px)] top-0 h-px bg-white/[0.06]">
              <div
                className="h-full bg-ds-red transition-all duration-500"
                style={{
                  width: `${Math.max(0, (statusIndex / (statusSteps.length - 1)) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
            Items ({order.items.length})
          </h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-ds-black-charcoal p-4"
              >
                {/* Product image */}
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ds-black-darkgray">
                  {item.product?.images &&
                  Array.isArray(item.product.images) &&
                  typeof item.product.images[0] === "string" ? (
                    <img
                      src={item.product.images[0]}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-ds-gray-600 text-xs">
                      DS
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ds-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-ds-gray-500">
                    SKU: {item.sku} · Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-ds-white">
                    ${Number(item.price).toFixed(2)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-ds-gray-500">
                      ${Number(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Addresses */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-5">
            <h2 className="mb-4 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
              Order Summary
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ds-gray-500">Subtotal</span>
                <span className="text-ds-white">
                  ${Number(order.subtotal).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ds-gray-500">Shipping</span>
                <span className="text-ds-white">
                  {Number(order.shipping) === 0
                    ? "Free"
                    : `$${Number(order.shipping).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ds-gray-500">Tax</span>
                <span className="text-ds-white">
                  ${Number(order.tax).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-white/[0.06] pt-2 flex justify-between">
                <span className="font-semibold text-ds-white">Total</span>
                <span className="font-bold text-ds-red text-base">
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Tracking */}
          {order.trackingNumber && (
            <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-5">
              <h2 className="mb-2 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
                Tracking
              </h2>
              <p className="mb-3 font-mono text-sm text-ds-white">
                {order.trackingNumber}
              </p>
              <Button variant="outline" size="sm" className="w-full" disabled>
                Track Package (Coming Soon)
              </Button>
            </div>
          )}

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-5">
              <h2 className="mb-2 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
                Shipping Address
              </h2>
              <div className="text-sm text-ds-gray-400 space-y-0.5">
                <p className="text-ds-white font-medium">
                  {order.shippingAddress.line1}
                </p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Billing Address */}
          {order.billingAddress && (
            <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-5">
              <h2 className="mb-2 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
                Billing Address
              </h2>
              <div className="text-sm text-ds-gray-400 space-y-0.5">
                <p className="text-ds-white font-medium">
                  {order.billingAddress.line1}
                </p>
                {order.billingAddress.line2 && (
                  <p>{order.billingAddress.line2}</p>
                )}
                <p>
                  {order.billingAddress.city}, {order.billingAddress.state}{" "}
                  {order.billingAddress.zip}
                </p>
              </div>
            </div>
          )}

          {/* Reorder */}
          {order.status === "DELIVERED" && (
            <Button variant="outline" size="md" className="w-full" disabled>
              Reorder
            </Button>
          )}


          {order.notes && (
            <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-5">
              <h2 className="mb-2 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
                Notes
              </h2>
              <p className="text-sm text-ds-gray-400">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
