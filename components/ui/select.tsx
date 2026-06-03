"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  invalid?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, invalid, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "w-full appearance-none bg-surface-primary dark:bg-dark-surface border rounded-lg px-4 py-2.5 pr-10 text-body-md text-on-surface dark:text-inverse-on-surface outline-none transition-colors",
            invalid
              ? "border-error focus:border-error focus:ring-1 focus:ring-error"
              : "border-border-subtle dark:border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary",
            className,
          )}
          aria-invalid={invalid || undefined}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline"
          size={18}
        />
      </div>
    );
  },
);
Select.displayName = "Select";
