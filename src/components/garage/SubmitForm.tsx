"use client";

import { useState, type FormEvent } from "react";

interface SubmitFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubmitForm({ open, onClose, onSuccess }: SubmitFormProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerInstagram, setOwnerInstagram] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!imageUrl.trim()) {
      setError("Image URL is required");
      return;
    }
    if (!carMake.trim()) {
      setError("Car make is required");
      return;
    }
    if (!carModel.trim()) {
      setError("Car model is required");
      return;
    }
    if (!ownerName.trim()) {
      setError("Your name is required");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/garage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl: imageUrl.trim(),
          carMake: carMake.trim(),
          carModel: carModel.trim(),
          ownerName: ownerName.trim(),
          ownerInstagram: ownerInstagram.trim() || undefined,
          caption: caption.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setSuccess(true);
      setImageUrl("");
      setCarMake("");
      setCarModel("");
      setOwnerName("");
      setOwnerInstagram("");
      setCaption("");

      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (!submitting) {
      setError("");
      setSuccess(false);
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-90 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-scale-in rounded-2xl border border-white/[0.08] bg-ds-black-elevated shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ds-white">
              Submit Your Build
            </h2>
            <p className="text-xs text-ds-gray-500">
              Show the community what you&apos;re driving
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-ds-gray-400 transition-colors hover:bg-ds-white/5 hover:text-ds-white disabled:opacity-50"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ds-red/20">
                <svg className="h-8 w-8 text-ds-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ds-white">
                Your build has been submitted for review!
              </h3>
              <p className="mt-1 text-sm text-ds-gray-400">
                It will appear in the garage once approved.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image URL */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ds-gray-400">
                  Image URL <span className="text-ds-red">*</span>
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://i.imgur.com/your-photo.jpg"
                  className="w-full rounded-lg border border-white/[0.08] bg-ds-black-charcoal px-4 py-2.5 text-sm text-ds-white placeholder:text-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                  required
                />
              </div>

              {/* Car Make / Model row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ds-gray-400">
                    Car Make <span className="text-ds-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={carMake}
                    onChange={(e) => setCarMake(e.target.value)}
                    placeholder="Mazda"
                    className="w-full rounded-lg border border-white/[0.08] bg-ds-black-charcoal px-4 py-2.5 text-sm text-ds-white placeholder:text-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ds-gray-400">
                    Car Model <span className="text-ds-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="RX-7 FD3S"
                    className="w-full rounded-lg border border-white/[0.08] bg-ds-black-charcoal px-4 py-2.5 text-sm text-ds-white placeholder:text-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                    required
                  />
                </div>
              </div>

              {/* Owner Name */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ds-gray-400">
                  Your Name <span className="text-ds-red">*</span>
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Keisuke Takahashi"
                  className="w-full rounded-lg border border-white/[0.08] bg-ds-black-charcoal px-4 py-2.5 text-sm text-ds-white placeholder:text-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                  required
                />
              </div>

              {/* Instagram (optional) */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ds-gray-400">
                  Instagram <span className="text-ds-gray-600">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-ds-gray-600">
                    @
                  </span>
                  <input
                    type="text"
                    value={ownerInstagram}
                    onChange={(e) => setOwnerInstagram(e.target.value)}
                    placeholder="yourhandle"
                    className="w-full rounded-lg border border-white/[0.08] bg-ds-black-charcoal py-2.5 pl-8 pr-4 text-sm text-ds-white placeholder:text-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                  />
                </div>
              </div>

              {/* Caption (optional) */}
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ds-gray-400">
                  Caption <span className="text-ds-gray-600">(optional)</span>
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tell us about your build..."
                  rows={3}
                  className="w-full resize-none rounded-lg border border-white/[0.08] bg-ds-black-charcoal px-4 py-2.5 text-sm text-ds-white placeholder:text-ds-gray-600 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                />
              </div>

              {/* Error */}
              {error && (
                <p className="rounded-lg bg-ds-red/10 px-4 py-2 text-sm text-ds-red">
                  {error}
                </p>
              )}

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  className="flex-1 rounded-lg border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-ds-gray-300 transition-colors hover:bg-ds-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-lg bg-ds-red px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-ds-red-500 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Build"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
