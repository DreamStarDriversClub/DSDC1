import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Community — Events & Local Teams | Dream Star Drivers Club",
  description:
    "The scene doesn't exist without the people. Connect with fellow enthusiasts across the valley — upcoming events, local teams, and the crews that make the Vegas JDM community what it is.",
  openGraph: {
    title: `Community — Events & Local Teams | ${BRAND_NAME}`,
    description:
      "The scene doesn't exist without the people. Connect with fellow enthusiasts across the valley.",
  },
};

/* ── Events Data ─────────────────────────────────────────────────────────── */

const EVENTS = [
  {
    date: "Jul 12",
    month: "July",
    day: "12",
    year: "2026",
    name: "Cars & Coffee Las Vegas",
    location: "SpeedVegas",
    description:
      "The valley's biggest monthly gathering. Hundreds of builds from classic JDM to modern exotics. Roll in early, grab coffee, and talk cars with the best community in Vegas.",
    badge: "Monthly",
  },
  {
    date: "Jul 25",
    month: "July",
    day: "25",
    year: "2026",
    name: "Midnight Touge Run",
    location: "Mt Charleston",
    description:
      "Late-night mountain pass run under the stars. Technical corners, elevation changes, and pure driving. Meet at the base — headlights mandatory, egos left at home.",
    badge: "Night Run",
  },
  {
    date: "Aug 1",
    month: "August",
    day: "1",
    year: "2026",
    name: "JDM Fest West",
    location: "LV Convention Center",
    description:
      "The West Coast's premier Japanese automotive festival. Two days of show cars, vendor booths, drift demos, and special guest builds from across the country.",
    badge: "Major Event",
  },
  {
    date: "Aug 15",
    month: "August",
    day: "15",
    year: "2026",
    name: "Drift Day",
    location: "LVMS",
    description:
      "Full day of open drifting on the LVMS skid pad. All skill levels welcome. Tech inspection at 8 AM, tires not included. Bring spares — you'll need them.",
    badge: "Track Day",
  },
  {
    date: "Aug 22",
    month: "August",
    day: "22",
    year: "2026",
    name: "Rotary Reunion Meet",
    location: "Sunset Park",
    description:
      "The annual gathering for rotary enthusiasts. FCs, FDs, RX-8s, and anything else that spins triangles. BBQ, garage tours, and the unmistakable sound of bridge-ported 13Bs echoing across the park.",
    badge: "DSDC Event",
  },
  {
    date: "Aug 29",
    month: "August",
    day: "29",
    year: "2026",
    name: "Import Showdown",
    location: "South Point Arena",
    description:
      "Quarter-mile battle: JDM vs. the world. Bracket racing, test-and-tune sessions, and a show-n-shine. The strip gets hot and the times get low. Who's bringing the Supra?",
    badge: "Race Event",
  },
];

/* ── Organizations Data ──────────────────────────────────────────────────── */

const ORGANIZATIONS = [
  {
    name: "Vegas Rotary Club",
    description:
      "Dedicated to keeping the rotary engine alive in the desert. Weekly meets, group rebuild sessions, and an encyclopedia of 13B knowledge passed down through generations of enthusiasts who understand that triangles spin different.",
    location: "Las Vegas, NV",
    members: "180+ members",
  },
  {
    name: "Desert Drift Squad",
    description:
      "Vegas's premier drifting collective. Organizes monthly drift days, tire-shredding demos, and beginner clinics. If it slides, they're probably behind it — and they'll teach you how to do it too.",
    location: "Las Vegas, NV",
    members: "250+ members",
  },
  {
    name: "LV JDM Collective",
    description:
      "The central hub for Japanese car enthusiasts in the valley. Hosts mixers, group drives, and Cars & Coffee takeovers. All chassis welcome — from kei cars to GT-Rs, stock to full build.",
    location: "Las Vegas, NV",
    members: "400+ members",
  },
  {
    name: "Sin City Touge Runners",
    description:
      "Mountain pass specialists. They scout the best canyon roads within driving distance and organize safe, responsible group runs. Pace notes optional, respect mandatory.",
    location: "Las Vegas, NV",
    members: "120+ members",
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   CommunityPage Component
   ═══════════════════════════════════════════════════════════════════════════ */

export default function CommunityPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 z-0 bg-grid" />
        <div className="pointer-events-none absolute inset-0 z-[1] bg-hero-glow" />
        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Las Vegas JDM Scene
            </span>
            <h1 className="mt-4 font-display text-display-lg text-ds-white">
              Community
            </h1>
            <div className="mx-auto mt-6 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ds-gray-300">
              The scene doesn&apos;t exist without the people. Connect with fellow
              enthusiasts across the valley.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ds-gray-400">
              Whether you&apos;re local or just passing through, there&apos;s a
              meet, a run, or a garage session waiting for you. Find your crew below.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Events Calendar ────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <SectionHeading
            eyebrow="What's Happening"
            heading="Upcoming Events"
            description="Summer 2026 is stacked. From Cars & Coffee to track nights, here's where you'll find the Dream Star crew and the wider Vegas JDM community."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {EVENTS.map((event) => (
              <Card key={event.name} padding="lg" hover className="flex flex-col">
                {/* Date badge */}
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-ds-red/30 bg-ds-red/10">
                      <span className="font-display text-lg font-black leading-none text-ds-red">
                        {event.day}
                      </span>
                      <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-red/70">
                        {event.month.slice(0, 3)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ds-red/60">
                        {event.month} {event.year}
                      </span>
                    </div>
                  </div>
                  {/* Badge */}
                  <span className="shrink-0 rounded-full border border-ds-red/20 bg-ds-red/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-red/80">
                    {event.badge}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-display text-base font-bold text-ds-white">
                  {event.name}
                </h3>
                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-ds-gray-500">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {event.location}
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ds-gray-400">
                  {event.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Calendar note */}
          <div className="mt-10 text-center">
            <p className="text-sm text-ds-gray-500">
              Dates and locations are subject to change. Follow{" "}
              <a
                href="https://www.instagram.com/dreamstardriversclub/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ds-red underline underline-offset-2 transition-colors hover:text-ds-red-400"
              >
                @dreamstardriversclub
              </a>{" "}
              for real-time updates on all events.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Local Organizations ────────────────────────────────── */}
      <section className="bg-ds-black-deepest section-padding">
        <Container>
          <SectionHeading
            eyebrow="The Crews"
            heading="Local Organizations & Teams"
            description="These are the clubs, crews, and collectives that make the Vegas JDM scene what it is. Connect with them, show up to their meets, and find your people."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2">
            {ORGANIZATIONS.map((org) => (
              <Card
                key={org.name}
                padding="lg"
                hover
                className="flex flex-col"
              >
                {/* Header */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-ds-white/5 text-ds-gray-300">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-ds-white">
                      {org.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-ds-gray-500">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      {org.location}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="flex-1 text-sm leading-relaxed text-ds-gray-400">
                  {org.description}
                </p>

                {/* Members badge */}
                <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4">
                  <span className="inline-flex items-center rounded-full bg-ds-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-gray-400">
                    {org.members}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <p className="text-sm text-ds-gray-400">
              Are you part of a local crew not listed here?{" "}
              <Link
                href="/contact"
                className="text-ds-red underline underline-offset-2 transition-colors hover:text-ds-red-400"
              >
                Get in touch
              </Link>{" "}
              — we&apos;d love to add you to the community.
            </p>
          </div>
        </Container>
      </section>

      {/* ── CTA: Join the Scene ────────────────────────────────── */}
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
              latest from the Vegas JDM scene.
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
