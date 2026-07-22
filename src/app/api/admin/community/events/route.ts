import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dsdc_session")?.value;
  if (!sessionCookie) return null;
  const session = await verifyToken(sessionCookie);
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

/* ── GET — list events (?status=pending|approved) ────────── */
export async function GET(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let where: Record<string, unknown> = {};
    if (status === "pending") {
      where.isApproved = false;
    } else if (status === "approved") {
      where.isApproved = true;
    }

    const events = await prisma.communityEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        team: {
          select: { name: true, slug: true },
        },
      },
    });

    return NextResponse.json({ events });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch events";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
