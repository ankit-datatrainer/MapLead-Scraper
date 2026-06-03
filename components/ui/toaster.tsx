"use client";

import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useToastStore, type ToastTone } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const toneStyles: Record<ToastTone, { icon: React.ReactNode; ring: string }> = {
  success: {
    icon: <CheckCircle2 className="text-secondary" size={20} />,
    ring: "border-l-secondary",
  },
  error: {
    icon: <XCircle className="text-error" size={20} />,
    ring: "border-l-error",
  },
  warning: {
    icon: <AlertTriangle className="text-tertiary" size={20} />,
    ring: "border-l-tertiary",
  },
  info: {
    icon: <Info className="text-primary" size={20} />,
    ring: "border-l-primary",
  },
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-[80] flex flex-col gap-2 w-full max-w-sm pointer-events-none"
    >
      {toasts.map((t) => {
        const tone = toneStyles[t.tone];
        return (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto bg-surface-primary dark:bg-dark-surface border border-border-subtle dark:border-outline-variant border-l-4 rounded-lg shadow-md p-4 flex gap-3 items-start animate-fade-in",
              tone.ring,
            )}
          >
            <div className="mt-0.5">{tone.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="font-body-md text-body-md font-semibold text-on-surface dark:text-inverse-on-surface">
                {t.title}
              </p>
              {t.description && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  {t.description}
                </p>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismiss(t.id)}
              className="text-outline hover:text-on-surface transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
