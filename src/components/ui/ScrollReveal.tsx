"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import type { AnimVariant, AnimDelay } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: React.ReactNode;
  /** Animation variant (default: "fade-up") */
  variant?: AnimVariant;
  /** Additional classes applied to the wrapper */
  className?: string;
  /** IntersectionObserver threshold */
  threshold?: number;
  /** Whether to fire animation only once (default: true) */
  once?: boolean;
  /** Stagger delay preset (e.g. "delay-200") */
  delay?: AnimDelay;
}

/**
 * Client wrapper that adds scroll-triggered fade-in animations.
 *
 * Wrap any content in <ScrollReveal> to have it animate into view
 * when it scrolls into the viewport. Works in both server and
 * client component trees.
 *
 * @example
 * <ScrollReveal variant="fade-up" delay="delay-200">
 *   <h2>This fades up on scroll with a 200ms delay</h2>
 * </ScrollReveal>
 */
export function ScrollReveal({
  children,
  variant = "fade-up",
  className,
  threshold = 0.1,
  once = true,
  delay,
}: ScrollRevealProps) {
  const { ref, animationClass } = useScrollAnimation({
    variant,
    threshold,
    once,
    delay,
  });

  return (
    <div ref={ref} className={cn(animationClass, className)}>
      {children}
    </div>
  );
}
