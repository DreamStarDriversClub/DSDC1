import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referrer } = body;

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "path is required" }, { status: 400 });
    }

    // Get or create session ID from cookie
    const cookieStore = await cookies();
    let sessionId = cookieStore.get("dsdc_track")?.value;

    if (!sessionId) {
      sessionId = crypto.randomUUID();

      const response = NextResponse.json({ recorded: true });
      response.cookies.set("dsdc_track", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/",
      });

      // Store the page view
      await prisma.pageView.create({
        data: {
          path: path.slice(0, 2048),
          referrer: referrer?.slice(0, 2048) ?? null,
          sessionId,
        },
      });

      return response;
    }

    // Store the page view with existing session
    await prisma.pageView.create({
      data: {
        path: path.slice(0, 2048),
        referrer: referrer?.slice(0, 2048) ?? null,
        sessionId,
      },
    });

    return NextResponse.json({ recorded: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record page view";
    console.error("PageView error:", message);
    return NextResponse.json({ error: "Failed to record page view" }, { status: 500 });
  }
}
