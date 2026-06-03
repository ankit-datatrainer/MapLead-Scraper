"use client";

import { create } from "zustand";
import { uid } from "@/lib/utils";

export type ToastTone = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
  duration: number;
};

type ToastStore = {
  toasts: Toast[];
  push: (toast: Omit<Toast, "id" | "duration"> & { duration?: number }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  push: ({ title, description, tone, duration = 4000 }) => {
    const id = uid("toast");
    set({ toasts: [...get().toasts, { id, title, description, tone, duration }] });
    if (duration > 0) {
      setTimeout(() => get().dismiss(id), duration);
    }
    return id;
  },
  dismiss: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
  clear: () => set({ toasts: [] }),
}));

export function useToast() {
  const push = useToastStore((s) => s.push);
  return {
    toast: (
      title: string,
      options?: {
        description?: string;
        tone?: ToastTone;
        duration?: number;
      },
    ) =>
      push({
        title,
        description: options?.description,
        tone: options?.tone ?? "info",
        duration: options?.duration,
      }),
    success: (title: string, description?: string) =>
      push({ title, description, tone: "success" }),
    error: (title: string, description?: string) =>
      push({ title, description, tone: "error" }),
    info: (title: string, description?: string) =>
      push({ title, description, tone: "info" }),
    warning: (title: string, description?: string) =>
      push({ title, description, tone: "warning" }),
  };
}
