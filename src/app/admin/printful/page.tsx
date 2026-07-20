"use client";

import { useState } from "react";

export default function PrintfulSyncPage() {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    syncedCount?: number;
    message?: string;
    error?: string;
  } | null>(null);

  async function handleSync() {
    setSyncing(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/printful/sync", { method: "POST" });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setSyncing(false);
    }
  }

  return (
    <div className="min-h-screen bg-ds-black px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-ds-white">
          Printful Sync
        </h1>
        <p className="mb-8 text-sm text-ds-gray-400">
          Sync all products and variants from your Printful store into the local
          catalog. Existing products are updated; new ones are created.
        </p>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-md bg-ds-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ds-red-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {syncing ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
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
              Syncing…
            </>
          ) : (
            "Sync Products"
          )}
        </button>

        {result && (
          <div
            className={`mt-6 rounded-md border p-4 ${
              result.success
                ? "border-green-800 bg-green-900/20 text-green-400"
                : "border-red-800 bg-red-900/20 text-red-400"
            }`}
          >
            {result.success ? (
              <>
                <p className="font-semibold">Sync complete</p>
                <p className="mt-1 text-sm">{result.message}</p>
              </>
            ) : (
              <>
                <p className="font-semibold">Sync failed</p>
                <p className="mt-1 text-sm">{result.error}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
