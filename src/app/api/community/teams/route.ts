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

/* ── GET — list approved teams (public) ──────────────────── */
export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        location: true,
        logoUrl: true,
        socialLinks: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ teams });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch teams";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── POST — register a team (auth required) ──────────────── */
export async function POST(request: Request) {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, description, goals, location, contactEmail, logoUrl, socialLinks } = body;

    if (!name || !description || !location || !contactEmail) {
      return NextResponse.json(
        { error: "name, description, location, and contactEmail are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(name);
    const existing = await prisma.team.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const team = await prisma.team.create({
      data: {
        name,
        slug,
        description,
        goals: goals ?? null,
        location,
        contactEmail,
        logoUrl: logoUrl ?? null,
        socialLinks: socialLinks ?? {},
      },
    });

    return NextResponse.json({ team }, { status: 201 });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to create team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
