import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Auth check
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
    const body = await request.json();
    const product = await prisma.product.update({
      where: { id: params.id },
      data: { isActive: body.isActive },
      select: { id: true, isActive: true },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Product not found" },
      { status: 404 }
    );
  }
}
