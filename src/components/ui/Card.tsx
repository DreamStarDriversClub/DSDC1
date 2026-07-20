import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  hover = true,
  padding = "md",
  as: Tag = "div",
}: CardProps) {
  const pad = paddingMap[padding];

  return (
    <Tag
      className={`rounded-2xl border border-white/[0.06] bg-ds-black-charcoal shadow-card ${pad} ${
        hover ? "card-lift" : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
