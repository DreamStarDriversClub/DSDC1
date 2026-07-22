import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ds-black px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <h1 className="font-display text-2xl font-black tracking-tight text-ds-white">
              DREAM STAR
            </h1>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-ds-black-charcoal p-6 text-center">
          <h2 className="mb-4 font-display text-lg font-bold text-ds-white">
            Forgot Password
          </h2>
          <p className="text-sm text-ds-gray-400">
            Password reset is coming soon. Please contact support for account
            assistance.
          </p>
          <div className="mt-6">
            <Link href="/auth/login">
              <Button variant="outline" size="md">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
