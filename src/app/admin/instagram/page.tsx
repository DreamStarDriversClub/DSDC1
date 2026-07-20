import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { AdminInstagramForm } from "./AdminInstagramForm";

export const dynamic = "force-dynamic";

export default async function AdminInstagramPage() {
  const user = await getAuthenticatedUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const posts = await prisma.instagramPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-ds-black-deepest">
      <Container className="py-16">
        {/* Header */}
        <div className="mb-10">
          <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
            Admin
          </span>
          <h1 className="mt-2 font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl">
            Instagram Grid
          </h1>
          <p className="mt-2 text-ds-gray-500">
            Upload and manage images for the homepage Instagram feed.
          </p>
        </div>

        {/* Upload form */}
        <div className="mb-12 rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6 sm:p-8">
          <h2 className="mb-6 font-display text-lg font-bold text-ds-white">
            Upload New Post
          </h2>
          <AdminInstagramForm />
        </div>

        {/* Posts grid */}
        <div>
          <h2 className="mb-6 font-display text-lg font-bold text-ds-white">
            Posts ({posts.length})
          </h2>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/[0.08] bg-ds-black-charcoal p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-ds-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
              </svg>
              <p className="mt-4 text-ds-gray-500">
                No posts yet. Upload your first image above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-ds-black-charcoal"
                >
                  {/* Thumbnail */}
                  <div className="aspect-square">
                    <img
                      src={post.imageUrl}
                      alt={post.caption || "Instagram post"}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Hover overlay with caption & delete */}
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ds-black/90 via-ds-black/40 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {post.caption && (
                      <p className="mb-2 text-xs leading-relaxed text-ds-white">
                        {post.caption}
                      </p>
                    )}
                    <form
                      action={async () => {
                        "use server";
                        const { deletePost } = await import(
                          "@/app/admin/instagram/actions"
                        );
                        await deletePost(post.id);
                      }}
                    >
                      <button
                        type="submit"
                        className="mt-auto inline-flex items-center gap-1 rounded-lg bg-ds-red/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-ds-red"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </form>
                  </div>

                  {/* Link indicator */}
                  {post.link && (
                    <div className="absolute right-2 top-2 rounded-full bg-ds-black/70 p-1 backdrop-blur-sm">
                      <svg
                        className="h-3 w-3 text-ds-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-10 border-t border-white/[0.06] pt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-ds-gray-500 transition-colors hover:text-ds-gray-300"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to site
          </a>
        </div>
      </Container>
    </div>
  );
}
