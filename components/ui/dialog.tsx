"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className={cn(
          "relative w-full bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant shadow-xl flex flex-col max-h-[90vh]",
          sizeMap[size],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-6 border-b border-border-subtle dark:border-outline-variant">
          <div className="pr-8">
            <h2
              id="dialog-title"
              className="font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface"
            >
              {title}
            </h2>
            {description && (
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={18} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {children}
        </div>
        {footer && (
          <div className="p-6 border-t border-border-subtle dark:border-outline-variant flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
