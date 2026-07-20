import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Order History",
  description: "View and track your past orders at Dream Star Drivers Club.",
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  SHIPPED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  DELIVERED: "bg-green-500/10 text-green-400 border-green-500/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default async function OrdersPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        select: { id: true, name: true },
      },
    },
  });

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl text-ds-white sm:text-3xl">
        Order History
      </h1>
      <p className="mb-8 text-ds-gray-300">
        Track and review your past orders.
      </p>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ds-black-darkgray">
            <svg
              className="h-8 w-8 text-ds-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
              />
            </svg>
          </div>
          <p className="text-ds-gray-400">No orders placed yet.</p>
          <Link
            href="/shop"
            className="mt-3 inline-block text-sm font-medium text-ds-red hover:text-ds-red-400 transition-colors"
          >
            Browse the Shop →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-5 transition-all hover:border-ds-red/20 hover:shadow-brand-glow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-ds-white">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="mt-1 text-xs text-ds-gray-400">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    {order.trackingNumber && (
                      <>
                        {" "}
                        · Tracking:{" "}
                        <span className="font-mono text-ds-gray-300">
                          {order.trackingNumber}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-ds-white">
                    ${Number(order.total).toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                      statusColors[order.status] || statusColors.PENDING
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>


              {/* Item preview */}
              <div className="mt-3 border-t border-white/[0.06] pt-3">
                <p className="text-xs text-ds-gray-400">
                  {order.items.slice(0, 3).map((i) => i.name).join(", ")}
                  {order.items.length > 3 && ` +${order.items.length - 3} more`}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export const dynamic = "force-dynamic";
