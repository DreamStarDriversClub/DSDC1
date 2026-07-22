"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { submitEvent } from "@/lib/actions/community";

interface ApprovedTeam {
  id: string;
  name: string;
}

interface EventSubmissionFormProps {
  approvedTeams: ApprovedTeam[];
}

const EVENT_TYPES = [
  { value: "meet", label: "Meet" },
  { value: "track day", label: "Track Day" },
  { value: "night run", label: "Night Run" },
  { value: "show", label: "Show" },
  { value: "other", label: "Other" },
] as const;

export function EventSubmissionForm({ approvedTeams }: EventSubmissionFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[] | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrors(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await submitEvent(formData);

      if (result && !result.success) {
        setErrors(result.errors ?? ["Something went wrong."]);
      } else {
        // Server action redirects on success — this is a fallback
        setSuccess(true);
        e.currentTarget.reset();
      }
    } catch (err) {
      setErrors(["Network error. Please try again."]);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/[0.08] bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-500 focus:border-ds-red/40 focus:outline-none focus:ring-1 focus:ring-ds-red/20 transition-colors";
  const labelClass =
    "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-400";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Messages ────────────────────────────────────────── */}
      {errors && errors.length > 0 && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <ul className="list-inside list-disc space-y-1">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Event submitted for review! Redirecting…
        </div>
      )}

      {/* ── Event Title ──────────────────────────────────────── */}
      <div>
        <label htmlFor="title" className={labelClass}>
          Event Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          minLength={3}
          className={inputClass}
          placeholder="e.g. Rotary Reunion Meet"
        />
      </div>

      {/* ── Description ──────────────────────────────────────── */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          minLength={10}
          className={inputClass}
          placeholder="Give the community the details — what to expect, what to bring, any special instructions…"
        />
      </div>

      {/* ── Event Type ───────────────────────────────────────── */}
      <div>
        <label htmlFor="eventType" className={labelClass}>
          Event Type *
        </label>
        <select
          id="eventType"
          name="eventType"
          required
          className={inputClass}
          defaultValue=""
        >
          <option value="" disabled>
            Select event type…
          </option>
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* ── Date & Time ──────────────────────────────────────── */}
      <div>
        <label htmlFor="eventDate" className={labelClass}>
          Date &amp; Time *
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="datetime-local"
          required
          className={inputClass}
        />
        <p className="mt-1 text-xs text-ds-gray-500">
          Local timezone. Select the exact date and start time.
        </p>
      </div>

      {/* ── Location ─────────────────────────────────────────── */}
      <div>
        <label htmlFor="location" className={labelClass}>
          Location *
        </label>
        <input
          id="location"
          name="location"
          type="text"
          required
          className={inputClass}
          placeholder="e.g. SpeedVegas, Mt Charleston, LVMS"
        />
      </div>

      {/* ── Team Association ─────────────────────────────────── */}
      {approvedTeams.length > 0 && (
        <div>
          <label htmlFor="teamId" className={labelClass}>
            Team Association
          </label>
          <select
            id="teamId"
            name="teamId"
            className={inputClass}
            defaultValue=""
          >
            <option value="">— None / Independent —</option>
            {approvedTeams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-ds-gray-500">
            Optional — link this event to your approved team.
          </p>
        </div>
      )}

      {/* ── Submit ───────────────────────────────────────────── */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Submitting…" : "Submit Event for Review"}
        </Button>
        <p className="hidden text-xs text-ds-gray-500 sm:block">
          All events are reviewed before appearing on the community page.
        </p>
      </div>
    </form>
  );
}
