import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "destructive" | "success";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-on-primary-fixed-variant disabled:opacity-50 shadow-sm shadow-primary/10",
  secondary:
    "bg-white text-on-surface border border-border-subtle hover:bg-surface-container-low",
  ghost:
    "bg-transparent text-on-surface hover:bg-surface-container-low",
  outline:
    "bg-transparent text-primary border border-primary/40 hover:bg-primary/5",
  destructive:
    "bg-error text-white hover:opacity-90",
  success:
    "bg-secondary text-white hover:bg-on-secondary-fixed-variant",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-body-sm",
  md: "h-10 px-4 text-body-md",
  lg: "h-12 px-6 text-body-md",
  icon: "h-9 w-9 p-0",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading,
      disabled,
      children,
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors active:scale-95 duration-150",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...rest}
      >
        {loading && (
          <span
            className="inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
            aria-hidden
          />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
