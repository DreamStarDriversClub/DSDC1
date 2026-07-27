"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tag: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export function AdminBlogClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tag, setTag] = useState("General");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/posts");
      const data = await res.json();
      setPosts(data.posts ?? []);
    } catch {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  function resetForm() {
    setTitle("");
    setExcerpt("");
    setContent("");
    setTag("General");
    setPublished(false);
    setEditing(null);
    setShowForm(false);
    setError("");
  }

  function startEdit(post: Post) {
    setEditing(post);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent("");
    setTag(post.tag);
    setPublished(post.published);
    setShowForm(true);
    // Fetch full post content for editing
    fetch(`/api/admin/posts/${post.id}`)
      .then(r => r.json())
      .then(d => { if (d.post) setContent(d.post.content); });
  }

  async function handleSave() {
    if (!title || !excerpt || !content) {
      setError("Title, excerpt, and content are required");
      return;
    }
    setSaving(true);
    setError("");

    try {
      const url = editing
        ? `/api/admin/posts/${editing.id}`
        : "/api/admin/posts";
      const method = editing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, excerpt, content, tag, published }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? "Save failed");
      }

      resetForm();
      fetchPosts();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  }

  async function togglePublish(post: Post) {
    await fetch(`/api/admin/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    fetchPosts();
  }

  const tags = ["Rotary", "2JZ", "Culture", "Builds", "Events", "Guides", "General"];

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red-400">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-ds-white">
            {posts.length} post{posts.length !== 1 ? "s" : ""}
          </h2>
          <p className="text-xs text-ds-gray-500">Manage blog content</p>
        </div>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            New Post
          </Button>
        )}
      </div>

      {showForm && (
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6 space-y-4">
          <h3 className="text-sm font-semibold text-ds-white">
            {editing ? "Edit Post" : "New Post"}
          </h3>
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
          />
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              placeholder="Brief summary for listing pages..."
              className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
              Content (Markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              placeholder="Write your post in Markdown..."
              className="w-full rounded-lg border border-white/[0.08] bg-ds-black px-4 py-2.5 text-sm text-ds-white font-mono placeholder-ds-gray-600 transition-colors focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            />
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300">
                Tag
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="rounded-lg border border-white/[0.08] bg-ds-black px-3 py-2 text-sm text-ds-white transition-colors focus:border-ds-red/50 focus:outline-none"
              >
                {tags.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 rounded border-white/[0.2] bg-ds-black accent-ds-red"
              />
              <span className="text-sm text-ds-gray-300">Published</span>
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
            <Button size="sm" variant="ghost" onClick={resetForm} disabled={saving}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <svg className="h-6 w-6 animate-spin text-ds-red" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal py-20 text-center">
          <p className="text-sm text-ds-gray-500">No posts yet. Create your first one!</p>
        </div>
      ) : (
        <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-ds-black/30">
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">Title</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">Tag</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">Status</th>
                  <th className="px-5 py-3.5 text-left text-xs font-medium uppercase tracking-wider text-ds-gray-500">Date</th>
                  <th className="px-5 py-3.5 text-right text-xs font-medium uppercase tracking-wider text-ds-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-white/[0.03]">
                    <td className="px-5 py-3 text-ds-white font-medium">{post.title}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex rounded-full border border-ds-red/20 bg-ds-red/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ds-red-400">
                        {post.tag}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        post.published
                          ? "bg-green-500/10 text-green-400 border-green-500/30"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
                      }`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ds-gray-400 text-xs">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => togglePublish(post)}
                          className="rounded px-2 py-1 text-xs text-ds-gray-400 hover:bg-ds-white/[0.04] hover:text-ds-white"
                        >
                          {post.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => startEdit(post)}
                          className="rounded px-2 py-1 text-xs text-ds-gray-400 hover:bg-ds-white/[0.04] hover:text-ds-white"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="rounded px-2 py-1 text-xs text-ds-red-400 hover:bg-ds-red/10"
                        >
                          Delete
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
