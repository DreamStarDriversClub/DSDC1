/* ── Animation Utility Library ───────────────────────────
   Reusable animation class helpers and predefined
   variants for cinematic scroll-triggered animations.

   Usage:
     import { anim, ANIM_VARIANTS } from "@/lib/animations";
     <div className={anim("fade-up", "delay-200")}>...</div>
   ──────────────────────────────────────────────────────── */

import { cn } from "@/lib/utils";

/* ── Animation Variants ────────────────────────────────── */

export const ANIM_VARIANTS = {
  "fade-up": "animate-fade-in-up",
  "fade-in": "animate-fade-in",
  "slide-left": "animate-slide-in-left",
  "slide-right": "animate-slide-in-right",
  "scale-in": "animate-scale-in",
} as const;

export type AnimVariant = keyof typeof ANIM_VARIANTS;

/* ── Delay Presets ─────────────────────────────────────── */

export const ANIM_DELAYS = {
  "delay-0": "animation-delay-0",
  "delay-75": "animation-delay-75",
  "delay-100": "animation-delay-100",
  "delay-150": "animation-delay-150",
  "delay-200": "animation-delay-200",
  "delay-300": "animation-delay-300",
  "delay-400": "animation-delay-400",
  "delay-500": "animation-delay-500",
  "delay-700": "animation-delay-700",
  "delay-1000": "animation-delay-1000",
} as const;

export type AnimDelay = keyof typeof ANIM_DELAYS;

/* ── Duration Presets ──────────────────────────────────── */

export const ANIM_DURATIONS = {
  "duration-fast": "animation-duration-200",
  "duration-normal": "animation-duration-400",
  "duration-slow": "animation-duration-600",
} as const;

/* ── Helper: build animation class string ───────────────── */

/**
 * Compose animation classes from variant, delay, and optional extras.
 *
 * @param variant  - The base animation variant (e.g. "fade-up")
 * @param delay    - Optional delay preset (e.g. "delay-200")
 * @param extras   - Any additional Tailwind classes
 */
export function anim(
  variant: AnimVariant,
  delay?: AnimDelay,
  ...extras: string[]
): string {
  return cn(
    "opacity-0", // hidden until animated
    ANIM_VARIANTS[variant],
    delay ? ANIM_DELAYS[delay] : undefined,
    ...extras,
  );
}

/* ── Stagger helper for grid children ──────────────────── */

const STAGGER_DELAYS: Record<number, string> = {
  0: "animation-delay-0",
  1: "animation-delay-75",
  2: "animation-delay-100",
  3: "animation-delay-150",
  4: "animation-delay-200",
  5: "animation-delay-300",
  6: "animation-delay-400",
  7: "animation-delay-500",
};

/**
 * Returns a staggered animation class for grid items.
 * Cycles through predefined delays so every item feels
 * like it cascades in.
 */
export function staggerAnim(
  variant: AnimVariant,
  index: number,
): string {
  const delay = STAGGER_DELAYS[index % 8];
  return anim(variant, delay as AnimDelay);
}
