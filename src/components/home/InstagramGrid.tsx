"use client";

import { useEffect, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { SOCIAL_LINKS } from "@/lib/constants";

/* ── Constants ─────────────────────────────────────────────────────────────── */

const INSTAGRAM_HANDLE = "@dreamstardriversclub";
const INSTAGRAM_HASHTAG = "#DreamStarDriversClub";

/**
 * Elfsight App ID for the Instagram Feed widget.
 *
 * SETUP INSTRUCTIONS (owner):
 * 1. Go to https://elfsight.com/instagram-feed/
 * 2. Click "Create Widget for Free" — no credit card needed
 * 3. Sign up using the team email (or Continue with Google)
 * 4. Connect @dreamstardriversclub Instagram account
 * 5. Customize the widget:
 *    - Layout: Grid
 *    - Posts to show: 6–8
 *    - Theme: Dark (black/charcoal background, white text, red accent)
 *    - Hide header, show "Follow" button
 * 6. Click "Save" then "Add to website"
 * 7. Copy the App ID from the embed code (the UUID in `elfsight-app-XXXXXXXX`)
 * 8. Set it in .env: NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_APP_ID=XXXXXXXX
 * 9. Redeploy
 *
 * The free tier includes:
 * - Up to 200 views/month
 * - Instagram Feed widget (photos, videos, reels)
 * - Responsive grid layout
 * - Custom colors/theming
 * - "Follow on Instagram" button
 */
const ELFSIGHT_APP_ID =
  process.env.NEXT_PUBLIC_ELFSIGHT_INSTAGRAM_APP_ID || "";

/* ── Component ─────────────────────────────────────────────────────────────── */

export function InstagramGrid() {
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Only load the Elfsight platform script once
    if (!ELFSIGHT_APP_ID || scriptLoaded.current) return;

    // Elfsight widgets self-initialize when the platform script loads.
    // The script scans the DOM for .elfsight-app-* divs and mounts widgets.
    const existingScript = document.querySelector(
      'script[src*="elfsight.com/platform/platform.js"]'
    );
    if (existingScript) {
      scriptLoaded.current = true;
      return;
    }

    const script = document.createElement("script");
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.head.appendChild(script);

    return () => {
      // Script stays loaded; no cleanup needed
    };
  }, []);

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

        {/* ── Elfsight Instagram Feed Widget ──────────────────────────── */}
        {ELFSIGHT_APP_ID ? (
          <div className="mx-auto max-w-5xl">
            <div
              className={`elfsight-app-${ELFSIGHT_APP_ID}`}
              data-elfsight-app-lazy
            />
          </div>
        ) : (
          /* ── Fallback when Elfsight App ID is not configured ───────── */
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-white/[0.08] bg-ds-black-charcoal p-10 text-center">
            <svg
              className="mx-auto h-12 w-12 text-ds-red/50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
            </svg>
            <p className="mt-4 text-sm text-ds-gray-400">
              Real Instagram posts coming soon. Follow us{" "}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ds-red underline underline-offset-2 transition-colors hover:text-ds-red-400"
              >
                {INSTAGRAM_HANDLE}
              </a>{" "}
              for the latest builds and drops.
            </p>
          </div>
        )}

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

/* ── Instagram Icon ────────────────────────────────────────────────────────── */

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
