import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dream-star-drivers-club-jwt-secret-key-2026"
);

const protectedPaths = ["/account", "/admin"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only protect /account/*
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("dsdc_session")?.value;
  if (!sessionCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    await jwtVerify(sessionCookie, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/account/:path*"],
};
