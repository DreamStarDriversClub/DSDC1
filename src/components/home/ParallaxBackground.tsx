"use client";

import { useEffect, useState, useRef } from "react";

/**
 * ParallaxBackground applies a subtle vertical parallax to its children
 * based on scroll position within the parent section.
 *
 * The background moves slower than scroll for a cinematic depth effect.
 * Respects prefers-reduced-motion — disables parallax entirely.
 */
export function ParallaxBackground({
  children,
  speed = 0.35,
}: {
  children: React.ReactNode;
  /** Parallax speed factor (0 = static, 1 = matches scroll) */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setOffsetY(0);
      return;
    }

    let rafId: number;

    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        // How far the section has scrolled past the viewport top
        const viewportHeight = window.innerHeight;
        const sectionTop = rect.top;
        // Progress: 0 when section top = viewport top, 1 when bottom edge hits top
        const progress = sectionTop / (viewportHeight + rect.height);
        // Clamp and map to pixel offset (max ~40px parallax)
        const clamped = Math.max(-0.3, Math.min(0.3, progress));
        setOffsetY(clamped * 40 * speed);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [speed, reducedMotion]);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0"
      style={
        !reducedMotion
          ? { transform: `translateY(${offsetY}px)` }
          : undefined
      }
    >
      {children}
    </div>
  );
}
