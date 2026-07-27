import { AdminBlogClient } from "./AdminBlogClient";

export const dynamic = "force-dynamic";

export default function AdminBlogPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Blog
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Write and manage blog posts
        </p>
      </div>
      <AdminBlogClient />
    </div>
  );
}
