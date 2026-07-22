import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BRAND_NAME } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const team = await prisma.team.findUnique({
    where: { slug: params.slug, isApproved: true },
    select: { name: true, description: true },
  });

  if (!team) {
    return { title: "Team Not Found | Dream Star Drivers Club" };
  }

  return {
    title: `${team.name} — Community | ${BRAND_NAME}`,
    description: team.description.slice(0, 160),
  };
}

export default async function TeamDetailPage({ params }: Props) {
  const team = await prisma.team.findUnique({
    where: { slug: params.slug, isApproved: true },
    include: {
      events: {
        where: { isApproved: true },
        orderBy: { eventDate: "asc" },
      },
    },
  });

  if (!team) {
    notFound();
  }

  const socials = team.socialLinks as Record<string, string> | null;

  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 z-0 bg-grid" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-hero-glow" />
        <Container className="relative py-16 sm:py-24">
          <Link
            href="/community"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-ds-gray-400 transition-colors hover:text-ds-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Community
          </Link>

          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            {/* Logo */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/[0.08] bg-ds-white/5">
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt={team.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg className="h-10 w-10 text-ds-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              )}
            </div>

            <div>
              <h1 className="font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
                {team.name}
              </h1>
              <div className="mt-2 flex items-center gap-1.5 text-ds-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {team.location}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Content ─────────────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main: Description and Events */}
            <div className="lg:col-span-2 space-y-8">
              {/* Team Story */}
              <Card padding="lg">
                <h2 className="mb-4 font-display text-lg font-bold text-ds-white">
                  Team Story
                </h2>
                <p className="text-sm leading-relaxed text-ds-gray-300 whitespace-pre-line">
                  {team.description}
                </p>
              </Card>

              {/* Goals */}
              {team.goals && (
                <Card padding="lg">
                  <h2 className="mb-4 font-display text-lg font-bold text-ds-white">
                    Team Goals
                  </h2>
                  <p className="text-sm leading-relaxed text-ds-gray-300 whitespace-pre-line">
                    {team.goals}
                  </p>
                </Card>
              )}

              {/* Events */}
              <Card padding="lg">
                <h2 className="mb-4 font-display text-lg font-bold text-ds-white">
                  Events
                  {team.events.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-ds-gray-500">
                      ({team.events.length})
                    </span>
                  )}
                </h2>

                {team.events.length === 0 ? (
                  <p className="text-sm text-ds-gray-500">
                    No events posted yet. Check back soon!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {team.events.map((event) => (
                      <div
                        key={event.id}
                        className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-ds-black p-4 sm:flex-row sm:items-center"
                      >
                        {/* Date */}
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg border border-ds-red/30 bg-ds-red/10">
                          <span className="font-display text-sm font-bold leading-none text-ds-red">
                            {new Date(event.eventDate).getDate()}
                          </span>
                          <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-ds-red/70">
                            {new Date(event.eventDate).toLocaleString("en-US", { month: "short" })}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-display text-sm font-bold text-ds-white">
                            {event.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-ds-gray-400">
                            {event.location}
                          </p>
                        </div>

                        {/* Badge */}
                        <Badge variant={eventTypeColors[event.eventType] ?? "gray"} size="sm">
                          {eventTypeLabels[event.eventType] ?? event.eventType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar: Contact & Social */}
            <div className="space-y-6">
              {/* Contact */}
              <Card padding="lg">
                <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
                  Contact
                </h3>
                <a
                  href={`mailto:${team.contactEmail}`}
                  className="inline-flex items-center gap-2 text-sm text-ds-gray-300 transition-colors hover:text-ds-red"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  {team.contactEmail}
                </a>
              </Card>

              {/* Social Links */}
              {socials && Object.keys(socials).length > 0 && (
                <Card padding="lg">
                  <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-ds-white">
                    Social
                  </h3>
                  <div className="space-y-2">
                    {socials.instagram && (
                      <a
                        href={socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-ds-gray-300 transition-colors hover:text-ds-red"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <circle cx="12" cy="12" r="5" />
                        </svg>
                        Instagram
                      </a>
                    )}
                    {socials.youtube && (
                      <a
                        href={socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-ds-gray-300 transition-colors hover:text-ds-red"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" />
                        </svg>
                        YouTube
                      </a>
                    )}
                    {socials.tiktok && (
                      <a
                        href={socials.tiktok}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-ds-gray-300 transition-colors hover:text-ds-red"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 8.25v7.5m6-7.5h-3V12m0 0v3.75c0 2.071-1.679 3.75-3.75 3.75S8.25 17.821 8.25 15.75 9.929 12 12 12" />
                        </svg>
                        TikTok
                      </a>
                    )}
                  </div>
                </Card>
              )}

              {/* CTA */}
              <div className="rounded-xl border border-ds-red/20 bg-ds-red/5 p-5">
                <p className="text-sm text-ds-gray-300">
                  Want to see your team here?{" "}
                  <Link href="/community/register" className="font-medium text-ds-red hover:underline">
                    Register now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
