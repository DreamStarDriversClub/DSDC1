import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ds-gray-300"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-lg border bg-ds-black px-4 py-2.5 text-sm text-ds-white placeholder-ds-gray-600 transition-colors focus:outline-none focus:ring-1",
            error
              ? "border-ds-red focus:border-ds-red/50 focus:ring-ds-red/30"
              : "border-white/[0.08] focus:border-ds-red/50 focus:ring-ds-red/30",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-ds-red">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
