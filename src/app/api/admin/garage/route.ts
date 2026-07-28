import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dsdc_session")?.value;
  if (!sessionCookie) throw new Error("Unauthorized");
  const session = await verifyToken(sessionCookie);
  if (!session || session.role !== "ADMIN") throw new Error("Forbidden");
}

/* ── GET: List all submissions (for moderation) ───────────── */

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const submissions = await prisma.garageSubmission.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ submissions });
}

/* ── PATCH: Toggle approved status ────────────────────────── */

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { id: string; approved: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }
  if (typeof body.approved !== "boolean") {
    return NextResponse.json({ error: "approved must be a boolean" }, { status: 400 });
  }

  const submission = await prisma.garageSubmission.update({
    where: { id: body.id },
    data: { approved: body.approved },
  });

  return NextResponse.json({ submission });
}
