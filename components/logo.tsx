import { Map } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  size = "md",
  showWordmark = true,
  subtitle,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  /** Optional subtitle line under the wordmark, e.g. "Pro Plan". */
  subtitle?: string;
  className?: string;
}) {
  const dim = size === "sm" ? "w-7 h-7" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const iconSize = size === "sm" ? 16 : size === "lg" ? 22 : 18;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          dim,
          "rounded-md bg-primary text-on-primary flex items-center justify-center shrink-0",
        )}
        aria-hidden
      >
        <Map size={iconSize} />
      </div>
      {showWordmark && (
        <div className="leading-tight min-w-0">
          <h1 className="text-[20px] font-bold text-primary dark:text-inverse-primary truncate">
            MapLead Scraper
          </h1>
          {subtitle && (
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate block">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
