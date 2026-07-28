import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── GET: fetch wishlist items by sessionId ────────────── */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "sessionId is required" },
        { status: 400 }
      );
    }

    const items = await prisma.wishlistItem.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── POST: add an item to the wishlist ─────────────────── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      productId,
      productName,
      productImage,
      productPrice,
      productCategory,
    } = body;

    if (
      !sessionId ||
      !productId ||
      !productName ||
      productPrice === undefined ||
      !productCategory
    ) {
      return NextResponse.json(
        {
          error:
            "sessionId, productId, productName, productPrice, and productCategory are required",
        },
        { status: 400 }
      );
    }

    // Check if already in wishlist
    const existing = await prisma.wishlistItem.findFirst({
      where: { sessionId, productId },
    });

    if (existing) {
      return NextResponse.json({ item: existing }, { status: 200 });
    }

    const item = await prisma.wishlistItem.create({
      data: {
        sessionId,
        productId,
        productName,
        productImage: productImage || "",
        productPrice,
        productCategory,
      },
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/* ── DELETE: remove an item from the wishlist ──────────── */

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const productId = searchParams.get("productId");

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: "sessionId and productId are required" },
        { status: 400 }
      );
    }

    await prisma.wishlistItem.deleteMany({
      where: { sessionId, productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
