"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { useCart } from "@/lib/cart-context";
import { logoutAction } from "@/lib/auth-actions";
import { CartDrawer } from "./CartDrawer";
import { MobileNav } from "./MobileNav";
import { SearchModal } from "./SearchModal";

type SessionUser = {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
} | null;

export function Navbar({ session }: { session: SessionUser }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { itemCount: cartCount } = useCart();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShopDropdownOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const shopLink = NAV_LINKS[0]; // Shop with children

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-70 transition-all duration-400 ${
          scrolled
            ? "glass py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* ── Left: Logo ──────────────────────────────── */}
          <Link
            href="/"
            className="group flex items-center gap-2 text-ds-white"
          >
            <img
              src="/logo%20-%20white.png"
              alt="Dream Star Drivers Club"
              className="h-11 w-auto object-contain"
              loading="eager"
            />
            <span className="hidden font-display text-base font-bold tracking-[0.15em] sm:inline">
              DREAM STAR
            </span>
          </Link>

          {/* ── Center: Desktop nav ─────────────────────── */}
          <nav className="hidden items-center gap-1 md:flex">
            {/* Shop dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-base font-medium text-ds-gray-300 transition-colors hover:text-ds-white"
              >
                {shopLink.label}
                <svg
                  className={`h-3.5 w-3.5 text-ds-gray-500 transition-transform ${
                    shopDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown */}
              {shopDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 animate-fade-in overflow-hidden rounded-xl border border-white/[0.08] bg-ds-black-charcoal shadow-2xl">
                  {shopLink.children?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setShopDropdownOpen(false)}
                      className="flex flex-col px-4 py-3.5 transition-colors hover:bg-ds-white/5"
                    >
                      <span className="text-sm font-medium text-ds-white">
                        {child.label}
                      </span>
                      <span className="text-xs text-ds-gray-500">
                        {child.description}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Other links */}
            {NAV_LINKS.slice(1).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-lg px-4 py-2.5 text-base font-medium text-ds-gray-300 transition-colors hover:text-ds-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Right: Icons ────────────────────────────── */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-lg p-2 text-ds-gray-400 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
              aria-label="Search (⌘K)"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                />
              </svg>
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative rounded-lg p-2 text-ds-gray-400 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
              aria-label="Open cart"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-ds-red px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg p-2 text-ds-gray-400 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
                  aria-label="User menu"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-ds-red/20 text-xs font-bold text-ds-red">
                    {session.firstName[0]}
                    {session.lastName[0]}
                  </div>
                </button>

                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-48 animate-fade-in overflow-hidden rounded-xl border border-white/[0.08] bg-ds-black-charcoal shadow-2xl z-50">
                      <div className="border-b border-white/[0.06] px-4 py-3">
                        <p className="text-sm font-medium text-ds-white truncate">
                          {session.firstName} {session.lastName}
                        </p>
                        <p className="text-xs text-ds-gray-500 truncate">
                          {session.email}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ds-gray-300 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                          </svg>
                          Dashboard
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ds-gray-300 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                          </svg>
                          Orders
                        </Link>
                        <Link
                          href="/account/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ds-gray-300 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                          </svg>
                          Wishlist
                        </Link>
                        <Link
                          href="/account/settings"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-ds-gray-300 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </Link>
                      </div>
                      <div className="border-t border-white/[0.06] py-1">
                        <form action={logoutAction}>
                          <button
                            type="submit"
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-ds-gray-500 transition-colors hover:bg-ds-red/10 hover:text-ds-red"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            Sign Out
                          </button>
                        </form>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ds-gray-300 transition-colors hover:bg-ds-white/5 hover:text-ds-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-ds-gray-400 transition-colors hover:bg-ds-white/5 hover:text-ds-white md:hidden"
              aria-label="Open menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Modals / Drawers */}
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
