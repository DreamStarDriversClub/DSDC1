import { Container } from "./Container";
import { NewsletterForm } from "./NewsletterForm";
import { NEWSLETTER } from "@/lib/constants";

export function NewsletterBanner() {
  return (
    <section className="relative overflow-hidden bg-ds-black-elevated">
      {/* Subtle red glow behind */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />

      <Container className="relative section-padding">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-black tracking-tight text-ds-white sm:text-3xl">
            {NEWSLETTER.heading}
          </h2>
          <p className="mt-3 text-ds-gray-400">{NEWSLETTER.description}</p>
          <div className="mx-auto mt-6 max-w-md">
            <NewsletterForm variant="default" />
          </div>
        </div>
      </Container>
    </section>
  );
}
