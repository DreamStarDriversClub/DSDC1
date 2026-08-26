"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

/**
 * Routes that render as a standalone, chrome-free page (no site nav / footer).
 * These are mobile-first "bio"-style destinations, e.g. the /links page used
 * in Instagram/TikTok/YouTube bios.
 */
const STANDALONE_ROUTES = new Set(["/links"]);

export default function SiteChrome({
  session,
  children,
}: {
  session: React.ComponentProps<typeof Navbar>["session"];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.has(pathname ?? "");

  if (isStandalone) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar session={session} />
      {/* Spacer for fixed navbar */}
      <div className="h-[73px]" />
      <main>{children}</main>
      <Footer />
    </>
  );
}
