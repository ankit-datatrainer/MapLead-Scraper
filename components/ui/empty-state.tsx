import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-border-subtle dark:border-outline-variant bg-surface-secondary/40 dark:bg-dark-surface/40",
        className,
      )}
    >
      {icon && (
        <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-headline-md text-[18px] font-semibold text-on-surface dark:text-inverse-on-surface">
        {title}
      </h3>
      {description && (
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 max-w-md">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
