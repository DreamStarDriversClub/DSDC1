import { getAuthenticatedUser } from "@/lib/auth";
import SettingsClient from "./SettingsClient";
import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your Dream Star Drivers Club account settings.",
};

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  return (
    <SettingsClient
      user={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      }}
    />
  );
}
