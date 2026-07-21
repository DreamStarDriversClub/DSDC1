import type { Metadata } from "next";
import Link from "next/link";
import { BRAND_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — Dream Star Drivers Club | JDM Lifestyle Brand",
  description:
    "Get in touch with Dream Star Drivers Club — whether you have a question about an order, want to talk wholesale, or just want to say hi.",
  openGraph: {
    title: `Contact | ${BRAND_NAME}`,
    description:
      "Reach out to Dream Star Drivers Club for order support, wholesale inquiries, media requests, or general questions.",
  },
};

const FAQ_QUICK_LINKS = [
  { label: "Shipping Times & Costs", href: "/faq#shipping" },
  { label: "Returns & Exchanges", href: "/faq#returns" },
  { label: "International Orders", href: "/faq#international" },
  { label: "Sizing Guide", href: "/faq#sizing" },
  { label: "View All FAQs", href: "/faq" },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Get in Touch
            </span>
            <h1 className="mt-4 font-display text-display-lg text-ds-white">
              Contact <span className="text-ds-red">the Crew</span>
            </h1>
            <div className="mx-auto mt-6 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ds-gray-300">
              Whether you have a question about an order, want to explore
              wholesale opportunities, or just want to talk cars — we&apos;re
              here for it.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Contact Section ─────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form — takes 3 columns */}
            <div className="lg:col-span-3">
              <SectionHeading
                eyebrow="Send a Message"
                heading="How Can We Help?"
                description="Fill out the form below and we'll get back to you within 24 hours."
                className="mb-8"
              />
              <ContactForm />
            </div>

            {/* Sidebar — takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="space-y-6 lg:sticky lg:top-24">
                {/* Contact Info Card */}
                <Card padding="lg">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ds-white">
                    Contact Info
                  </h3>
                  <div className="mt-5 space-y-4">
                    {/* Email */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ds-red/20 bg-ds-red/10 text-ds-red-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ds-white">Email</p>
                        <a
                          href="mailto:dreamstardriversclub@yahoo.com"
                          className="text-sm text-ds-gray-300 transition-colors hover:text-ds-red"
                        >
                          dreamstardriversclub@yahoo.com
                        </a>
                      </div>
                    </div>

                    {/* Social */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ds-red/20 bg-ds-red/10 text-ds-red-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ds-white">Follow Us</p>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {Object.entries(SOCIAL_LINKS).map(([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-medium capitalize text-ds-gray-300 transition-colors hover:text-ds-red"
                            >
                              {platform}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-ds-red/20 bg-ds-red/10 text-ds-red-400">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-ds-white">Business Hours</p>
                        <p className="text-sm text-ds-gray-300">9am–6pm PST</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Map Placeholder */}
                <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal">
                  <div className="flex aspect-[16/10] items-center justify-center bg-ds-black-elevated">
                    <div className="text-center">
                      <svg className="mx-auto h-10 w-10 text-ds-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <p className="mt-2 text-xs text-ds-gray-600">
                        Based in the USA
                        <br />
                        Shipping worldwide
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Quick Links */}
                <Card padding="lg">
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-ds-white">
                    Quick Answers
                  </h3>
                  <ul className="mt-4 space-y-2">
                    {FAQ_QUICK_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-sm text-ds-gray-300 transition-colors hover:text-ds-red"
                        >
                          <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Bottom accent ───────────────────────────────────────── */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
    </>
  );
}
