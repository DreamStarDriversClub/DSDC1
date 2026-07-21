import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Events & Meets — Cars & Coffee, Track Days & JDM Gatherings",
  description:
    "Cars & Coffee, track days, mountain runs, and club gatherings. Join the Dream Star Drivers Club at our next event.",
  robots: { index: false, follow: true },
  openGraph: {
    title: `Events | ${BRAND_NAME}`,
    description:
      "Cars & Coffee, track days, and club meets. Find out where the Dream Star crew is gathering next.",
  },
};

const EVENT_TYPES = [
  {
    title: "Cars & Coffee",
    description:
      "Morning meets with fresh coffee, cold engines warming up, and nothing but good vibes. Open to all — bring your build.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: "Track Days",
    description:
      "From Buttonwillow to Willow Springs, we organize HPDE days where you can push your car to the limit in a safe environment.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
  },
  {
    title: "Mountain Runs",
    description:
      "Curated canyon routes with breathtaking views and even better driving roads. Touge spirit, group safety — the best Sunday you can have.",
    icon: (
      <svg
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

export default function EventsPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              The Club Meets Here
            </span>
            <h1 className="mt-4 font-display text-display-lg text-ds-white">
              Events &{" "}
              <span className="text-ds-red">Meets</span>
            </h1>
            <div className="mx-auto mt-6 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ds-gray-300">
              Because the best builds aren&apos;t just seen online — they&apos;re
              heard echoing off canyon walls and felt in the paddock. Come hang
              with the crew at our next gathering.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Event Types ─────────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <div className="grid gap-6 sm:grid-cols-3">
            {EVENT_TYPES.map((type) => (
              <Card
                key={type.title}
                padding="lg"
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-ds-red/20 bg-ds-red/10 text-ds-red-400">
                  {type.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-ds-white">
                  {type.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ds-gray-400">
                  {type.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Coming Soon ─────────────────────────────────────────── */}
      <section className="bg-ds-black-deepest section-padding">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-10 text-center sm:p-14">
              <div className="absolute inset-0 bg-gradient-to-br from-ds-red-950/20 via-transparent to-transparent" />
              <div className="absolute left-6 top-6 h-8 w-[1px] bg-ds-red/20" />
              <div className="absolute left-6 top-6 h-[1px] w-8 bg-ds-red/20" />
              <div className="absolute bottom-6 right-6 h-8 w-[1px] bg-ds-red/20" />
              <div className="absolute bottom-6 right-6 h-[1px] w-8 bg-ds-red/20" />
              <div className="relative z-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-ds-red/20 bg-ds-red/10">
                  <svg
                    className="h-8 w-8 text-ds-red-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
                    />
                  </svg>
                </div>
                <h2 className="mt-6 font-display text-2xl font-bold text-ds-white">
                  Event Calendar Inbound
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ds-gray-300">
                  We&apos;re lining up dates for the season. Track days, canyon
                  cruises, and Cars & Coffee meetups are being scheduled now.
                  The best way to stay in the loop is to follow us on Instagram
                  or sign up for the newsletter — that&apos;s where dates drop
                  first.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <Container className="relative py-16 text-center sm:py-20">
          <h2 className="font-display text-2xl font-black tracking-tight text-ds-white sm:text-3xl">
            Want Us in Your City?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ds-gray-300">
            We&apos;re always scouting new locations. If you&apos;ve got a spot you
            think the crew needs to hit, let us know.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Suggest a Location
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="lg">
                Follow on Instagram
              </Button>
            </a>
          </div>
        </Container>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
      </section>
    </>
  );
}
