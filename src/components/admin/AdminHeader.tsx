"use client";

import { useRouter } from "next/navigation";

interface AdminHeaderProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.06] bg-ds-charcoal px-4 sm:px-6 lg:px-8">
      {/* Left: page title area (spacer on mobile to account for hamburger) */}
      <div className="flex items-center gap-3 pl-10 lg:pl-0">
        <span className="text-xs font-medium text-ds-gray-400">Admin</span>
        <svg className="h-3 w-3 text-ds-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-xs font-semibold text-ds-white">
          {user.firstName} {user.lastName}
        </span>
      </div>

      {/* Right: user info + logout */}
      <div className="flex items-center gap-4">
        <span className="hidden text-xs text-ds-gray-500 sm:inline">
          {user.email}
        </span>
        <button
          onClick={handleLogout}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-ds-gray-400 transition-colors hover:bg-ds-red/10 hover:text-ds-red-400"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
