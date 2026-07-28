"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";

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

export function AdminGarageClient() {
  const [submissions, setSubmissions] = useState<GarageSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "approved" | "pending">("all");

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/garage");
      const data = await res.json();
      setSubmissions(data.submissions ?? []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  async function toggleApproved(submission: GarageSubmission) {
    await fetch("/api/admin/garage", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: submission.id, approved: !submission.approved }),
    });
    fetchSubmissions();
  }

  const filtered =
    filter === "all"
      ? submissions
      : filter === "approved"
        ? submissions.filter((s) => s.approved)
        : submissions.filter((s) => !s.approved);

  const approvedCount = submissions.filter((s) => s.approved).length;
  const pendingCount = submissions.filter((s) => !s.approved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ds-white">
            {submissions.length} submission{submissions.length !== 1 ? "s" : ""}{" "}
            total
          </h2>
          <p className="text-xs text-ds-gray-500">
            {approvedCount} approved &middot; {pendingCount} pending
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "approved", "pending"] as const).map((f) => (
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
          <svg
            className="h-6 w-6 animate-spin text-ds-red"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal py-20 text-center">
          <p className="text-sm text-ds-gray-500">
            No submissions found for this filter.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-ds-black/30">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Image
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Owner
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Car
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Caption
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">
                    Likes
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
                {filtered.map((sub) => (
                  <tr key={sub.id} className="border-b border-white/[0.03]">
                    <td className="px-5 py-3">
                      <img
                        src={sub.imageUrl}
                        alt=""
                        className="h-10 w-14 rounded-lg object-cover"
                        loading="lazy"
                      />
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-ds-white">{sub.ownerName}</span>
                      {sub.ownerInstagram && (
                        <span className="block text-xs text-ds-gray-500">
                          @{sub.ownerInstagram}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-ds-gray-300">
                      {sub.carMake} {sub.carModel}
                    </td>
                    <td className="max-w-xs px-5 py-3">
                      <p className="text-ds-gray-400 truncate text-xs">
                        {sub.caption || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-ds-gray-300">
                      {sub.likes}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          sub.approved
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                        }`}
                      >
                        {sub.approved ? "Approved" : "Pending"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-xs text-ds-gray-400">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleApproved(sub)}
                          className="rounded px-2 py-1 text-xs text-ds-gray-400 hover:bg-ds-white/[0.04] hover:text-ds-white"
                        >
                          {sub.approved ? "Reject" : "Approve"}
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
