"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

function slugify(title: string, date: Date): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${base}-${yyyy}${mm}${dd}`;
}

export async function submitEvent(formData: FormData) {
  const session = await getSessionUser();
  if (!session) {
    redirect("/auth/login?redirect=/community/events/submit");
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const eventType = (formData.get("eventType") as string)?.trim();
  const eventDateStr = (formData.get("eventDate") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const teamId = (formData.get("teamId") as string)?.trim() || null;

  /* ── Validation ───────────────────────────────────────── */
  const errors: string[] = [];

  if (!title || title.length < 3) {
    errors.push("Event title must be at least 3 characters.");
  }
  if (!description || description.length < 10) {
    errors.push("Description must be at least 10 characters.");
  }
  if (
    !eventType ||
    !["meet", "track day", "night run", "show", "other"].includes(eventType)
  ) {
    errors.push("Please select a valid event type.");
  }
  if (!eventDateStr) {
    errors.push("Event date is required.");
  }
  if (!location || location.length < 2) {
    errors.push("Location is required.");
  }

  let eventDate: Date;
  try {
    eventDate = new Date(eventDateStr);
    if (isNaN(eventDate.getTime())) throw new Error();
  } catch {
    errors.push("Invalid date format.");
  }

  if (errors.length > 0) {
    // Return errors to the client component for display
    return { success: false, errors };
  }

  /* ── Verify team if provided ──────────────────────────── */
  if (teamId) {
    const team = await prisma.team.findFirst({
      where: { id: teamId, isApproved: true },
    });
    if (!team) {
      return {
        success: false,
        errors: ["Selected team not found or not approved."],
      };
    }
  }

  /* ── Generate unique slug ─────────────────────────────── */
  const slug = slugify(title, eventDate!);

  // Handle slug collisions by appending a counter
  let finalSlug = slug;
  let counter = 1;
  while (await prisma.communityEvent.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${slug}-${counter}`;
    counter++;
  }

  /* ── Insert ───────────────────────────────────────────── */
  try {
    await prisma.communityEvent.create({
      data: {
        title,
        slug: finalSlug,
        description,
        eventType,
        eventDate: eventDate!,
        location,
        teamId,
        isApproved: false,
      },
    });
  } catch (error) {
    console.error("Failed to create community event:", error);
    return {
      success: false,
      errors: ["Database error. Please try again later."],
    };
  }

  revalidatePath("/community");
  redirect("/community?submitted=event");
}
