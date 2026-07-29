"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PerformanceError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("DS Performance page error:", error);
  }, [error]);

  return (
    <Container className="section-padding">
      <div className="mx-auto max-w-lg text-center">
        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-ds-red/20 bg-ds-black-charcoal">
          <svg
            className="h-10 w-10 text-ds-red/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="font-display text-3xl font-bold text-ds-white">
          Something Went Wrong
        </h1>
        <p className="mt-3 text-ds-gray-300">
          We couldn&apos;t load the performance parts. This might be a temporary
          issue — please try again.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="primary" size="lg" onClick={reset}>
            Try Again
          </Button>
          <Link href="/shop">
            <Button variant="outline" size="lg">
              Browse All Products
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
