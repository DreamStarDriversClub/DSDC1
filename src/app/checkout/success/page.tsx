"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-ds-red border-t-transparent" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const clearedRef = useRef(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      setError("No session ID found.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json();

        if (data.success && data.orderId) {
          setOrderId(data.orderId);
          setStatus("success");

          // Clear cart once on success
          if (!clearedRef.current) {
            clearedRef.current = true;
            clearCart();
          }
        } else {
          // If payment hasn't completed yet, poll
          if (data.error?.includes("not been completed")) {
            setTimeout(() => verify(), 2000);
            return;
          }
          setStatus("error");
          setError(data.error || "Failed to verify payment.");
        }
      } catch {
        setStatus("error");
        setError("An unexpected error occurred.");
      }
    };

    verify();
  }, [sessionId, clearCart]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Checkout", href: "/checkout" },
    { label: "Confirmation" },
  ];

  return (
    <>
      <Container className="py-8">
        <Breadcrumbs items={breadcrumbItems} />
      </Container>

      <section className="section-padding">
        <Container>
          <div className="mx-auto max-w-lg text-center">
            {/* Loading state */}
            {status === "loading" && (
              <>
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center">
                    <svg
                      className="h-10 w-10 animate-spin text-ds-red"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </div>
                </div>
                <h1 className="mt-4 font-display text-2xl font-bold text-ds-white">
                  Verifying your payment…
                </h1>
                <p className="mt-2 text-sm text-ds-gray-400">
                  Please wait while we confirm your order.
                </p>
              </>
            )}

            {/* Success state */}
            {status === "success" && orderId && (
              <>
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                    <svg
                      className="h-10 w-10 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 font-display text-3xl font-bold text-ds-white">
                  Order Confirmed!
                </h1>
                <p className="mt-3 text-ds-gray-300">
                  Thank you for your order. Your order number is{" "}
                  <span className="font-mono font-semibold text-ds-red">
                    #{orderId.slice(-8).toUpperCase()}
                  </span>
                </p>
                <p className="mt-1 text-sm text-ds-gray-400">
                  A confirmation email will be sent to you shortly.
                </p>
                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Link href="/shop">
                    <Button variant="primary" size="lg">
                      Continue Shopping
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" size="lg">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </>
            )}

            {/* Error state */}
            {status === "error" && (
              <>
                <div className="flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-ds-red/10">
                    <svg
                      className="h-10 w-10 text-ds-red"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
                <h1 className="mt-6 font-display text-2xl font-bold text-ds-white">
                  Something went wrong
                </h1>
                <p className="mt-3 text-ds-gray-300">
                  {error || "We couldn&apos;t verify your payment. Please contact support."}
                </p>
                <div className="mt-8">
                  <Link href="/checkout">
                    <Button variant="primary" size="lg">
                      Return to Checkout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
