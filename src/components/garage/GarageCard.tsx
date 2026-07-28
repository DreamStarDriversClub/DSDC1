"use client";

import { useState, useCallback } from "react";

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

interface GarageCardProps {
  submission: GarageSubmission;
  sessionId: string;
  likedBySession: boolean;
  onLikeToggle: (submissionId: string) => void;
}

export function GarageCard({
  submission,
  sessionId,
  likedBySession,
  onLikeToggle,
}: GarageCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal shadow-card transition-all duration-400 hover:shadow-card-hover">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-ds-black-elevated">
        {!imgError ? (
          <img
            src={submission.imageUrl}
            alt={`${submission.carMake} ${submission.carModel} by ${submission.ownerName}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-ds-gray-600">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="p-4">
            <p className="text-sm font-semibold text-ds-white">
              {submission.carMake} {submission.carModel}
            </p>
            {submission.caption && (
              <p className="mt-1 text-xs text-ds-gray-300 line-clamp-2">
                {submission.caption}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Info footer */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ds-white truncate">
            {submission.ownerName}
          </p>
          <p className="text-xs text-ds-gray-500 truncate">
            {submission.carMake} {submission.carModel}
          </p>
        </div>

        {/* Like button */}
        <button
          onClick={() => onLikeToggle(submission.id)}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all hover:bg-ds-red/10"
          aria-label={likedBySession ? "Unlike" : "Like"}
        >
          <svg
            className={`h-4 w-4 transition-colors ${
              likedBySession
                ? "fill-ds-red text-ds-red"
                : "fill-none text-ds-gray-400"
            }`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span
            className={`text-xs font-medium ${
              likedBySession ? "text-ds-red" : "text-ds-gray-400"
            }`}
          >
            {submission.likes}
          </span>
        </button>
      </div>
    </div>
  );
}
