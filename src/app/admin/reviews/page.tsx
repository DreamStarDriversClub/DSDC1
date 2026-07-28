import { AdminReviewsClient } from "./AdminReviewsClient";

export const dynamic = "force-dynamic";

export default function AdminReviewsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Reviews
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Moderate and manage customer reviews
        </p>
      </div>
      <AdminReviewsClient />
    </div>
  );
}
