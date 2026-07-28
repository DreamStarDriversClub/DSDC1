import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── GET: Fetch approved submissions (paginated) ──────────── */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "12", 10), 50);

  const where = { approved: true };

  const submissions = await prisma.garageSubmission.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1, // fetch one extra to know if there's a next page
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  let nextCursor: string | null = null;
  if (submissions.length > limit) {
    const next = submissions.pop()!;
    nextCursor = next.id;
  }

  return NextResponse.json({ submissions, nextCursor });
}

/* ── POST: Submit a new garage photo ──────────────────────── */

export async function POST(request: Request) {
  let body: {
    imageUrl: string;
    carMake: string;
    carModel: string;
    ownerName: string;
    ownerInstagram?: string;
    caption?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Validate required fields
  if (!body.imageUrl || typeof body.imageUrl !== "string") {
    return NextResponse.json({ error: "imageUrl is required" }, { status: 400 });
  }
  if (!body.carMake || typeof body.carMake !== "string") {
    return NextResponse.json({ error: "carMake is required" }, { status: 400 });
  }
  if (!body.carModel || typeof body.carModel !== "string") {
    return NextResponse.json({ error: "carModel is required" }, { status: 400 });
  }
  if (!body.ownerName || typeof body.ownerName !== "string") {
    return NextResponse.json({ error: "ownerName is required" }, { status: 400 });
  }

  const submission = await prisma.garageSubmission.create({
    data: {
      imageUrl: body.imageUrl,
      carMake: body.carMake,
      carModel: body.carModel,
      ownerName: body.ownerName,
      ownerInstagram: body.ownerInstagram ?? null,
      caption: body.caption ?? null,
    },
  });

  return NextResponse.json({ submission }, { status: 201 });
}
