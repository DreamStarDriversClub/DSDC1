"use client";

import { useState, useCallback } from "react";
import { ReviewList } from "@/components/shop/ReviewList";
import { ReviewForm } from "@/components/shop/ReviewForm";

interface ReviewsSectionProps {
  productId: string;
}

export function ReviewsSection({ productId }: ReviewsSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <>
      <div className="mb-10">
        <ReviewList key={refreshKey} productId={productId} />
      </div>

      <div className="rounded-xl border border-white/[0.06] bg-ds-charcoal p-6">
        <ReviewForm productId={productId} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
