"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./Button";
import { NEWSLETTER } from "@/lib/constants";

interface NewsletterFormProps {
  className?: string;
  variant?: "default" | "inline";
}

export function NewsletterForm({
  className = "",
  variant = "default",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Placeholder — will be wired to API later
    if (email.includes("@")) {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    } else {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${variant === "inline" ? "flex gap-3" : "flex flex-col gap-3"} ${className}`}
    >
      <div className="relative flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={NEWSLETTER.placeholder}
          required
          className="w-full rounded-xl border border-white/[0.08] bg-ds-black-elevated px-4 py-3 text-sm text-ds-white placeholder-ds-gray-500 transition-colors focus:border-ds-red/50 focus:outline-none"
        />
      </div>
      <Button
        type="submit"
        variant={variant === "inline" ? "primary" : "primary"}
        size="md"
        className={variant === "inline" ? "shrink-0" : "w-full"}
      >
        {status === "success"
          ? "✓ Signed Up!"
          : status === "error"
            ? "Invalid email"
            : NEWSLETTER.buttonText}
      </Button>
    </form>
  );
}
