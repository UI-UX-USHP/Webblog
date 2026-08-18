import type { ComponentProps } from "react";

type CardProps = ComponentProps<"div"> & { hover?: boolean };

export default function Card({
  hover = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface ${
        hover ? "transition hover:shadow-[var(--shadow-lift)]" : ""
      } ${className}`.trim()}
      {...props}
    />
  );
}
