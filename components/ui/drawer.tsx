"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: "right" | "left";
  width?: string;
  className?: string;
  ariaLabel?: string;
}

export function Drawer({
  open,
  onClose,
  children,
  side = "right",
  width = "w-full md:w-[450px]",
  className,
  ariaLabel,
}: DrawerProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-on-surface/30 backdrop-blur-sm z-40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={cn(
          "fixed top-0 h-full bg-surface-primary dark:bg-dark-surface z-50 border-border-subtle dark:border-outline-variant flex flex-col transition-transform duration-300 ease-out",
          side === "right"
            ? "right-0 border-l shadow-[-10px_0_30px_rgba(0,0,0,0.10)]"
            : "left-0 border-r shadow-[10px_0_30px_rgba(0,0,0,0.10)]",
          width,
          open
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full"
              : "-translate-x-full",
          className,
        )}
      >
        {children}
      </aside>
    </>
  );
}
