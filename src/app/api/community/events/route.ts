import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const VALID_EVENT_TYPES = ["meet", "track_day", "cruise", "show", "dyno_day"];

/* ── GET — list approved upcoming events (public) ────────── */
export async function GET() {
  try {
    const events = await prisma.communityEvent.findMany({
      where: {
        isApproved: true,
        eventDate: { gte: new Date() },
      },
      orderBy: { eventDate: "asc" },
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

/* ── POST — submit an event (auth required) ──────────────── */
export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, eventType, eventDate, location, teamId } = body;

    if (!title || !description || !eventDate || !location) {
      return NextResponse.json(
        { error: "title, description, eventDate, and location are required" },
        { status: 400 }
      );
    }

    const type = eventType && VALID_EVENT_TYPES.includes(eventType) ? eventType : "meet";

    // Generate unique slug
    let slug = slugify(title);
    const existing = await prisma.communityEvent.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // If teamId is provided, verify it exists
    if (teamId) {
      const team = await prisma.team.findUnique({ where: { id: teamId } });
      if (!team) {
        return NextResponse.json(
          { error: "Team not found" },
          { status: 404 }
        );
      }
    }

    const event = await prisma.communityEvent.create({
      data: {
        title,
        slug,
        description,
        eventType: type,
        eventDate: new Date(eventDate),
        location,
        teamId: teamId ?? null,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create event";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
