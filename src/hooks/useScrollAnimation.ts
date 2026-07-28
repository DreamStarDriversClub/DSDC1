"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { AnimVariant } from "@/lib/animations";
import { anim } from "@/lib/animations";

export interface UseScrollAnimationOptions {
  /** Animation variant to apply when visible */
  variant?: AnimVariant;
  /** IntersectionObserver threshold (0–1) */
  threshold?: number;
  /** Root margin for earlier/later triggering */
  rootMargin?: string;
  /** If true, animation only fires once (default: true) */
  once?: boolean;
  /** Optional delay preset */
  delay?: Parameters<typeof anim>[1];
}

export interface UseScrollAnimationReturn {
  /** Attach this ref to the element you want to animate */
  ref: React.RefCallback<HTMLElement>;
  /** Whether the element is currently visible */
  isVisible: boolean;
  /** Pre-computed animation class string */
  animationClass: string;
}

/**
 * Custom hook for scroll-triggered animations using IntersectionObserver.
 *
 * Returns a ref callback, visibility state, and a pre-built animation
 * class string. Attach `ref` to any element and apply `animationClass`
 * to its className.
 *
 * By default, animations fire once when the element enters the viewport
 * at 10% visibility.
 *
 * Respects `prefers-reduced-motion` — if the user prefers reduced
 * motion, the element renders as visible immediately with no animation.
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = {},
): UseScrollAnimationReturn {
  const {
    variant = "fade-up",
    threshold = 0.1,
    rootMargin = "0px 0px -40px 0px",
    once = true,
    delay,
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);
  const elementRef = useRef<HTMLElement | null>(null);

  // Stable ref callback
  const ref = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  // Check for reduced motion preference once
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    // Respect reduced motion — show immediately
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasTriggered.current) return;
            hasTriggered.current = true;
            setIsVisible(true);

            if (once) {
              observer.unobserve(el);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin },
    );

    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [threshold, rootMargin, once, prefersReducedMotion]);

  // Build the animation class string
  const animationClass = prefersReducedMotion
    ? "opacity-100"
    : isVisible
      ? anim(variant, delay)
      : "opacity-0";

  return { ref, isVisible, animationClass };
}
