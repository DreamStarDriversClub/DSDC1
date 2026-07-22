"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NewsletterBanner() {
  return (
    <section className="border-t border-white/[0.06] bg-ds-black-deepest section-padding">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold text-ds-white md:text-3xl">
            Join the Club
          </h2>
          <p className="mt-3 text-ds-gray-400">
            Get exclusive drops, JDM culture stories, and member-only deals
            delivered to your inbox.
          </p>
          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              type="email"
              placeholder="your@email.com"
              className="sm:max-w-xs"
            />
            <Button type="submit" variant="primary">
              Subscribe
            </Button>
          </form>
          <p className="mt-3 text-xs text-ds-gray-600">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </Container>
    </section>
  );
}
