"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string;
  setValue: (next: string) => void;
};
const TabsContext = React.createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value: string;
  onValueChange: (next: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Tabs({ value, onValueChange, className, children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1 border-b border-border-subtle dark:border-outline-variant overflow-x-auto",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  icon,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be inside <Tabs>");
  const active = ctx.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => ctx.setValue(value)}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2.5 -mb-px font-body-sm text-body-sm font-medium border-b-2 transition-colors whitespace-nowrap",
        active
          ? "border-primary text-primary"
          : "border-transparent text-on-surface-variant hover:text-primary hover:border-primary/30",
        className,
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be inside <Tabs>");
  if (ctx.value !== value) return null;
  return (
    <div role="tabpanel" className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
}
