import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BRAND_NAME } from "@/lib/constants";
import { getSessionUser } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { TeamRegistrationForm } from "@/components/community/TeamRegistrationForm";

export const metadata: Metadata = {
  title: "Register Your Team — Community | Dream Star Drivers Club",
  description:
    "Register your car crew, club, or enthusiast team with Dream Star Drivers Club. Get listed in our team directory and connect with the community.",
};

export default async function TeamRegisterPage() {
  const session = await getSessionUser();
  if (!session) {
    redirect("/auth/login?redirect=/community/register");
  }

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
              Register Your Team
            </h1>
            <div className="mx-auto mt-5 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ds-gray-300">
              Tell us about your crew. Once approved, your team will appear in the
              community directory and you&apos;ll be able to submit events.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Form ────────────────────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6 sm:p-10">
              <TeamRegistrationForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
