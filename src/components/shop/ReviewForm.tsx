"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ReviewStars } from "@/components/shop/ReviewStars";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a star rating");
      return;
    }
    if (body.trim().length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }
    if (!authorName.trim()) {
      setError("Please enter your name");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim() || undefined,
          body: body.trim(),
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setBody("");
      setAuthorName("");
      setAuthorEmail("");
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-ds-gold/20 bg-ds-gold/5 px-6 py-8 text-center">
        <svg className="mx-auto h-10 w-10 text-ds-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-3 text-lg font-semibold text-ds-white">Review Submitted!</h3>
        <p className="mt-1 text-sm text-ds-gray-400">
          Thank you for sharing your experience. Your review helps the community.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h3 className="font-display text-xl font-bold text-ds-white">
        Write a Review
      </h3>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}

      {/* Star Rating */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
          Rating
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-110 focus:outline-none"
              aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
            >
              <svg
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating) ? "text-ds-red" : "text-ds-gray-700"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <Input
        label="Review Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Sum up your experience..."
        maxLength={100}
      />

      {/* Body */}
      <div>
        <label
          htmlFor="review-body"
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300"
        >
          Your Review *
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Tell others about your experience with this product..."
          maxLength={1000}
          className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
        />
        <p className="mt-1 text-xs text-ds-gray-500">
          {body.length}/1000 characters (min 10)
        </p>
      </div>

      {/* Author Name */}
      <Input
        label="Your Name *"
        value={authorName}
        onChange={(e) => setAuthorName(e.target.value)}
        placeholder="How should we display your name?"
        maxLength={50}
      />

      {/* Author Email */}
      <Input
        label="Email (optional, for verified purchase)"
        type="email"
        value={authorEmail}
        onChange={(e) => setAuthorEmail(e.target.value)}
        placeholder="your@email.com"
        maxLength={100}
      />

      <Button type="submit" disabled={submitting} size="md">
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
