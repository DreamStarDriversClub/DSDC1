import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const checks: Record<string, "ok" | "degraded" | "down"> = {
    uptime: "ok",
    database: "ok",
    products: "ok",
  };

  // Database check: run SELECT 1
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    checks.database = "down";
  }

  // Products check: count active products
  try {
    const count = await prisma.product.count({ where: { isActive: true } });
    checks.products = count > 0 ? "ok" : "degraded";
  } catch {
    checks.products = "degraded";
  }

  // Compute overall status
  const values = Object.values(checks);
  let status: "ok" | "degraded" | "down" = "ok";
  if (values.includes("down")) {
    status = "down";
  } else if (values.includes("degraded")) {
    status = "degraded";
  }

  return NextResponse.json(
    {
      status,
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: status === "down" ? 503 : 200 }
  );
}
