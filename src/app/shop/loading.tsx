import { Container } from "@/components/ui/Container";

export default function ShopLoading() {
  return (
    <Container className="py-20">
      <div className="animate-pulse space-y-8">
        {/* Hero skeleton */}
        <div className="h-64 rounded-2xl bg-ds-black-charcoal" />
        {/* Grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-ds-black-charcoal p-0">
              <div className="h-48 rounded-t-2xl bg-ds-black-darkgray" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-20 rounded bg-ds-black-darkgray" />
                <div className="h-5 w-3/4 rounded bg-ds-black-darkgray" />
                <div className="h-6 w-16 rounded bg-ds-black-darkgray" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
