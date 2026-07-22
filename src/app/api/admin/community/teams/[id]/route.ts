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

/* ── PATCH — approve/reject team ─────────────────────────── */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { isApproved } = body;

    if (typeof isApproved !== "boolean") {
      return NextResponse.json(
        { error: "isApproved (boolean) is required" },
        { status: 400 }
      );
    }

    const team = await prisma.team.update({
      where: { id: params.id },
      data: { isApproved },
    });

    return NextResponse.json({ team });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to update team";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
