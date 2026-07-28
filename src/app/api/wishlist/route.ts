import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── GET /api/wishlist?sessionId=xxx ─────────────────────── */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required." },
        { status: 400 }
      );
    }

    const items = await prisma.wishlistItem.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("GET /api/wishlist error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch wishlist." },
      { status: 500 }
    );
  }
}

/* ── POST /api/wishlist ──────────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    let body: {
      sessionId: string;
      productId: string;
      productName: string;
      productImage?: string | null;
      productPrice: number;
      productCategory: string;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const {
      sessionId,
      productId,
      productName,
      productImage,
      productPrice,
      productCategory,
    } = body;

    if (!sessionId || !productId || !productName || productPrice == null || !productCategory) {
      return NextResponse.json(
        {
          success: false,
          error:
            "sessionId, productId, productName, productPrice, and productCategory are required.",
        },
        { status: 400 }
      );
    }

    // Upsert: if the combination already exists, just return it
    const item = await prisma.wishlistItem.upsert({
      where: {
        sessionId_productId: {
          sessionId,
          productId,
        },
      },
      update: {}, // no-op if exists
      create: {
        sessionId,
        productId,
        productName,
        productImage: productImage ?? null,
        productPrice,
        productCategory,
      },
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    console.error("POST /api/wishlist error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add item to wishlist." },
      { status: 500 }
    );
  }
}

/* ── DELETE /api/wishlist?sessionId=xxx&productId=yyy ────── */

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const productId = searchParams.get("productId");

    if (!sessionId || !productId) {
      return NextResponse.json(
        { success: false, error: "sessionId and productId are required." },
        { status: 400 }
      );
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        sessionId,
        productId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/wishlist error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove item from wishlist." },
      { status: 500 }
    );
  }
}
