"use client";

import { useState, useCallback, type FormEvent } from "react";
import { Button } from "./Button";
import { NEWSLETTER } from "@/lib/constants";

interface NewsletterFormProps {
  className?: string;
  variant?: "default" | "inline";
}

type FormStatus = "idle" | "loading" | "success" | "error";

export function NewsletterForm({
  className = "",
  variant = "default",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      // Basic client-side validation
      if (!email.includes("@") || !email.includes(".")) {
        setStatus("error");
        setMessage("Please enter a valid email address.");
        return;
      }

      setStatus("loading");
      setMessage("");

      try {
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || NEWSLETTER.successMessage);
          setEmail("");
        } else {
          setStatus("error");
          setMessage(data.error || "Something went wrong.");
        }
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    },
    [email]
  );

  const isInline = variant === "inline";

  return (
    <form
      onSubmit={handleSubmit}
      className={`${isInline ? "flex gap-3" : "flex flex-col gap-3"} ${className}`}
    >
      {/* Hidden when success in default variant */}
      {!(status === "success" && !isInline) && (
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") {
                setStatus("idle");
                setMessage("");
              }
            }}
            placeholder={NEWSLETTER.placeholder}
            required
            disabled={status === "loading"}
            className={`w-full rounded-xl border bg-ds-black-elevated px-4 py-3 text-sm text-ds-white placeholder-ds-gray-500 transition-all focus:outline-none disabled:opacity-50 ${
              status === "error"
                ? "border-ds-red-500/50"
                : "border-white/[0.08] focus:border-ds-red/50"
            } ${status === "success" ? "border-ds-red/30 shadow-brand-glow-sm" : ""}`}
          />
          {/* Loading spinner inside input */}
          {status === "loading" && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-ds-gray-600 border-t-ds-red" />
            </div>
          )}
        </div>
      )}

      {/* Submit button — shows different content per status */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        disabled={status === "loading"}
        className={`${isInline ? "shrink-0" : "w-full"} transition-all duration-300 ${
          status === "success" ? "bg-green-600 hover:bg-green-700" : ""
        }`}
      >
        {status === "loading" ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing up…
          </span>
        ) : status === "success" ? (
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            You&apos;re in
          </span>
        ) : status === "error" ? (
          NEWSLETTER.buttonText
        ) : (
          NEWSLETTER.buttonText
        )}
      </Button>

      {/* Status messages */}
      {status === "success" && !isInline && (
        <p className="text-center text-sm font-medium text-green-400 animate-fade-in-up">
          {message || NEWSLETTER.successMessage}
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-sm text-ds-red-400 animate-fade-in-up">
          {message || "Something went wrong."}
        </p>
      )}

      {/* Inline success message */}
      {status === "success" && isInline && (
        <p className="mt-1 text-sm text-green-400 animate-fade-in-up">
          {message || NEWSLETTER.successMessage}
        </p>
      )}
    </form>
  );
}
