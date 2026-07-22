"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const SETTING_FIELDS = [
  { key: "store_name", label: "Store Name", type: "text", placeholder: "Dream Star Drivers Club" },
  { key: "support_email", label: "Support Email", type: "email", placeholder: "support@dreamstardc.com" },
  { key: "currency", label: "Currency", type: "text", placeholder: "USD" },
  { key: "free_shipping_threshold", label: "Free Shipping Threshold ($)", type: "number", placeholder: "75" },
  { key: "tax_display", label: "Tax Display", type: "select", placeholder: "", options: ["inclusive", "exclusive"] },
  { key: "instagram_url", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/dreamstardc" },
  { key: "youtube_url", label: "YouTube URL", type: "url", placeholder: "https://youtube.com/@dreamstardc" },
  { key: "tiktok_url", label: "TikTok URL", type: "url", placeholder: "https://tiktok.com/@dreamstardc" },
];

export function SettingsForm() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setSettings(data.settings ?? {});
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  function getValue(key: string): string {
    return settings[key] ?? "";
  }

  function setValue(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSuccess("");
  }

  async function saveAll() {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // Save each setting one by one
      for (const field of SETTING_FIELDS) {
        const value = settings[field.key] ?? "";
        const res = await fetch("/api/admin/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: field.key, value }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? `Failed to save ${field.key}`);
        }
      }
      setSuccess("Settings saved successfully");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {success}
        </div>
      )}

      <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SETTING_FIELDS.map((field) => (
            <div key={field.key}>
              {field.type === "select" ? (
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                    {field.label}
                  </label>
                  <select
                    value={getValue(field.key)}
                    onChange={(e) => setValue(field.key, e.target.value)}
                    className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                  >
                    {(field.options ?? []).map((opt) => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <Input
                  label={field.label}
                  type={field.type}
                  value={getValue(field.key)}
                  onChange={(e) => setValue(field.key, e.target.value)}
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={saveAll} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}
