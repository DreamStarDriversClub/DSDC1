"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
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

export function AdminReviewsClient() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "unpublished">("all");

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reviews");
      const data = await res.json();
      setReviews(data.reviews ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function togglePublish(review: Review) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id, published: !review.published }),
    });
    fetchReviews();
  }

  const filtered =
    filter === "all"
      ? reviews
      : filter === "published"
        ? reviews.filter((r) => r.published)
        : reviews.filter((r) => !r.published);

  const publishedCount = reviews.filter((r) => r.published).length;
  const unpublishedCount = reviews.filter((r) => !r.published).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ds-white">
            {reviews.length} review{reviews.length !== 1 ? "s" : ""} total
          </h2>
          <p className="text-xs text-ds-gray-500">
            {publishedCount} published &middot; {unpublishedCount} unpublished
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "published", "unpublished"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              filter === f
                ? "bg-ds-red text-white"
                : "bg-ds-black-charcoal text-ds-gray-400 hover:text-ds-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal py-20 text-center">
          <p className="text-sm text-ds-gray-500">No reviews found for this filter.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-ds-black/30">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Product
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Author
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Rating
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Review
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((review) => (
                  <tr key={review.id} className="border-b border-white/[0.03]">
                    <td className="px-5 py-3 text-ds-gray-400 font-mono text-xs">
                      {review.productId.slice(0, 12)}...
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-ds-white">{review.authorName}</span>
                      {review.authorEmail && (
                        <span className="block text-xs text-ds-gray-500">
                          {review.authorEmail}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <ReviewStars rating={review.rating} size="sm" />
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      {review.title && (
                        <p className="text-ds-white font-medium text-xs mb-0.5">
                          {review.title}
                        </p>
                      )}
                      <p className="text-ds-gray-400 text-xs truncate">
                        {review.body.slice(0, 80)}
                        {review.body.length > 80 ? "..." : ""}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          review.published
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {review.published ? "Published" : "Hidden"}
                      </span>
                      {review.verified && (
                        <span className="ml-1 inline-flex rounded-full border border-ds-gold/30 bg-ds-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-gold">
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-ds-gray-400 text-xs whitespace-nowrap">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePublish(review)}
                          className="rounded px-2 py-1 text-xs text-ds-gray-400 hover:bg-ds-white/[0.04] hover:text-ds-white"
                        >
                          {review.published ? "Hide" : "Publish"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
