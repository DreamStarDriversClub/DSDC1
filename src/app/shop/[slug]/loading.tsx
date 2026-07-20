import { Container } from "@/components/ui/Container";

export default function ProductDetailLoading() {
  return (
    <Container className="py-16">
      <div className="animate-pulse space-y-8">
        {/* Breadcrumbs skeleton */}
        <div className="h-4 w-40 rounded bg-ds-black-charcoal" />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image skeleton */}
          <div className="aspect-square rounded-2xl bg-ds-black-charcoal" />

          {/* Info skeleton */}
          <div className="space-y-5">
            <div className="h-5 w-20 rounded bg-ds-black-charcoal" />
            <div className="h-10 w-3/4 rounded bg-ds-black-charcoal" />
            <div className="h-8 w-24 rounded bg-ds-black-charcoal" />
            <div className="h-px bg-white/[0.06]" />
            <div className="h-6 w-16 rounded bg-ds-black-charcoal" />
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 w-14 rounded-lg bg-ds-black-charcoal" />
              ))}
            </div>
            <div className="h-6 w-16 rounded bg-ds-black-charcoal" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-20 rounded-lg bg-ds-black-charcoal" />
              ))}
            </div>
            <div className="h-14 w-full rounded-xl bg-ds-black-charcoal" />
            <div className="h-14 w-full rounded-xl bg-ds-black-charcoal" />
          </div>
        </div>
      </div>
    </Container>
  );
}
