import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Simple query to test DB connectivity
    const count = await prisma.instagramPost.count();
    return NextResponse.json({
      status: "ok",
      db: "connected",
      instagramPosts: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { status: "error", db: "disconnected", error: message },
      { status: 500 }
    );
  }
}
