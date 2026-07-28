"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

/* ── Types ───────────────────────────────────────────────── */

export interface QuickViewVariant {
  id: string;
  name: string;
  price: number;
  inventory: number;
}

export interface QuickViewProduct {
  slug: string;
  name: string;
  price: number | { toString(): string };
  salePrice?: number | { toString(): string } | null;
  category?: { name: string; slug: string } | null;
  images?: unknown;
  variants?: QuickViewVariant[];
}

interface QuickViewContextValue {
  isOpen: boolean;
  product: QuickViewProduct | null;
  openQuickView: (product: QuickViewProduct) => void;
  closeQuickView: () => void;
}

/* ── Context ─────────────────────────────────────────────── */

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<QuickViewProduct | null>(null);

  const openQuickView = useCallback((p: QuickViewProduct) => {
    setProduct(p);
    setIsOpen(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setIsOpen(false);
    // Delay clearing product to allow exit animation to play
    setTimeout(() => setProduct(null), 350);
  }, []);

  return (
    <QuickViewContext.Provider
      value={{ isOpen, product, openQuickView, closeQuickView }}
    >
      {children}
    </QuickViewContext.Provider>
  );
}

export function useQuickView(): QuickViewContextValue {
  const ctx = useContext(QuickViewContext);
  if (!ctx) {
    throw new Error("useQuickView must be used within a QuickViewProvider");
  }
  return ctx;
}
