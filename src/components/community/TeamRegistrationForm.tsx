"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function TeamRegistrationForm() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    goals: "",
    location: "",
    contactEmail: "",
    logoUrl: "",
    socialInstagram: "",
    socialYoutube: "",
    socialTiktok: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const socialLinks: Record<string, string> = {};
      if (form.socialInstagram) socialLinks.instagram = form.socialInstagram;
      if (form.socialYoutube) socialLinks.youtube = form.socialYoutube;
      if (form.socialTiktok) socialLinks.tiktok = form.socialTiktok;

      const res = await fetch("/api/community/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          goals: form.goals || null,
          location: form.location,
          contactEmail: form.contactEmail,
          logoUrl: form.logoUrl || null,
          socialLinks,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to register team" });
      } else {
        setMessage({
          type: "success",
          text: "Team submitted for review! We'll notify you when it's approved.",
        });
        setForm({
          name: "",
          description: "",
          goals: "",
          location: "",
          contactEmail: "",
          logoUrl: "",
          socialInstagram: "",
          socialYoutube: "",
          socialTiktok: "",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/[0.08] bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-500 focus:border-ds-red/40 focus:outline-none focus:ring-1 focus:ring-ds-red/20";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-400"
              : "border-red-500/30 bg-red-500/10 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Team Name */}
      <div>
        <label htmlFor="name" className={labelClass}>Team Name *</label>
        <input
          id="name"
          type="text"
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className={inputClass}
          placeholder="e.g. Desert Drift Squad"
        />
      </div>

      {/* Description / Story */}
      <div>
        <label htmlFor="description" className={labelClass}>Team Story *</label>
        <textarea
          id="description"
          required
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className={inputClass}
          placeholder="Tell us about your crew — what you drive, what you're about, and what makes your team unique..."
        />
      </div>

      {/* Goals */}
      <div>
        <label htmlFor="goals" className={labelClass}>Team Goals</label>
        <textarea
          id="goals"
          rows={3}
          value={form.goals}
          onChange={(e) => update("goals", e.target.value)}
          className={inputClass}
          placeholder="What are your team's goals? Build plans, event aspirations, community initiatives..."
        />
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className={labelClass}>Location *</label>
        <input
          id="location"
          type="text"
          required
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          className={inputClass}
          placeholder="e.g. Las Vegas, NV"
        />
      </div>

      {/* Contact Email */}
      <div>
        <label htmlFor="contactEmail" className={labelClass}>Contact Email *</label>
        <input
          id="contactEmail"
          type="email"
          required
          value={form.contactEmail}
          onChange={(e) => update("contactEmail", e.target.value)}
          className={inputClass}
          placeholder="team@example.com"
        />
      </div>

      {/* Logo URL */}
      <div>
        <label htmlFor="logoUrl" className={labelClass}>Logo URL</label>
        <input
          id="logoUrl"
          type="url"
          value={form.logoUrl}
          onChange={(e) => update("logoUrl", e.target.value)}
          className={inputClass}
          placeholder="https://example.com/logo.png"
        />
      </div>

      {/* Social Links */}
      <div>
        <p className={labelClass}>Social Links</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="socialInstagram" className="mb-1 block text-[10px] uppercase tracking-wider text-ds-gray-500">
              Instagram
            </label>
            <input
              id="socialInstagram"
              type="url"
              value={form.socialInstagram}
              onChange={(e) => update("socialInstagram", e.target.value)}
              className={inputClass}
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label htmlFor="socialYoutube" className="mb-1 block text-[10px] uppercase tracking-wider text-ds-gray-500">
              YouTube
            </label>
            <input
              id="socialYoutube"
              type="url"
              value={form.socialYoutube}
              onChange={(e) => update("socialYoutube", e.target.value)}
              className={inputClass}
              placeholder="https://youtube.com/@..."
            />
          </div>
          <div>
            <label htmlFor="socialTiktok" className="mb-1 block text-[10px] uppercase tracking-wider text-ds-gray-500">
              TikTok
            </label>
            <input
              id="socialTiktok"
              type="url"
              value={form.socialTiktok}
              onChange={(e) => update("socialTiktok", e.target.value)}
              className={inputClass}
              placeholder="https://tiktok.com/@..."
            />
          </div>
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Submitting..." : "Submit Team for Review"}
      </Button>
    </form>
  );
}
