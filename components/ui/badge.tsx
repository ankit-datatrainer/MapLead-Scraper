import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "primary" | "success" | "warning" | "error" | "info";

const tones: Record<BadgeTone, string> = {
  neutral:
    "bg-surface-container-high text-on-surface-variant border-border-subtle",
  primary:
    "bg-primary-container/20 text-primary border-primary/20",
  success:
    "bg-secondary-container text-on-secondary-container border-secondary/20",
  warning:
    "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary/20",
  error:
    "bg-error-container text-on-error-container border-error/20",
  info: "bg-surface-container-low text-primary border-primary/15",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-medium text-[12px] leading-4",
        tones[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
