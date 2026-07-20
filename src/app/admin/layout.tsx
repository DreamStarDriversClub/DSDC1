import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/auth/login?redirect=/admin");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-ds-black">
      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <AdminSidebar />
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-y-auto bg-ds-black p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
