"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "./actions";

export function AdminInstagramForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setUploading(true);
    setError(null);
    setSuccess(false);

    const result = await createPost(formData);

    if (result.error) {
      setError(result.error);
      setUploading(false);
      return;
    }

    setSuccess(true);
    setPreview(null);
    formRef.current?.reset();
    router.refresh();
    setUploading(false);

    // Clear success message after 3s
    setTimeout(() => setSuccess(false), 3000);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setError(null);
    } else {
      setPreview(null);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-5">
      {/* Image upload */}
      <div>
        <label
          htmlFor="image"
          className="mb-2 block text-sm font-medium text-ds-gray-300"
        >
          Image <span className="text-ds-red">*</span>
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          required
          className="block w-full cursor-pointer rounded-xl border border-white/[0.08] bg-ds-black
            text-sm text-ds-gray-400
            file:mr-4 file:cursor-pointer file:border-0 file:bg-ds-red file:px-4 file:py-2.5
            file:text-sm file:font-semibold file:text-white
            hover:file:bg-ds-red-700
            focus:outline-none focus:ring-2 focus:ring-ds-red/50"
        />

        {/* Preview */}
        {preview && (
          <div className="mt-3 overflow-hidden rounded-xl border border-white/[0.06]">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 w-full object-contain bg-ds-black"
            />
          </div>
        )}
      </div>

      {/* Caption */}
      <div>
        <label
          htmlFor="caption"
          className="mb-2 block text-sm font-medium text-ds-gray-300"
        >
          Caption
        </label>
        <input
          type="text"
          id="caption"
          name="caption"
          placeholder="e.g., Fresh RX-7 build at C&C"
          maxLength={200}
          className="block w-full rounded-xl border border-white/[0.08] bg-ds-black px-4 py-3
            text-sm text-ds-white placeholder:text-ds-gray-600
            focus:border-ds-red/40 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
        />
      </div>

      {/* Instagram link */}
      <div>
        <label
          htmlFor="link"
          className="mb-2 block text-sm font-medium text-ds-gray-300"
        >
          Instagram Link
        </label>
        <input
          type="url"
          id="link"
          name="link"
          placeholder="https://www.instagram.com/p/..."
          className="block w-full rounded-xl border border-white/[0.08] bg-ds-black px-4 py-3
            text-sm text-ds-white placeholder:text-ds-gray-600
            focus:border-ds-red/40 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
        />
        <p className="mt-1 text-xs text-ds-gray-600">
          Optional — link to the Instagram post.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-xl border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          Post created successfully!
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={uploading}
        className="inline-flex items-center gap-2 rounded-xl bg-ds-red px-6 py-3 text-sm font-semibold
          text-white shadow-brand-glow-sm transition-all duration-300
          hover:bg-ds-red-700 hover:shadow-brand-glow
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-red/60
          disabled:cursor-not-allowed disabled:opacity-50"
      >
        {uploading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
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
            Uploading...
          </>
        ) : (
          <>
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload Post
          </>
        )}
      </button>
    </form>
  );
}
