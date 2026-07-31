import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { syncPrintfulProducts } from "@/lib/printful";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await syncPrintfulProducts();
    return NextResponse.json({ success: true, ...result, message: `Synced ${result.productCount} products and ${result.variantCount} variants.` });
  } catch (error) {
    console.error("Printful sync failed", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Printful sync failed" }, { status: 500 });
  }
}
