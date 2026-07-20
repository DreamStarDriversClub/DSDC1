import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "red" | "gold" | "gray" | "outline";
  size?: "sm" | "md";
  className?: string;
}

const variantStyles: Record<string, string> = {
  red: "bg-ds-red/20 text-ds-red-400 border-ds-red/30",
  gold: "bg-ds-gold-muted text-ds-gold-light border-ds-gold/30",
  gray: "bg-ds-gray-800 text-ds-gray-300 border-ds-gray-700",
  outline: "bg-transparent text-ds-gray-300 border-ds-gray-600",
};

const sizeStyles: Record<string, string> = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-3 py-1 text-xs",
};

export function Badge({
  children,
  variant = "red",
  size = "md",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wider ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
