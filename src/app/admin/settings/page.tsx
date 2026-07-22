import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ds-white">
          Settings
        </h1>
        <p className="mt-1 text-sm text-ds-gray-400">
          Store configuration and preferences
        </p>
      </div>
      <SettingsForm />
    </div>
  );
}
