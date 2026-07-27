import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { BRAND_NAME } from "@/lib/constants";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    select: { title: true, excerpt: true, tag: true },
  });
  if (!post) return { title: "Post Not Found" };

  return {
    title: `${post.title} — ${BRAND_NAME} Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
  });

  if (!post) notFound();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-ds-black-deepest">
        <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
        <div className="pointer-events-none absolute inset-0 bg-grid" />
        <Container className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-ds-gray-400 transition-colors hover:text-ds-white"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
            <span className="mt-6 inline-block rounded-md border border-ds-red/20 bg-ds-red/10 px-3 py-1 font-display text-[10px] font-semibold uppercase tracking-[0.15em] text-ds-red-400">
              {post.tag}
            </span>
            <h1 className="mt-4 font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ds-gray-300">
              {post.excerpt}
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-ds-gray-500">
              <time dateTime={post.publishedAt?.toString() ?? post.createdAt.toISOString()}>
                {new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="bg-ds-black section-padding">
        <Container>
          <article className="prose prose-invert prose-ds mx-auto max-w-3xl">
            {/* Simple Markdown rendering — paragraphs and line breaks */}
            {post.content.split("\n").map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <br key={i} />;
              // Headings
              if (trimmed.startsWith("## ")) {
                return <h2 key={i} className="mt-8 mb-4 font-display text-2xl font-bold text-ds-white">{trimmed.slice(3)}</h2>;
              }
              if (trimmed.startsWith("### ")) {
                return <h3 key={i} className="mt-6 mb-3 font-display text-xl font-bold text-ds-white">{trimmed.slice(4)}</h3>;
              }
              // Images
              if (trimmed.startsWith("![")) {
                const alt = trimmed.slice(2, trimmed.indexOf("]"));
                const src = trimmed.slice(trimmed.indexOf("(") + 1, trimmed.indexOf(")"));
                return <img key={i} src={src} alt={alt} className="my-6 rounded-xl w-full" />;
              }
              return <p key={i} className="my-3 leading-relaxed text-ds-gray-200 text-base">{trimmed}</p>;
            })}
          </article>

          <div className="mx-auto mt-16 max-w-3xl border-t border-white/[0.06] pt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ds-red transition-colors hover:text-ds-red-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

export const dynamic = "force-dynamic";
