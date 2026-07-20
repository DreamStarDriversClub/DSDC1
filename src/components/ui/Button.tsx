"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "gold";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-ds-red text-white hover:bg-ds-red-700 shadow-brand-glow-sm hover:shadow-brand-glow",
  outline:
    "border border-ds-red/40 text-ds-white hover:bg-ds-red/10 hover:border-ds-red/60",
  ghost:
    "text-ds-gray-300 hover:text-ds-white hover:bg-ds-white/5",
  gold: "bg-ds-gold text-ds-black hover:bg-ds-gold-light shadow-gold-glow",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      variant = "primary",
      size = "md",
      asChild = false,
      className = "",
      ...props
    },
    ref,
  ) {
    // asChild pattern: render as <span> inside a <button> so the styling
    // can be applied without conflicting with wrapper components
    const baseClasses = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold
      transition-all duration-300 ease-out
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ds-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ds-black
      active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`;

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);
