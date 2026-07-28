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

    // Today's start (midnight)
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // Week start (Monday of current week)
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Sunday = 0 -> -6, Monday = 1 -> 0
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset);

    const [todayViews, weekViews, totalViews, uniqueSessions, topPages, dailyViews] =
      await Promise.all([
        // Today's views
        prisma.pageView.count({
          where: { createdAt: { gte: todayStart } },
        }),
        // This week's views
        prisma.pageView.count({
          where: { createdAt: { gte: weekStart } },
        }),
        // All-time views
        prisma.pageView.count(),
        // Unique sessions
        prisma.pageView.groupBy({
          by: ["sessionId"],
          _count: true,
        }).then((groups) => groups.length),
        // Top 10 pages
        prisma.pageView.groupBy({
          by: ["path"],
          _count: { id: true },
          orderBy: { _count: { id: "desc" } },
          take: 10,
        }),
        // Last 30 days daily views
        (async () => {
          const days: { date: string; count: number }[] = [];
          for (let i = 29; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
            const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
            const dayEnd = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
            const count = await prisma.pageView.count({
              where: {
                createdAt: { gte: dayStart, lt: dayEnd },
              },
            });
            days.push({
              date: d.toISOString().slice(0, 10),
              count,
            });
          }
          return days;
        })(),
      ]);

    return NextResponse.json({
      todayViews,
      weekViews,
      totalViews,
      uniqueSessions,
      topPages: topPages.map((p) => ({
        path: p.path,
        views: p._count.id,
        percentage: totalViews > 0 ? ((p._count.id / totalViews) * 100).toFixed(1) : "0.0",
      })),
      dailyViews,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
