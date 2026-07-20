import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-ds-red">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-black tracking-tight text-ds-white sm:text-4xl lg:text-5xl">
        {heading}
      </h2>
      <div
        className={`h-[3px] w-12 rounded-full bg-ds-red ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      {description && (
        <p className="max-w-2xl text-lg leading-relaxed text-ds-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}
