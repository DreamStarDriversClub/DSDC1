import { Container } from "@/components/ui/Container";

export default function SearchLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-ds-black-deepest py-20">
        <Container>
          <div className="mx-auto max-w-2xl space-y-4 text-center">
            <div className="mx-auto h-10 w-60 rounded bg-ds-black-charcoal" />
            <div className="mx-auto h-1 w-12 rounded-full bg-ds-black-charcoal" />
            <div className="mx-auto h-5 w-48 rounded bg-ds-black-charcoal" />
            <div className="h-14 w-full rounded-xl bg-ds-black-charcoal" />
          </div>
        </Container>
      </div>

      <Container className="py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-ds-black-charcoal">
              <div className="h-48 rounded-t-2xl bg-ds-black-darkgray" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-20 rounded bg-ds-black-darkgray" />
                <div className="h-5 w-3/4 rounded bg-ds-black-darkgray" />
                <div className="h-6 w-16 rounded bg-ds-black-darkgray" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
