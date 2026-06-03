"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Laptop } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Theme toggle"
        className={cn(
          "p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors",
          className,
        )}
      >
        <Sun size={20} />
      </button>
    );
  }

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const Icon =
    theme === "system" ? Laptop : resolvedTheme === "dark" ? Moon : Sun;

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
      className={cn(
        "p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low dark:hover:bg-inverse-surface transition-colors active:scale-95 duration-150",
        className,
      )}
    >
      <Icon size={20} />
    </button>
  );
}
