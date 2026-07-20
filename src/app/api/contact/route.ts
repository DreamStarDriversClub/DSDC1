import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function validate(data: ContactFormData): string | null {
  const { name, email, subject, message } = data;

  if (!name || typeof name !== "string" || !name.trim()) {
    return "Name is required.";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    return "Email is required.";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }

  if (!subject || typeof subject !== "string" || !subject.trim()) {
    return "Subject is required.";
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    return "Message is required.";
  }
  if (message.trim().length < 10) {
    return "Message must be at least 10 characters.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    let body: ContactFormData;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const validationError = validate(body);
    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    // Store submission in database
    await prisma.contactSubmission.create({
      data: {
        name: body.name.trim(),
        email: body.email.trim().toLowerCase(),
        subject: body.subject.trim(),
        message: body.message.trim(),
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
