import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── POST: Toggle like on a submission ────────────────────── */

export async function POST(request: Request) {
  let body: { submissionId: string; sessionId: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.submissionId || typeof body.submissionId !== "string") {
    return NextResponse.json({ error: "submissionId is required" }, { status: 400 });
  }
  if (!body.sessionId || typeof body.sessionId !== "string") {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 });
  }

  const { submissionId, sessionId } = body;

  // Check if like already exists
  const existing = await prisma.garageLike.findUnique({
    where: {
      submissionId_sessionId: { submissionId, sessionId },
    },
  });

  if (existing) {
    // Unlike: delete the like and decrement counter
    await prisma.$transaction([
      prisma.garageLike.delete({
        where: { submissionId_sessionId: { submissionId, sessionId } },
      }),
      prisma.garageSubmission.update({
        where: { id: submissionId },
        data: { likes: { decrement: 1 } },
      }),
    ]);

    const updated = await prisma.garageSubmission.findUnique({
      where: { id: submissionId },
    });

    return NextResponse.json({ liked: false, likes: updated?.likes ?? 0 });
  } else {
    // Like: create like and increment counter
    await prisma.$transaction([
      prisma.garageLike.create({
        data: { submissionId, sessionId },
      }),
      prisma.garageSubmission.update({
        where: { id: submissionId },
        data: { likes: { increment: 1 } },
      }),
    ]);

    const updated = await prisma.garageSubmission.findUnique({
      where: { id: submissionId },
    });

    return NextResponse.json({ liked: true, likes: updated?.likes ?? 0 });
  }
}
