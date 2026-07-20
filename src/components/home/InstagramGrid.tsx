"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SOCIAL_LINKS } from "@/lib/constants";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface InstagramPostData {
  id: string;
  imageUrl: string;
  caption: string | null;
  link: string | null;
}

interface InstagramGridProps {
  posts: InstagramPostData[];
}

/* ── Component ─────────────────────────────────────────────────────────────── */

const INSTAGRAM_HANDLE = "@dreamstardriversclub";
const INSTAGRAM_HASHTAG = "#DreamStarDriversClub";

export function InstagramGrid({ posts }: InstagramGridProps) {
  const displayPosts = posts.slice(0, 8);

  return (
    <section className="bg-ds-black-deepest section-padding">
      <Container>
        <SectionHeading
          eyebrow="On the Grid"
          heading="From the Garage"
          description={`Tag your build with ${INSTAGRAM_HASHTAG} for a chance to be featured.`}
          align="center"
          className="mb-12"
        />

        {/* ── Responsive Grid ──────────────────────────────────────────── */}
        {/* 2 cols mobile, 3 cols md, 4 cols xl */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
          {displayPosts.map((post, i) => (
            <InstagramCell key={post.id} post={post} index={i} />
          ))}

          {/* Fill remaining slots with placeholders if fewer than 8 */}
          {Array.from({ length: Math.max(0, 8 - displayPosts.length) }).map(
            (_, i) => (
              <InstagramPlaceholder key={`ph-${i}`} />
            )
          )}
        </div>

        {/* ── Follow CTA ───────────────────────────────────────────────── */}
        <div className="mt-10 text-center">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg">
              <InstagramIcon className="h-5 w-5" />
              Follow {INSTAGRAM_HANDLE}
            </Button>
          </a>
        </div>
      </Container>
    </section>
  );
}

/* ── Instagram Cell ────────────────────────────────────────────────────────── */

function InstagramCell({
  post,
  index,
}: {
  post: InstagramPostData;
  index: number;
}) {
  const cell = (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-ds-black-charcoal transition-all duration-500 hover:border-ds-red/30 hover:shadow-brand-glow-sm hover:z-10">
      {/* ── Image ─────────────────────────────────────────────────────── */}
      <img
        src={post.imageUrl}
        alt={post.caption || "Instagram post from Dream Star Drivers Club"}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        loading={index < 4 ? "eager" : "lazy"}
      />

      {/* ── Subtle permanent gradient at bottom for Instagram icon ────── */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ds-black/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-0" />

      {/* ── Instagram icon (top-right) ────────────────────────────────── */}
      <div className="absolute right-2.5 top-2.5 opacity-60 transition-all duration-300 group-hover:opacity-90 group-hover:scale-110">
        <InstagramIcon className="h-4 w-4 text-ds-white drop-shadow-lg" />
      </div>

      {/* ── Hover overlay with caption ────────────────────────────────── */}
      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ds-black/90 via-ds-black/40 to-transparent p-4 opacity-0 transition-all duration-400 group-hover:opacity-100">
        {post.caption && (
          <p className="line-clamp-3 text-xs leading-relaxed text-ds-white sm:text-sm">
            {post.caption}
          </p>
        )}
        <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-ds-red">
          {INSTAGRAM_HANDLE}
        </span>
      </div>

      {/* ── Bottom accent line (visible on hover) ─────────────────────── */}
      <div className="absolute inset-x-3 bottom-0 h-px origin-left scale-x-0 bg-gradient-to-r from-ds-red/60 via-ds-red/30 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  );

  if (post.link) {
    return (
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {cell}
      </a>
    );
  }
  return cell;
}

/* ── Placeholder Cell ──────────────────────────────────────────────────────── */

function InstagramPlaceholder() {
  return (
    <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-white/[0.06] bg-ds-black-charcoal transition-all duration-300 hover:border-ds-red/30 hover:shadow-brand-glow-sm">
      {/* Dark gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-ds-black-charcoal via-ds-black-elevated to-ds-black-charcoal" />

      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-grid opacity-15" />

      {/* Center Instagram icon */}
      <div className="absolute inset-0 flex items-center justify-center opacity-25 transition-all duration-300 group-hover:opacity-50 group-hover:scale-110">
        <InstagramIcon className="h-10 w-10 text-ds-gray-500" />
      </div>

      {/* Hover reveal */}
      <div className="absolute inset-0 flex items-center justify-center bg-ds-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ds-white">
          {INSTAGRAM_HANDLE}
        </span>
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-3 right-3 h-4 w-[1px] bg-ds-red/20" />
      <div className="absolute bottom-3 right-3 h-[1px] w-4 bg-ds-red/20" />
    </div>
  );
}

/* ── Instagram Icon ────────────────────────────────────────────────────────── */

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
