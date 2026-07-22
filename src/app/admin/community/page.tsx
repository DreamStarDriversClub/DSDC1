import type { Metadata } from "next";
import { CommunityModeration } from "@/components/admin/CommunityModeration";

export const metadata: Metadata = {
  title: "Community Moderation — Admin | Dream Star Drivers Club",
};

export const dynamic = "force-dynamic";

export default function AdminCommunityPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Community
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Moderate team registrations and event submissions
        </p>
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-ds-black-charcoal p-6">
        <CommunityModeration />
      </div>
    </div>
  );
}
