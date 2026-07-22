import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BadgeVariant = "red" | "gold" | "gray" | "outline" | "success" | "warning" | "danger" | "info";
type BadgeSize = "sm" | "md" | "lg";

const variantStyles: Record<BadgeVariant, string> = {
  red: "bg-ds-red/10 text-ds-red-400 border-ds-red/30",
  gold: "bg-ds-gold-muted text-ds-gold border-ds-gold/30",
  gray: "bg-ds-gray-700/30 text-ds-gray-400 border-ds-gray-600/30",
  outline: "bg-transparent text-ds-gray-300 border-white/[0.12]",
  success: "bg-green-500/10 text-green-400 border-green-500/30",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  danger: "bg-red-500/10 text-red-400 border-red-500/30",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
  lg: "px-4 py-1.5 text-sm",
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export function Badge({
  children,
  variant = "gray",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-wider",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
