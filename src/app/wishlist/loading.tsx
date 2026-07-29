import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/shop/Breadcrumbs";

export default function WishlistLoading() {
  return (
    <>
      <Container className="py-8">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "My Garage" },
          ]}
          className="mb-8"
        />
      </Container>

      <section className="bg-ds-black section-padding-tight">
        <Container>
          {/* Section heading skeleton */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 h-4 w-24 animate-pulse rounded bg-ds-black-darkgray" />
            <div className="mx-auto mb-2 h-8 w-64 animate-pulse rounded bg-ds-black-darkgray" />
            <div className="mx-auto h-4 w-48 animate-pulse rounded bg-ds-black-darkgray" />
          </div>

          {/* Grid skeleton */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-white/[0.06] bg-ds-black-charcoal"
              >
                <div className="aspect-square animate-pulse bg-ds-black-darkgray" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-ds-black-darkgray" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-ds-black-darkgray" />
                  <div className="h-5 w-1/3 animate-pulse rounded bg-ds-black-darkgray" />
                  <div className="h-9 w-full animate-pulse rounded-lg bg-ds-black-darkgray" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
