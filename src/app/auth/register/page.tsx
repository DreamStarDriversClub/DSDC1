"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerAction } from "@/lib/auth-actions";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [state, dispatch] = useFormState(registerAction, { success: false });
  const [submitting, setSubmitting] = useState(false);

  if (state.success) {
    router.push("/account");
    return null;
  }

  return (
    <div className="section-padding">
      <Container>
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl text-ds-white">Join the Club</h1>
            <p className="mt-2 text-ds-gray-400">
              Create your Dream Star Drivers Club account
            </p>
          </div>

          {/* Form */}
          <form
            action={dispatch}
            onSubmit={() => setSubmitting(true)}
            className="space-y-5"
          >
            {state.error && (
              <div className="rounded-xl border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red">
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-1.5 block text-sm font-medium text-ds-gray-300"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-500 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                  placeholder="Keisuke"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-1.5 block text-sm font-medium text-ds-gray-300"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-500 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                  placeholder="Takahashi"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-ds-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-500 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-ds-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={8}
                className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-500 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                placeholder="Min. 8 characters"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-ds-gray-300"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                minLength={8}
                className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-500 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                placeholder="Re-enter your password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ds-gray-500">
            Already a member?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-ds-red hover:text-ds-red-400 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}
