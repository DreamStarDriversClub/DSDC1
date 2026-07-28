"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GarageCard } from "./GarageCard";

interface GarageSubmission {
  id: string;
  imageUrl: string;
  carMake: string;
  carModel: string;
  ownerName: string;
  ownerInstagram: string | null;
  caption: string | null;
  likes: number;
  approved: boolean;
  createdAt: string;
}

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("dsdc_garage_session");
  if (!id) {
    id = "sess_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem("dsdc_garage_session", id);
  }
  return id;
}

export function GarageGallery() {
  const [submissions, setSubmissions] = useState<GarageSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const initialLoadDone = useRef(false);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  const fetchSubmissions = useCallback(
    async (cursor?: string, append = false) => {
      if (!append) setLoading(true);
      else setLoadingMore(true);
      setError("");

      try {
        const params = new URLSearchParams({ limit: "12" });
        if (cursor) params.set("cursor", cursor);
        if (sessionId) params.set("sessionId", sessionId);

        const res = await fetch(`/api/garage?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to load");
        const data = await res.json();

        if (append) {
          setSubmissions((prev) => [...prev, ...data.submissions]);
        } else {
          setSubmissions(data.submissions);
        }
        setNextCursor(data.nextCursor);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load gallery");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sessionId]
  );

  // Fetch liked IDs for this session
  const fetchLikedIds = useCallback(async () => {
    if (!sessionId) return;
    try {
      // We store which submission IDs this session has liked via localStorage
      const stored = localStorage.getItem("dsdc_garage_likes");
      if (stored) {
        setLikedIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // ignore
    }
  }, [sessionId]);

  // Initial fetch
  useEffect(() => {
    if (!sessionId) return;
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    fetchSubmissions();
    fetchLikedIds();
  }, [sessionId, fetchSubmissions, fetchLikedIds]);

  const handleLikeToggle = useCallback(
    async (submissionId: string) => {
      const wasLiked = likedIds.has(submissionId);

      // Optimistic update
      const newLikedIds = new Set(likedIds);
      if (wasLiked) {
        newLikedIds.delete(submissionId);
      } else {
        newLikedIds.add(submissionId);
      }
      setLikedIds(newLikedIds);
      localStorage.setItem("dsdc_garage_likes", JSON.stringify([...newLikedIds]));

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId
            ? { ...s, likes: s.likes + (wasLiked ? -1 : 1) }
            : s
        )
      );

      try {
        const res = await fetch("/api/garage/like", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ submissionId, sessionId }),
        });

        if (!res.ok) throw new Error("Failed");

        const data = await res.json();

        // Sync with server state
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === submissionId ? { ...s, likes: data.likes } : s
          )
        );
        if (data.liked) {
          setLikedIds((prev) => new Set([...prev, submissionId]));
          localStorage.setItem(
            "dsdc_garage_likes",
            JSON.stringify([...newLikedIds, submissionId])
          );
        } else {
          setLikedIds((prev) => {
            const next = new Set(prev);
            next.delete(submissionId);
            localStorage.setItem("dsdc_garage_likes", JSON.stringify([...next]));
            return next;
          });
        }
      } catch {
        // Revert optimistic update
        setLikedIds(likedIds);
        localStorage.setItem("dsdc_garage_likes", JSON.stringify([...likedIds]));
        setSubmissions((prev) =>
          prev.map((s) =>
            s.id === submissionId
              ? { ...s, likes: s.likes + (wasLiked ? 1 : -1) }
              : s
          )
        );
      }
    },
    [likedIds, sessionId]
  );

  function handleLoadMore() {
    if (nextCursor) {
      fetchSubmissions(nextCursor, true);
    }
  }

  // Empty state
  if (!loading && submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-6 rounded-full border border-dashed border-ds-gray-700 p-6">
          <svg
            className="h-12 w-12 text-ds-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-ds-white">
          The garage is waiting.
        </h3>
        <p className="mt-2 text-sm text-ds-gray-400">
          Be the first to show your build.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 rounded-xl border border-ds-red/20 bg-ds-red/5 px-4 py-3 text-sm text-ds-red">
          {error}
        </div>
      )}

      {/* Masonry grid using CSS columns */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {submissions.map((submission) => (
          <div key={submission.id} className="mb-4 break-inside-avoid">
            <GarageCard
              submission={submission}
              sessionId={sessionId}
              likedBySession={likedIds.has(submission.id)}
              onLikeToggle={handleLikeToggle}
            />
          </div>
        ))}
      </div>

      {/* Loading skeleton for initial load */}
      {loading && (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="mb-4 break-inside-avoid animate-pulse rounded-2xl border border-white/[0.06] bg-ds-black-charcoal"
            >
              <div className="aspect-[4/3] bg-ds-charcoal" />
              <div className="flex items-center justify-between px-4 py-3">
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-ds-charcoal" />
                  <div className="h-3 w-16 rounded bg-ds-charcoal" />
                </div>
                <div className="h-8 w-12 rounded-full bg-ds-charcoal" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {nextCursor && !loading && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="rounded-full border border-white/[0.08] px-8 py-3 text-sm font-medium text-ds-gray-300 transition-all hover:border-ds-red/30 hover:text-ds-white disabled:opacity-50"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading...
              </span>
            ) : (
              "Load More Builds"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
