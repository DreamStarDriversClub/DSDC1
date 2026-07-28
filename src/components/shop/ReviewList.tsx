"use client";

import { useState, useEffect, useCallback } from "react";
import { ReviewStars } from "@/components/shop/ReviewStars";

interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string | null;
  body: string;
  authorName: string;
  authorEmail: string | null;
  verified: boolean;
  published: boolean;
  createdAt: string;
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

interface ReviewListProps {
  productId: string;
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);

  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return "just now";
}

export function ReviewList({ productId }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/reviews?productId=${encodeURIComponent(productId)}&published=true`,
      );
      if (!res.ok) return;
      const data = await res.json();
      setReviews(data.reviews ?? []);
      setStats(
        data.stats ?? {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        },
      );
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (stats.totalReviews === 0) {
    return (
      <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal px-6 py-12 text-center">
        <svg className="mx-auto h-10 w-10 text-ds-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
        <p className="mt-4 text-sm text-ds-gray-400">
          No reviews yet. Be the first to share your experience.
        </p>
      </div>
    );
  }

  // Bar chart for rating distribution
  const maxCount = Math.max(...Object.values(stats.ratingDistribution), 1);

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Left: Average */}
        <div className="flex items-center gap-5 rounded-xl border border-white/[0.06] bg-ds-charcoal px-6 py-5">
          <div className="text-center">
            <div className="text-4xl font-black text-ds-white">
              {stats.averageRating.toFixed(1)}
            </div>
            <ReviewStars rating={stats.averageRating} size="sm" className="mt-1 justify-center" />
            <p className="mt-1 text-xs text-ds-gray-500">
              {stats.totalReviews} review{stats.totalReviews !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = stats.ratingDistribution[star] || 0;
              const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-right text-ds-gray-400">{star}</span>
                  <svg className="h-3 w-3 shrink-0 text-ds-red" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex-1 h-2 rounded-full bg-ds-black overflow-hidden">
                    <div
                      className="h-full rounded-full bg-ds-red"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-ds-gray-500">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Summary text */}
        <div className="flex items-center justify-center rounded-xl border border-white/[0.06] bg-ds-charcoal px-6 py-5">
          <p className="text-center text-sm text-ds-gray-300">
            {stats.averageRating >= 4
              ? "Customers love this product!"
              : stats.averageRating >= 3
                ? "Customers rate this product well."
                : "See what customers are saying."}
          </p>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ds-red/20 text-sm font-bold text-ds-red">
                  {review.authorName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-ds-white truncate">
                      {review.authorName}
                    </p>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-ds-gold/10 px-2 py-0.5 text-[10px] font-semibold text-ds-gold">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.403 5.387a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.11-.194z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <ReviewStars rating={review.rating} size="sm" />
                    <span className="text-xs text-ds-gray-500">
                      {relativeTime(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {review.title && (
              <p className="mt-3 text-sm font-semibold text-ds-gray-200">
                {review.title}
              </p>
            )}
            <p className="mt-1 text-sm leading-relaxed text-ds-gray-300">
              {review.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
