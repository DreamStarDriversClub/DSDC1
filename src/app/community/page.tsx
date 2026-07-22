import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Community — Events & Local Teams | Dream Star Drivers Club",
  description:
    "The scene doesn't exist without the people. Connect with fellow enthusiasts across the valley — upcoming events, local teams, and the crews that make the JDM community what it is.",
  openGraph: {
    title: `Community — Events & Local Teams | ${BRAND_NAME}`,
    description:
      "The scene doesn't exist without the people. Connect with fellow enthusiasts.",
  },
};

export const dynamic = "force-dynamic";

const eventTypeColors: Record<string, "red" | "gold" | "info" | "warning" | "success"> = {
  meet: "red",
  track_day: "warning",
  cruise: "info",
  show: "gold",
  dyno_day: "success",
};

const eventTypeLabels: Record<string, string> = {
  meet: "Meet",
  track_day: "Track Day",
  cruise: "Cruise",
  show: "Show",
  dyno_day: "Dyno Day",
};

/* ═══════════════════════════════════════════════════════════════════════════
   CommunityPage Component
   ═══════════════════════════════════════════════════════════════════════════ */

export default async function CommunityPage() {
  const session = await getSessionUser();

  const [teams, events] = await Promise.all([
    prisma.team.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        location: true,
        logoUrl: true,
        socialLinks: true,
      },
    }),
    prisma.communityEvent.findMany({
      where: {
        isApproved: true,
        eventDate: { gte: new Date() },
      },
      orderBy: { eventDate: "asc" },
      include: {
        team: { select: { name: true, slug: true } },
      },
    }),
  ]);

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 z-0 bg-grid" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-hero-glow" />
        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Built by Enthusiasts
            </span>
            <h1 className="mt-4 font-display text-display-lg text-ds-white">
              Community
            </h1>
            <div className="mx-auto mt-6 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ds-gray-300">
              The scene doesn&apos;t exist without the people. Connect with fellow
              enthusiasts, register your team, and find the next meet.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/community/register">
                <Button variant="primary" size="lg">
                  Register Your Team
                </Button>
              </Link>
              {session && (
                <Link href="#submit-event">
                  <Button variant="outline" size="lg">
                    Submit an Event
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Events Calendar ────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <SectionHeading
            eyebrow="What's Happening"
            heading="Upcoming Events"
            description={
              events.length > 0
                ? "Community-submitted events. Dates subject to change — follow hosts for real-time updates."
                : "No upcoming events yet. Be the first to submit one!"
            }
            align="center"
            className="mb-12"
          />

          {events.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-ds-black-charcoal">
                <svg className="h-8 w-8 text-ds-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <p className="text-ds-gray-500">Events submitted by the community will appear here once approved.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const d = new Date(event.eventDate);
                const month = d.toLocaleString("en-US", { month: "short" });
                const day = d.getDate().toString();
                const year = d.getFullYear().toString();

                return (
                  <Card key={event.id} padding="lg" hover className="flex flex-col">
                    {/* Date badge */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-ds-red/30 bg-ds-red/10">
                          <span className="font-display text-lg font-black leading-none text-ds-red">
                            {day}
                          </span>
                          <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-red/70">
                            {month}
                          </span>
                        </div>
                      </div>
                      <Badge variant={eventTypeColors[event.eventType] ?? "gray"} size="sm">
                        {eventTypeLabels[event.eventType] ?? event.eventType}
                      </Badge>
                    </div>

                    <h3 className="font-display text-base font-bold text-ds-white">
                      {event.title}
                    </h3>
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ds-gray-500">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {event.location}
                      {event.team && (
                        <>
                          <span className="mx-1">·</span>
                          <span>Hosted by {event.team.name}</span>
                        </>
                      )}
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ds-gray-400">
                      {event.description}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* ── Team Directory ─────────────────────────────────────── */}
      <section className="bg-ds-black-deepest section-padding">
        <Container>
          <SectionHeading
            eyebrow="The Crews"
            heading="Team Directory"
            description={
              teams.length > 0
                ? "These are the clubs, crews, and collectives that make the scene what it is. Connect with them and find your people."
                : "No teams registered yet. Start one and be the first on the board!"
            }
            align="center"
            className="mb-12"
          />

          {teams.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-ds-black-charcoal">
                <svg className="h-8 w-8 text-ds-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <p className="text-ds-gray-500">Teams will appear here once approved by our moderators.</p>
              <Link href="/community/register" className="mt-4 inline-block">
                <Button variant="primary" size="sm">Register Your Team</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teams.map((team) => {
                const socials = team.socialLinks as Record<string, string> | null;

                return (
                  <Link key={team.id} href={`/community/teams/${team.slug}`}>
                    <Card padding="lg" hover className="flex h-full flex-col">
                      {/* Logo + Name */}
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-ds-white/5">
                          {team.logoUrl ? (
                            <img
                              src={team.logoUrl}
                              alt={team.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <svg className="h-6 w-6 text-ds-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold text-ds-white">
                            {team.name}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-ds-gray-500">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            {team.location}
                          </div>
                        </div>
                      </div>

                      {/* Description excerpt */}
                      <p className="flex-1 text-sm leading-relaxed text-ds-gray-400">
                        {team.description.length > 150
                          ? team.description.slice(0, 150) + "..."
                          : team.description}
                      </p>

                      {/* Social links */}
                      {socials && Object.keys(socials).length > 0 && (
                        <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4">
                          {socials.instagram && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-ds-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-gray-400">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                <circle cx="12" cy="12" r="5" />
                              </svg>
                              IG
                            </span>
                          )}
                          {socials.youtube && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-ds-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-gray-400">
                              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                              </svg>
                              YT
                            </span>
                          )}
                          {socials.tiktok && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-ds-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-gray-400">
                              TT
                            </span>
                          )}
                        </div>
                      )}
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      {/* ── CTA: Join / Follow ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <Container className="relative py-20 text-center sm:py-28">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
              Pull Up to the Next Meet
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ds-gray-300">
              The best way to experience the community is to show up. Follow us on
              Instagram for event reminders, behind-the-scenes content, and the
              latest from the scene.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="https://www.instagram.com/dreamstardriversclub/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg">
                  Follow on Instagram
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </a>
              <Link href="/shop/apparel">
                <Button variant="outline" size="lg">
                  Shop the Collection
                </Button>
              </Link>
            </div>
          </div>
        </Container>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
      </section>
    </>
  );
}
