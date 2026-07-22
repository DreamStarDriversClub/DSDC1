import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PaddingVariant = "none" | "sm" | "md" | "lg";

const paddingMap: Record<PaddingVariant, string> = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: PaddingVariant;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  padding = "md",
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border border-white/[0.06] bg-ds-black-charcoal",
        paddingMap[padding],
        hover &&
          "cursor-pointer transition-all duration-300 hover:border-ds-red/30 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ── Stats card variant ─────────────────────────────────── */

interface StatsCardProps {
  label: string;
  value: string;
  icon?: ReactNode;
  bg?: string;
  text?: string;
}

export function StatsCard({ label, value, icon, bg = "bg-blue-500/10", text = "text-blue-400" }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-ds-black-charcoal p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-ds-gray-400">
          {label}
        </span>
        {icon && (
          <span className={cn("rounded-lg p-2", bg, text)}>
            {icon}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold text-ds-white">{value}</p>
    </div>
  );
}
