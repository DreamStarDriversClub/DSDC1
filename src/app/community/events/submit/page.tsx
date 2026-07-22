import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { EventSubmissionForm } from "@/components/community/EventSubmissionForm";

export const metadata: Metadata = {
  title: "Submit an Event — Community | Dream Star Drivers Club",
  description:
    "Submit your local meet, track day, night run, or car show to the Dream Star community calendar. All submissions are reviewed before going live.",
};

export const dynamic = "force-dynamic";

export default async function EventSubmitPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/auth/login?redirect=/community/events/submit");
  }

  /* Fetch approved teams for the optional team association dropdown */
  const approvedTeams = await prisma.team.findMany({
    where: { isApproved: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 z-0 bg-grid" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-hero-glow" />
        <Container className="relative py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Community
            </span>
            <h1 className="mt-4 font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
              Submit an Event
            </h1>
            <div className="mx-auto mt-5 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ds-gray-300">
              Got a meet, track day, or night run coming up? Submit it here and
              we&rsquo;ll add it to the community calendar once approved. All events
              are reviewed before going live.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Form ────────────────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6 sm:p-10">
              <EventSubmissionForm approvedTeams={approvedTeams} />
            </div>

            {/* ── Note ──────────────────────────────────────────── */}
            <p className="mt-6 text-center text-xs text-ds-gray-500">
              Events are typically reviewed within 24 hours. You&rsquo;ll receive a
              notification once your event is approved and live on the community
              calendar.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
