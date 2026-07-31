import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* ── Email validation ─────────────────────────────────── */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/* ── POST /api/newsletter/subscribe ────────────────────── */
export async function POST(request: Request) {
  try {
    // Parse body
    let body: { email?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request body." },
        { status: 400 }
      );
    }

    // Validate email presence
    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required." },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: true, message: "You're already part of the club." },
        { status: 200 }
      );
    }

    // Create subscriber
    await prisma.newsletterSubscriber.create({
      data: { email },
    });

    return NextResponse.json(
      { success: true, message: "You're in. Welcome to the club." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
