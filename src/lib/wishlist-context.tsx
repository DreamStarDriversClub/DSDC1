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

export interface WishlistContextItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: number; // cents
  productCategory: string;
}

interface WishlistContextValue {
  wishlistItems: WishlistContextItem[];
  addToWishlist: (item: Omit<WishlistContextItem, "id">) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  isLoading: boolean;
}

/* ── Session helpers ─────────────────────────────────────── */

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("dsdc_wishlist_session");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("dsdc_wishlist_session", id);
  }
  return id;
}

/* ── API helpers ─────────────────────────────────────────── */

async function fetchWishlist(
  sessionId: string
): Promise<WishlistContextItem[]> {
  const res = await fetch(`/api/wishlist?sessionId=${encodeURIComponent(sessionId)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

async function apiAddToWishlist(
  sessionId: string,
  item: Omit<WishlistContextItem, "id">
): Promise<WishlistContextItem | null> {
  const res = await fetch("/api/wishlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, ...item }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.item ?? null;
}

async function apiRemoveFromWishlist(
  sessionId: string,
  productId: string
): Promise<boolean> {
  const res = await fetch(
    `/api/wishlist?sessionId=${encodeURIComponent(sessionId)}&productId=${encodeURIComponent(productId)}`,
    { method: "DELETE" }
  );
  return res.ok;
}

/* ── Context ─────────────────────────────────────────────── */

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistContextItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState("");

  // Initialize sessionId on mount
  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  // Sync with API on mount (once sessionId is set)
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    async function sync() {
      setIsLoading(true);
      const items = await fetchWishlist(sessionId);
      if (!cancelled) {
        setWishlistItems(items);
        setIsLoading(false);
      }
    }

    sync();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const addToWishlist = useCallback(
    async (item: Omit<WishlistContextItem, "id">) => {
      const sid = sessionId || getSessionId();
      if (!sid) return;

      // Optimistic update
      setWishlistItems((prev) => {
        if (prev.some((i) => i.productId === item.productId)) return prev;
        return [
          { ...item, id: `opt-${item.productId}` },
          ...prev,
        ];
      });

      const result = await apiAddToWishlist(sid, item);
      if (result) {
        setWishlistItems((prev) =>
          prev.map((i) =>
            i.productId === item.productId ? result : i
          )
        );
      } else {
        // Revert on failure
        setWishlistItems((prev) =>
          prev.filter((i) => i.productId !== item.productId)
        );
      }
    },
    [sessionId]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      const sid = sessionId || getSessionId();
      if (!sid) return;

      // Optimistic update
      setWishlistItems((prev) =>
        prev.filter((i) => i.productId !== productId)
      );

      const ok = await apiRemoveFromWishlist(sid, productId);
      if (!ok) {
        // Re-fetch on failure
        const items = await fetchWishlist(sid);
        setWishlistItems(items);
      }
    },
    [sessionId]
  );

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlistItems.some((i) => i.productId === productId);
    },
    [wishlistItems]
  );

  const wishlistCount = wishlistItems.length;

  const value = useMemo<WishlistContextValue>(
    () => ({
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      wishlistCount,
      isLoading,
    }),
    [wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, wishlistCount, isLoading]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
