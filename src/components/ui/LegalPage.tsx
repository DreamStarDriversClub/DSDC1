"use client";

import { useState, type ReactNode } from "react";
import { Container } from "./Container";
import { SectionHeading } from "./SectionHeading";

interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalPageProps {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

export function LegalPage({
  title,
  description,
  lastUpdated,
  sections,
}: LegalPageProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <Container className="relative py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Legal
            </span>
            <h1 className="mt-4 font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            <div className="mt-4 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mt-4 text-base leading-relaxed text-ds-gray-400 sm:text-lg">
              {description}
            </p>
            <p className="mt-4 text-xs text-ds-gray-600">Last Updated: {lastUpdated}</p>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="bg-ds-black section-padding-tight">
        <Container>
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-4">
              {/* Sidebar Navigation */}
              <aside className="hidden lg:block">
                <nav className="sticky top-28 space-y-1">
                  <h4 className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.15em] text-ds-gray-400">
                    On This Page
                  </h4>
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => scrollToSection(section.id)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-ds-red/10 text-ds-red"
                          : "text-ds-gray-500 hover:bg-ds-black-charcoal hover:text-ds-gray-300"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </aside>

              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="space-y-10">
                  {sections.map((section, idx) => (
                    <div
                      key={section.id}
                      id={section.id}
                      className="scroll-mt-28"
                    >
                      <SectionHeading
                        heading={`${idx + 1}. ${section.title}`}
                        className="mb-4"
                      />
                      <div className="prose-custom text-sm leading-relaxed text-ds-gray-400 [&_p]:mb-3 [&_strong]:text-ds-white [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:mb-1 [&_a]:text-ds-red [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-ds-red-400">
                        {section.content}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Last Updated Footer */}
                <div className="mt-16 rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6">
                  <p className="text-xs text-ds-gray-600">
                    <strong className="text-ds-gray-500">Last Updated:</strong>{" "}
                    {lastUpdated}
                  </p>
                  <p className="mt-1 text-xs text-ds-gray-600">
                    If you have questions about this policy, contact us at{" "}
                    <a
                      href="mailto:dreamstardriversclub@yahoo.com"
                      className="text-ds-red underline underline-offset-2 transition-colors hover:text-ds-red-400"
                    >
                      dreamstardriversclub@yahoo.com
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-ds-red/20 to-transparent" />
    </>
  );
}
