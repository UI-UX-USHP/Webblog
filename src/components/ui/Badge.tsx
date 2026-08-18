import type { ComponentProps } from "react";

type Tone = "accent" | "neutral" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  accent:
    "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20",
  neutral:
    "bg-surface-muted text-muted-foreground ring-1 ring-inset ring-border",
  success:
    "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 text-amber-600 ring-1 ring-inset ring-amber-500/20 dark:text-amber-400",
  danger:
    "bg-red-500/10 text-red-600 ring-1 ring-inset ring-red-500/20 dark:text-red-400",
};

type BadgeProps = ComponentProps<"span"> & { tone?: Tone };

export default function Badge({
  tone = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`.trim()}
      {...props}
    />
  );
}
