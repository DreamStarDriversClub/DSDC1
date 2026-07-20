"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import {
  updateProfileAction,
  changePasswordAction,
  deleteAccountAction,
} from "@/lib/auth-actions";
import { Button } from "@/components/ui/Button";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function SettingsClient({ user }: { user: UserData }) {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "danger">(
    "profile"
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl text-ds-white sm:text-3xl">
        Settings
      </h1>
      <p className="mb-8 text-ds-gray-300">
        Manage your account settings and preferences.
      </p>

      {/* Tabs */}
      <div className="mb-8 flex gap-1 rounded-xl bg-ds-black-darkgray p-1">
        {(["profile", "password", "danger"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-ds-black-charcoal text-ds-white shadow-sm"
                : "text-ds-gray-400 hover:text-ds-gray-300"
            }`}
          >
            {tab === "profile"
              ? "Profile"
              : tab === "password"
                ? "Password"
                : "Danger Zone"}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && <ProfileForm user={user} />}

      {/* Password Tab */}
      {activeTab === "password" && <PasswordForm />}

      {/* Danger Zone */}
      {activeTab === "danger" && (
        <DangerZone
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
        />
      )}
    </div>
  );
}

function ProfileForm({ user }: { user: UserData }) {
  const [state, dispatch] = useFormState(updateProfileAction, {
    success: false,
  });
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6">
      <h2 className="mb-6 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
        Edit Profile
      </h2>

      <form
        action={(fd) => {
          setSubmitting(true);
          dispatch(fd);
        }}
        className="max-w-lg space-y-5"
      >
        {state.success && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            Profile updated successfully!
          </div>
        )}

        {state.error && (
          <div className="rounded-xl border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red">
            {state.error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              required
              defaultValue={user.firstName}
              className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              required
              defaultValue={user.lastName}
              className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            defaultValue={user.email}
            className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
          />
        </div>

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

function PasswordForm() {
  const [state, dispatch] = useFormState(changePasswordAction, {
    success: false,
  });
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6">
      <h2 className="mb-6 text-sm font-semibold text-ds-gray-300 uppercase tracking-wider">
        Change Password
      </h2>

      <form
        action={(fd) => {
          setSubmitting(true);
          dispatch(fd);
        }}
        className="max-w-lg space-y-5"
      >
        {state.success && (
          <div className="rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            Password changed successfully!
          </div>
        )}

        {state.error && (
          <div className="rounded-xl border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red">
            {state.error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
            Current Password
          </label>
          <input
            type="password"
            name="currentPassword"
            required
            className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            placeholder="Enter current password"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
            New Password
          </label>
          <input
            type="password"
            name="newPassword"
            required
            minLength={8}
            className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            placeholder="Min. 8 characters"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ds-gray-300">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            required
            minLength={8}
            className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            placeholder="Re-enter new password"
          />
        </div>

        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Changing Password..." : "Change Password"}
        </Button>
      </form>
    </div>
  );
}

function DangerZone({
  deleteModalOpen,
  setDeleteModalOpen,
}: {
  deleteModalOpen: boolean;
  setDeleteModalOpen: (v: boolean) => void;
}) {
  const [state, dispatch] = useFormState(deleteAccountAction, {
    success: false,
  });
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="rounded-2xl border border-ds-red/20 bg-ds-black-charcoal p-6">
      <h2 className="mb-2 text-sm font-semibold text-ds-red uppercase tracking-wider">
        Danger Zone
      </h2>
      <p className="mb-4 text-sm text-ds-gray-300">
        Once you delete your account, there is no going back. Please be certain.
      </p>

      {!deleteModalOpen ? (
        <Button
          variant="outline"
          size="md"
          className="border-ds-red/40 text-ds-red hover:bg-ds-red/10"
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete Account
        </Button>
      ) : (
        <form
          action={(fd) => {
            setSubmitting(true);
            dispatch(fd);
          }}
          className="space-y-4 rounded-xl border border-ds-red/20 bg-ds-black p-4"
        >
          {state.error && (
            <div className="rounded-xl border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red">
              {state.error}
            </div>
          )}

          <p className="text-sm font-medium text-ds-white">
            Enter your password to confirm account deletion:
          </p>
          <input
            type="password"
            name="password"
            required
            className="w-full rounded-xl border border-ds-red/30 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red focus:outline-none focus:ring-1 focus:ring-ds-red/30"
            placeholder="Your password"
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              variant="primary"
              className="bg-ds-red hover:bg-ds-red-700"
              disabled={submitting}
            >
              {submitting ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
