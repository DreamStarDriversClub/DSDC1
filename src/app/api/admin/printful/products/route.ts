import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const products = await prisma.printfulProduct.findMany({ orderBy: { syncedAt: "desc" } });
  return NextResponse.json(products.map((p) => ({ id: p.id, name: p.name, thumbnailUrl: p.thumbnailUrl, variantCount: p.variantCount, syncedAt: p.syncedAt.toISOString() })));
}
