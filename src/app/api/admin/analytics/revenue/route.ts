import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("dsdc_session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const session = await verifyToken(sessionCookie);
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const now = new Date();
    const months: { label: string; start: Date; end: Date }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endD = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);
      const label = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      months.push({ label, start: d, end: endD });
    }

    const results = await Promise.all(
      months.map(async (m) => {
        const agg = await prisma.order.aggregate({
          _sum: { total: true },
          where: {
            status: { not: "CANCELLED" },
            createdAt: { gte: m.start, lte: m.end },
          },
        });
        return {
          month: m.label,
          revenue: agg._sum.total ? Number(agg._sum.total) : 0,
        };
      })
    );

    return NextResponse.json({ revenue: results });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
