import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { BRAND_NAME, SOCIAL_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Blog — Rotary Builds, 2JZ Projects & JDM Culture Deep Dives",
  description:
    "Stories from the garage, the mountains, and beyond. The Dream Star Drivers Club blog — rotary builds, 2JZ projects, event coverage, and JDM culture deep dives.",
  openGraph: {
    title: `Blog | ${BRAND_NAME}`,
    description:
      "Deep dives into JDM culture, build stories, event coverage, and more from the Dream Star crew.",
  },
};

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <Container className="relative py-20 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-3xl text-center opacity-start animate-fade-in-up">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
              Stories from the Garage
            </span>
            <h1 className="mt-4 font-display text-display-lg text-ds-white">
              The{" "}
              <span className="text-ds-red">Blog</span>
            </h1>
            <div className="mx-auto mt-6 h-[3px] w-12 rounded-full bg-ds-red" />
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ds-gray-300">
              Build stories, technical deep dives, event coverage, and
              everything in between. Welcome to the heart of Dream Star Drivers
              Club — where the culture lives between the words.
            </p>
          </div>
        </Container>
      </section>

      {/* ── Posts ───────────────────────────────────── */}
      <section className="bg-ds-black section-padding">
        <Container>
          <div className="mx-auto max-w-3xl">
            {posts.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center gap-2 rounded-full border border-ds-red/20 bg-ds-red/10 px-4 py-1.5">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-ds-red" />
                  <span className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-ds-red">
                    First articles coming soon
                  </span>
                </div>
                <p className="mt-6 text-ds-gray-400">
                  We're working on our first pieces. Check back soon for rotary builds, 2JZ deep dives, and JDM culture stories.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6 transition-all duration-400 hover:border-ds-red/20 sm:p-8"
                  >
                    {/* Accent corner */}
                    <div className="absolute left-4 top-4 h-6 w-[1px] bg-ds-red/20" />
                    <div className="absolute left-4 top-4 h-[1px] w-6 bg-ds-red/20" />
                    {/* Tag */}
                    <span className="inline-block rounded-md border border-ds-red/20 bg-ds-red/10 px-2.5 py-0.5 font-display text-[10px] font-semibold uppercase tracking-[0.15em] text-ds-red-400">
                      {post.tag}
                    </span>
                    <h2 className="mt-4 font-display text-xl font-bold text-ds-white transition-colors group-hover:text-ds-red-400">
                      {post.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-ds-gray-400">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="text-xs text-ds-gray-600">
                        {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="h-[3px] w-8 rounded-full bg-ds-red/30 transition-all group-hover:w-12 group-hover:bg-ds-red" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ── Newsletter CTA ──────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <Container className="relative py-16 text-center sm:py-20">
          <h2 className="font-display text-2xl font-black tracking-tight text-ds-white sm:text-3xl">
            Don&apos;t Miss a Story
          </h2>
          <p className="mx-auto mt-3 max-w-md text-ds-gray-300">
            Sign up for our newsletter and be the first to know when we drop new
            articles, build diaries, and event coverage.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button variant="primary" size="lg">
                Join the Club
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
