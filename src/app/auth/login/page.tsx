"use client";

import { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { loginWithCredentials } from "@/lib/auth-actions";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string)?.trim().toLowerCase() ?? "";
    const password = (formData.get("password") as string) ?? "";

    startTransition(async () => {
      const result = await loginWithCredentials(email, password);
      if (result.success) {
        router.push(redirect);
      } else {
        setError(result.error ?? "Login failed.");
      }
    });
  }

  return (
    <div className="section-padding">
      <Container>
        <div className="mx-auto max-w-md">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl text-ds-white">Welcome Back</h1>
            <p className="mt-2 text-ds-gray-300">
              Sign in to your Dream Star account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-ds-red/30 bg-ds-red/10 px-4 py-3 text-sm text-ds-red">
                {error}
              </div>
            )}

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
                className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                placeholder="admin@dreamstardc.com"
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
                className="w-full rounded-xl border border-white/10 bg-ds-black-charcoal px-4 py-3 text-sm text-ds-white placeholder:text-ds-gray-400 focus:border-ds-red/50 focus:outline-none focus:ring-1 focus:ring-ds-red/30"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-ds-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  className="h-4 w-4 rounded border-white/20 bg-ds-black-charcoal text-ds-red focus:ring-ds-red/40"
                />
                Remember me
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-ds-red hover:text-ds-red-400 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ds-gray-400">
            Not a member yet?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-ds-red hover:text-ds-red-400 transition-colors"
            >
              Join the Club
            </Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="section-padding">
          <Container>
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-ds-red border-t-transparent" />
            </div>
          </Container>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
