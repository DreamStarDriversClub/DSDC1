import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── GET: Fetch reviews for a product with aggregate stats ── */

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const publishedOnly = searchParams.get("published") !== "false";

    if (!productId) {
      return NextResponse.json(
        { error: "productId query parameter is required" },
        { status: 400 },
      );
    }

    const where = { productId, ...(publishedOnly ? { published: true } : {}) };

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Compute aggregate stats
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const r of reviews) {
      ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
    }

    return NextResponse.json({
      reviews,
      stats: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews,
        ratingDistribution,
      },
    });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

/* ── POST: Submit a new review ─────────────────────────────── */

export async function POST(request: Request) {
  try {
    let body: {
      productId: string;
      rating: number;
      title?: string;
      body: string;
      authorName: string;
      authorEmail?: string;
    };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 },
      );
    }

    // Validate
    const errors: string[] = [];
    if (!body.productId || typeof body.productId !== "string") {
      errors.push("productId is required");
    }
    if (!body.rating || typeof body.rating !== "number" || body.rating < 1 || body.rating > 5) {
      errors.push("rating must be a number between 1 and 5");
    }
    if (!body.body || typeof body.body !== "string" || body.body.trim().length < 10) {
      errors.push("body is required and must be at least 10 characters");
    }
    if (!body.authorName || typeof body.authorName !== "string" || !body.authorName.trim()) {
      errors.push("authorName is required");
    }
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: body.productId },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 },
      );
    }

    const review = await prisma.review.create({
      data: {
        productId: body.productId,
        rating: body.rating,
        title: body.title?.trim() || null,
        body: body.body.trim(),
        authorName: body.authorName.trim(),
        authorEmail: body.authorEmail?.trim().toLowerCase() || null,
        published: true,
      },
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 },
    );
  }
}
