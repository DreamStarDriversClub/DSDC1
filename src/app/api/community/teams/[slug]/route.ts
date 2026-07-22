import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── GET — team detail (public, approved only) ───────────── */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const team = await prisma.team.findUnique({
      where: { slug: params.slug, isApproved: true },
      include: {
        events: {
          where: { isApproved: true },
          orderBy: { eventDate: "asc" },
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            eventType: true,
            eventDate: true,
            location: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    return NextResponse.json({ team });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
