import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }
>(({ className, hover, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant shadow-ambient",
      hover && "hover:shadow-ambient-hover transition-shadow duration-300",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "p-6 border-b border-border-subtle dark:border-outline-variant flex items-center justify-between gap-4",
      className,
    )}
    {...props}
  />
);

export const CardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface", className)}
    {...props}
  />
);

export const CardBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6", className)} {...props} />
);

export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "p-6 border-t border-border-subtle dark:border-outline-variant",
      className,
    )}
    {...props}
  />
);
