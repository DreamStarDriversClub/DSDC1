"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

/* ── Types ───────────────────────────────────────────────── */

export interface WishlistItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  productPrice: number;
  productCategory: string;
}

/* ── Session ID helper ───────────────────────────────────── */

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let sessionId = sessionStorage.getItem("dsdc_session");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("dsdc_session", sessionId);
  }
  return sessionId;
}

/* ── API helpers ─────────────────────────────────────────── */

async function fetchWishlist(sessionId: string): Promise<WishlistItem[]> {
  if (!sessionId) return [];
  try {
    const res = await fetch(`/api/wishlist?sessionId=${encodeURIComponent(sessionId)}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

async function addToWishlistApi(
  sessionId: string,
  item: Omit<WishlistItem, "id">
): Promise<WishlistItem | null> {
  try {
    const res = await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, ...item }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.item ?? null;
  } catch {
    return null;
  }
}

async function removeFromWishlistApi(
  sessionId: string,
  productId: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `/api/wishlist?sessionId=${encodeURIComponent(sessionId)}&productId=${encodeURIComponent(productId)}`,
      { method: "DELETE" }
    );
    return res.ok;
  } catch {
    return false;
  }
}

/* ── Context ─────────────────────────────────────────────── */

interface WishlistContextValue {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, "id">) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  itemCount: number;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [sessionId, setSessionId] = useState("");

  // Hydrate session ID on mount (client-side only)
  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  // Sync with API on mount once we have a session ID
  useEffect(() => {
    if (!sessionId) return;
    fetchWishlist(sessionId).then(setItems);
  }, [sessionId]);

  const addToWishlist = useCallback(
    async (item: Omit<WishlistItem, "id">) => {
      const result = await addToWishlistApi(sessionId, item);
      if (result) {
        setItems((prev) => {
          // Avoid duplicates
          if (prev.some((i) => i.productId === result.productId)) return prev;
          return [...prev, result];
        });
      }
    },
    [sessionId]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      const success = await removeFromWishlistApi(sessionId, productId);
      if (success) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
      }
    },
    [sessionId]
  );

  const isInWishlist = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items]
  );

  const itemCount = items.length;

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      itemCount,
    }),
    [items, addToWishlist, removeFromWishlist, isInWishlist, itemCount]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
