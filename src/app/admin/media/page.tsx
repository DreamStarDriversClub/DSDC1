"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

interface MediaItem {
  url: string;
  filename: string;
  size: number;
  uploadedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminMediaPage() {
  const [images, setImages] = useState<MediaItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/media?page=${p}&limit=50`);
      const data = await res.json();
      setImages(data.images ?? []);
      setPagination(data.pagination ?? null);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages(page);
  }, [page, fetchImages]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Upload failed");
      }

      // Reset and refresh
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchImages(page);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch("/api/admin/media", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: deleteTarget.filename }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Delete failed");
      }

      setDeleteTarget(null);
      fetchImages(page);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
            Media Library
          </h1>
          <p className="mt-1 text-sm text-ds-gray-400">
            Upload and manage images for your products and content
          </p>
        </div>
        <label className={`inline-flex cursor-pointer items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all duration-200 bg-ds-red text-white hover:bg-ds-red-700 border-transparent ${uploading ? "pointer-events-none opacity-40" : ""}`}>
          {uploading ? "Uploading..." : "+ Upload Image"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {uploadError && (
        <div className="mb-4 rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {uploadError}
          <button onClick={() => setUploadError("")} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : images.length === 0 ? (
          <div className="py-20 text-center">
            <svg
              className="mx-auto h-12 w-12 text-ds-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <p className="mt-4 text-sm text-ds-gray-500">
              No images yet. Upload your first image.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {images.map((img) => (
                <div
                  key={img.filename}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-white/[0.06] bg-ds-black/30"
                >
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-ds-black/90 via-ds-black/20 to-transparent p-2 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => copyUrl(img.url)}
                        className="rounded bg-ds-black/70 p-1.5 text-ds-gray-300 backdrop-blur-sm transition-colors hover:bg-ds-white/10 hover:text-ds-white"
                        title="Copy URL"
                      >
                        {copiedUrl === img.url ? (
                          <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => setDeleteTarget(img)}
                        className="rounded bg-ds-black/70 p-1.5 text-ds-gray-300 backdrop-blur-sm transition-colors hover:bg-ds-red/20 hover:text-ds-red"
                        title="Delete"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                    <div>
                      <p className="truncate text-[10px] text-ds-gray-500">{img.filename}</p>
                      <p className="text-[10px] text-ds-gray-600">{formatSize(img.size)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-3">
                <p className="text-xs text-ds-gray-500">
                  {pagination.total} images
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-ds-gray-400 transition-colors hover:bg-ds-white/[0.06] hover:text-ds-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-2 text-xs text-ds-gray-400">
                    {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="rounded-md px-3 py-1.5 text-xs font-medium text-ds-gray-400 transition-colors hover:bg-ds-white/[0.06] hover:text-ds-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Image"
        size="sm"
        actions={
          <>
            <Button variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-ds-gray-300">
          Are you sure you want to delete{" "}
          <span className="font-mono text-ds-white">{deleteTarget?.filename}</span>?
        </p>
        {deleteTarget && (
          <div className="mt-3 aspect-square w-32 overflow-hidden rounded-lg border border-white/[0.06]">
            <img src={deleteTarget.url} alt={deleteTarget.filename} className="h-full w-full object-cover" />
          </div>
        )}
      </Modal>
    </div>
  );
}
