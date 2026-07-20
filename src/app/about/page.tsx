import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Dream Star Drivers Club was forged on the mountain roads of Japan — where rotary engines scream to 9,000 RPM and every corner tells a story. Learn about our passion for JDM culture.",
  openGraph: {
    title: `About Us | ${BRAND_NAME}`,
    description:
      "Born from passion. Built for the drive. Discover the story behind Dream Star Drivers Club.",
  },
};

const VALUES = [
  {
    title: "Quality",
    description:
      "Every stitch, every tolerance, every material is chosen with intention. We don't cut corners — we apex them.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Community",
    description:
      "More than customers — you're crew. From track days to late-night garage sessions, we build bonds that last longer than any build.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
  {
    title: "Heritage",
    description:
      "Rooted in the golden era of JDM — FC, FD, Supra, GT-R. We honor the legends that shaped us and the culture that keeps their spirit alive.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: "Innovation",
    description:
      "Respecting tradition doesn't mean standing still. We push boundaries in design, materials, and performance — always chasing the next horizon.",
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
];

const CREW = [
  {
    name: "Angel Alicea",
    role: "Founder & Lead Designer",
    bio: "FC owner and GS300 owner. Pure automotive enthusiast. He started street racing at the age of 13 and 27 years later still has the same drive and passion to build unique and interesting cars and bikes. He is the goto guy for figuring out how to make things work in any scenario.",
    initials: "AA",
  },
  {
    name: "Siyu Lu",
    role: "Head of Operations",
    bio: "From educational powerhouse to freshly discovered passion. Married to Angel and inherited his never ending excess passion for Rotary and 2JZ love.",
    initials: "SL",
  },
  {
    name: "David Blackman",
    role: "Community Director",
    bio: "Track day organizer and RX-7 aficionado. The bridge between the brand and the culture.",
    initials: "DB",
  },
  {
    name: "Wesley Stramer",
    role: "Shop Director",
    bio: "Wes has been a part of the car community for over two decades and his experience ranges from Automotive Detailing to full car curating and building. A wizard with a wrench and never scared to take on a job. He focuses on functionality with a SMALL touch of detail. OCD is one way we can describe it.",
    initials: "WS",
  },
  {
    name: "Kevin Alicea",
    role: "Shop Apprentice",
    bio: "Born into the passion of gasoline and drift cars. The next generation of enthusiast.",
    initials: "KA",
  },
  {
    name: "Penelope Alicea",
    role: "Dream Star Mascot",
    bio: "Small and cute, but mighty. Lots of sass and a future leader but for now she's here to brighten everyone's day.",
    initials: "PA",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Our Story
            </span>
            <h1 className="mt-4 font-display text-display-lg text-ds-white">
              Born from Passion.
              <br />
              <span className="text-ds-red">Built for the Drive.</span>
            </h1>
            <div className="mx-auto mt-6 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ds-gray-400">
              Dream Star Drivers Club was forged on the mountains of the Tri-state area,
              based on the love of all the mountain roads in Japan, and now based in the Vegas Valley.
              This is where rotary engines scream to 9,000 RPM, 2JZ engines test the limits, and every
              corner tells a tale. We&apos;re more than a brand; we&apos;re a tribute to the
              golden era of JDM engineering.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Brand Story ─────────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="The Origin"
                heading="Where It All Began"
                description="It started in a garage with a half-disassembled RX-7 and a dream. Late nights, busted knuckles, and the unmistakable smell of premix — that was university."
              />
              <p className="mt-6 text-base leading-relaxed text-ds-gray-400">
                We learned the hard way that parts for rotaries weren&apos;t just hard to find
                — they were often underwhelming. Generic designs, questionable quality, and
                zero connection to the culture they claimed to serve. So we started making our own.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ds-gray-500">
                What began as a small batch of rotary rebuild components grew into something
                bigger. Enthusiasts started asking for apparel. Then accessories. Then they
                wanted to be part of a club — not just customers, but crew. Dream Star
                Drivers Club was born from that demand: a brand that speaks the language
                of car culture fluently.
              </p>
              <p className="mt-4 text-base leading-relaxed text-ds-gray-500">
                Every product we make — from the stitching on our hoodies to the tolerances
                in our performance kits — is a love letter to Japanese automotive culture.
                This isn&apos;t just merch. This is membership.
              </p>
            </div>

            {/* Visual element */}
            <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal lg:aspect-auto lg:h-full lg:min-h-[450px]">
              <div className="absolute inset-0 bg-gradient-to-br from-ds-red-950/30 via-ds-black-charcoal to-ds-gold-dark/10" />
              <div className="absolute inset-0 bg-grid opacity-30" />
              <div className="relative z-10 text-center">
                <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full border-2 border-ds-red/30 bg-ds-black/60 shadow-brand-glow backdrop-blur-sm">
                  <img
                    src="/logo%20-%20white.png"
                    alt="Dream Star Drivers Club"
                    className="h-16 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="mt-6 font-display text-sm font-semibold uppercase tracking-[0.3em] text-ds-gray-500">
                  Est. 2020
                </p>
              </div>
              <div className="absolute left-4 top-4 h-8 w-[1px] bg-ds-red/30" />
              <div className="absolute left-4 top-4 h-[1px] w-8 bg-ds-red/30" />
              <div className="absolute bottom-4 right-4 h-8 w-[1px] bg-ds-red/30" />
              <div className="absolute bottom-4 right-4 h-[1px] w-8 bg-ds-red/30" />
            </div>
          </div>
        </Container>
      </section>

      {/* ── Mission ─────────────────────────────────────────────── */}
      <section className="bg-ds-black-deepest section-padding">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Our Mission
            </span>
            <h2 className="mt-4 font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
              To build the most trusted brand in JDM lifestyle — period.
            </h2>
            <div className="mx-auto mt-4 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ds-gray-400">
              We exist to celebrate Japanese car culture through premium products
              that honor its legacy. From the rotary faithful to the 2JZ loyalists,
              we create gear and parts that match the quality of the machines
              they&apos;re built for. No compromises. No shortcuts. Just passion,
              precision, and performance.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Values ──────────────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <SectionHeading
            eyebrow="What We Stand For"
            heading="Brand Values"
            description="These aren't buzzwords — they're the principles that guide every decision we make."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value) => (
              <Card key={value.title} padding="lg" className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl border border-ds-red/20 bg-ds-red/10 text-ds-red-400">
                  {value.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-ds-white">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ds-gray-500">
                  {value.description}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Team ────────────────────────────────────────────────── */}
      <section className="bg-ds-black-deepest section-padding">
        <Container>
          <SectionHeading
            eyebrow="The People"
            heading="Meet the Crew"
            description="A small team with big dreams. These are the people behind the brand."
            align="center"
            className="mb-12"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CREW.map((member) => (
              <Card key={member.name} padding="lg" className="flex flex-col items-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-ds-red/30 bg-ds-black-elevated shadow-brand-glow-sm">
                  <span className="font-display text-xl font-bold text-ds-red">
                    {member.initials}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-ds-white">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ds-red">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ds-gray-500">
                  {member.bio}
                </p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA: Join the Club ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <Container className="relative py-20 text-center sm:py-28">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
              Ready to Join the Club?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ds-gray-400">
              Sign up for early access to drops, exclusive content, and a
              community of enthusiasts who get it.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/shop/apparel">
                <Button variant="primary" size="lg">
                  Shop the Collection
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">
                  Follow on Instagram
                </Button>
              </a>
            </div>
          </div>
        </Container>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
      </section>
    </>
  );
}
