import Link from "next/link";
import {
  BRAND_NAME,
  TAGLINE,
  FOOTER_LINK_GROUPS,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { Container } from "./Container";
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.06] bg-ds-black-deepest">
      <Container className="section-padding-tight" as="div">
        {/* ── Top: Brand + Links ─────────────────────── */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 text-ds-white">
              <img
                src="/logo%20-%20white.png"
                alt="Dream Star Drivers Club"
                className="h-10 w-auto object-contain"
                loading="lazy"
              />
              <span className="font-display text-sm font-bold tracking-[0.15em]">
                DREAM STAR
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ds-gray-500">
              {TAGLINE} — Premium automotive lifestyle brand rooted in Japanese
              car culture. Mazda rotary and Toyota 2JZ heritage.
            </p>

            {/* Social icons */}
            <div className="mt-5 flex gap-3">
              {[
                { label: "Instagram", href: SOCIAL_LINKS.instagram, icon: "IG" },
                { label: "YouTube", href: SOCIAL_LINKS.youtube, icon: "YT" },
                { label: "Twitter", href: SOCIAL_LINKS.twitter, icon: "TW" },
                { label: "TikTok", href: SOCIAL_LINKS.tiktok, icon: "TK" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] text-xs font-bold text-ds-gray-500 transition-all hover:border-ds-red/30 hover:text-ds-white"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Business hours */}
            <p className="mt-5 text-xs text-ds-gray-500">
              Business Hours: 9am–6pm PST
            </p>
          </div>

          {/* Link groups */}
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="font-display text-xs font-semibold uppercase tracking-[0.15em] text-ds-white">
                {group.title}
              </h4>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ds-gray-500 transition-colors hover:text-ds-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Newsletter ──────────────────────────────── */}
        <div className="mt-12 rounded-2xl border border-white/[0.06] bg-ds-black-elevated p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h4 className="font-display text-lg font-bold text-ds-white">
                Join the Club
              </h4>
              <p className="mt-1 text-sm text-ds-gray-500">
                New drops, restocks, and exclusive content — straight to your
                inbox.
              </p>
            </div>
            <NewsletterForm variant="inline" className="w-full sm:w-auto sm:min-w-[360px]" />
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────── */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.04] pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-ds-gray-600">
            &copy; {currentYear} {BRAND_NAME}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs text-ds-gray-600 transition-colors hover:text-ds-gray-400"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-ds-gray-600 transition-colors hover:text-ds-gray-400"
            >
              Terms
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
