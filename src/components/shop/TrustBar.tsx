import { Container } from "@/components/ui/Container";

interface TrustSignal {
  icon: string;
  headline: string;
  subtext: string;
}

const signals: TrustSignal[] = [
  { icon: "🚚", headline: "Free Shipping", subtext: "Orders $75+" },
  { icon: "🔧", headline: "Garage Tested", subtext: "We run what we sell" },
  { icon: "↩️", headline: "Easy Returns", subtext: "30 days, no drama" },
  { icon: "💬", headline: "Real Support", subtext: "Gearheads, not bots" },
];

function SignalItem({
  signal,
  isLast,
}: {
  signal: TrustSignal;
  isLast: boolean;
}) {
  return (
    <div className="group flex items-center gap-3 sm:gap-4">
      {/* Icon */}
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ds-red/10 text-lg transition-colors duration-300 group-hover:bg-ds-red/20 sm:h-11 sm:w-11 sm:text-xl"
        aria-hidden="true"
      >
        {signal.icon}
      </span>

      {/* Text */}
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ds-white">
          {signal.headline}
        </p>
        <p className="text-xs text-ds-gray-400">{signal.subtext}</p>
      </div>
    </div>
  );
}

export function TrustBar() {
  return (
    <section className="border-y border-white/[0.06] bg-ds-black-charcoal">
      <Container className="py-8 md:py-10" as="div">
        {/* Mobile: 2×2 grid with a horizontal divider between rows */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:hidden">
          <SignalItem signal={signals[0]} isLast={false} />
          <SignalItem signal={signals[1]} isLast={false} />
          {/* Horizontal row divider */}
          <div className="col-span-2 h-px bg-ds-red/20" />
          <SignalItem signal={signals[2]} isLast={false} />
          <SignalItem signal={signals[3]} isLast={false} />
        </div>

        {/* Desktop: 4 columns with red vertical dividers */}
        <div className="hidden md:flex md:items-center md:justify-between">
          {signals.map((signal, i) => (
            <div key={i} className="flex items-center gap-4">
              {i > 0 && <div className="h-12 w-px shrink-0 bg-ds-red/30" />}
              <SignalItem signal={signal} isLast={false} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
