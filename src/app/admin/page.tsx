import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [orderCount, customerCount, productCount] = await Promise.all([
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({ where: { isActive: true } }),
  ]);

  const revenueResult = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { not: "CANCELLED" } },
  });
  const totalRevenue = Number(revenueResult._sum.total ?? 0);

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { firstName: true, lastName: true, email: true } },
      items: { select: { quantity: true } },
    },
  });

  const stats = [
    {
      label: "Total Orders",
      value: orderCount.toLocaleString(),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
      bg: "bg-blue-500/10",
      text: "text-blue-400",
    },
    {
      label: "Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bg: "bg-green-500/10",
      text: "text-green-400",
    },
    {
      label: "Customers",
      value: customerCount.toLocaleString(),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
      bg: "bg-purple-500/10",
      text: "text-purple-400",
    },
    {
      label: "Products",
      value: productCount.toLocaleString(),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
      ),
      bg: "bg-orange-500/10",
      text: "text-orange-400",
    },
  ];

  const quickLinks = [
    { label: "View Orders", href: "/admin/orders", desc: "Manage and fulfill orders" },
    { label: "Manage Products", href: "/admin/products", desc: "Add, edit, or remove products" },
    { label: "Customers", href: "/admin/customers", desc: "View customer directory" },
    { label: "Instagram Grid", href: "/admin/instagram", desc: "Manage homepage feed" },
  ];

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      SHIPPED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      DELIVERED: "bg-green-500/10 text-green-400 border-green-500/30",
      CANCELLED: "bg-red-500/10 text-red-400 border-red-500/30",
    };
    return (
      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${map[status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/30"}`}>
        {status}
      </span>
    );
  };

  return (
    <div>
      {/* Page heading */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Overview of your store performance
        </p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-ds-gray-400">
                {stat.label}
              </span>
              <span className={`rounded-lg p-2 ${stat.bg} ${stat.text}`}>
                {stat.icon}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-ds-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick links + Recent orders grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick links */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-5">
          <h2 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
            Quick Links
          </h2>
          <div className="space-y-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-ds-white/[0.04]"
              >
                <div>
                  <p className="font-medium text-ds-white">{link.label}</p>
                  <p className="text-xs text-ds-gray-500">{link.desc}</p>
                </div>
                <svg className="h-4 w-4 shrink-0 text-ds-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-ds-white">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs font-medium text-ds-red hover:text-ds-red-400"
            >
              View all →
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-8 text-center text-sm text-ds-gray-500">
              No orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06] text-left">
                    <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Order
                    </th>
                    <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Customer
                    </th>
                    <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Items
                    </th>
                    <th className="pb-3 pr-4 text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Status
                    </th>
                    <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-white/[0.03] transition-colors hover:bg-ds-white/[0.02]"
                    >
                      <td className="py-3 pr-4 font-mono text-xs text-ds-gray-300">
                        {order.id.slice(-8)}
                      </td>
                      <td className="py-3 pr-4">
                        <p className="text-ds-white">
                          {order.user
                            ? `${order.user.firstName} ${order.user.lastName}`
                            : "Guest"}
                        </p>
                        <p className="text-xs text-ds-gray-500">
                          {order.user?.email ?? "—"}
                        </p>
                      </td>
                      <td className="py-3 pr-4 text-ds-gray-300">
                        {order.items.reduce((s, i) => s + i.quantity, 0)}
                      </td>
                      <td className="py-3 pr-4">{statusBadge(order.status)}</td>
                      <td className="py-3 text-right font-medium text-ds-white">
                        ${Number(order.total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
