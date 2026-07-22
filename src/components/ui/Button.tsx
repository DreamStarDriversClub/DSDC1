import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ds-red text-white hover:bg-ds-red-700 active:bg-ds-red-800 border-transparent",
  secondary:
    "bg-ds-black-charcoal text-ds-white hover:bg-ds-black-darkgray border-white/[0.08]",
  outline:
    "bg-transparent text-ds-white hover:bg-ds-white/[0.06] border-white/[0.15]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 border-transparent",
  ghost:
    "bg-transparent text-ds-gray-300 hover:text-ds-white hover:bg-ds-white/[0.04] border-transparent",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center border font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ds-red/40 disabled:cursor-not-allowed disabled:opacity-40",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
