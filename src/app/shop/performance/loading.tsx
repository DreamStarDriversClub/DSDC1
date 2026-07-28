import { Container } from "@/components/ui/Container";

export default function PerformanceLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="relative h-64 animate-pulse bg-ds-black-charcoal">
        <div className="absolute inset-0 bg-ds-black/50" />
        <Container className="relative z-10 flex h-full items-center">
          <div className="space-y-4">
            <div className="h-10 w-64 rounded-lg bg-ds-black-darkgray" />
            <div className="h-4 w-96 rounded bg-ds-black-darkgray" />
          </div>
        </Container>
      </div>

      <Container className="py-8">
        {/* Breadcrumbs skeleton */}
        <div className="mb-8 h-4 w-48 animate-pulse rounded bg-ds-black-darkgray" />

        {/* Filters skeleton */}
        <div className="mb-8 flex gap-4">
          <div className="h-10 w-40 animate-pulse rounded-lg bg-ds-black-charcoal" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-ds-black-charcoal" />
        </div>

        {/* Product grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal"
            >
              <div className="h-56 animate-pulse bg-ds-black-darkgray" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-20 animate-pulse rounded bg-ds-black-darkgray" />
                <div className="h-4 w-full animate-pulse rounded bg-ds-black-darkgray" />
                <div className="h-5 w-16 animate-pulse rounded bg-ds-black-darkgray" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
