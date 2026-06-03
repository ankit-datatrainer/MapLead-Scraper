"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, rightIcon, invalid, type = "text", ...props }, ref) => {
    if (icon || rightIcon) {
      return (
        <div className={cn("relative w-full")}>
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "w-full bg-surface-primary dark:bg-dark-surface border rounded-lg py-2.5 text-body-md text-on-surface dark:text-inverse-on-surface placeholder:text-outline outline-none transition-colors",
              icon ? "pl-10" : "pl-4",
              rightIcon ? "pr-10" : "pr-4",
              invalid
                ? "border-error focus:border-error focus:ring-1 focus:ring-error"
                : "border-border-subtle dark:border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary",
              className,
            )}
            aria-invalid={invalid || undefined}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">
              {rightIcon}
            </span>
          )}
        </div>
      );
    }
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "w-full bg-surface-primary dark:bg-dark-surface border rounded-lg px-4 py-2.5 text-body-md text-on-surface dark:text-inverse-on-surface placeholder:text-outline outline-none transition-colors",
          invalid
            ? "border-error focus:border-error focus:ring-1 focus:ring-error"
            : "border-border-subtle dark:border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary",
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  uppercase?: boolean;
}
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, uppercase = true, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "block font-mono text-label-mono mb-1.5",
        uppercase
          ? "uppercase tracking-wider text-outline"
          : "text-on-surface-variant",
        className,
      )}
      {...props}
    />
  ),
);
Label.displayName = "Label";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full p-3 rounded-lg bg-surface-primary dark:bg-dark-surface border text-body-sm text-on-surface dark:text-inverse-on-surface placeholder:text-outline outline-none resize-none transition-colors",
      invalid
        ? "border-error focus:border-error focus:ring-1 focus:ring-error"
        : "border-border-subtle dark:border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
