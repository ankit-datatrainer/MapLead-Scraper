"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/constants";
import { DEFAULT_SETTINGS, type Settings } from "@/types/settings";
import type { ScrapeJob, SavedSearch } from "@/types/scrape";
import { uid } from "@/lib/utils";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  company?: string;
  createdAt: string;
};

type AppState = {
  /* persisted */
  user: AuthUser | null;
  settings: Settings;
  jobs: ScrapeJob[];
  savedSearches: SavedSearch[];

  /* transient */
  hydrated: boolean;

  /* derived */
  isAuthenticated: () => boolean;

  /* auth */
  signUp: (data: {
    id?: string;
    fullName: string;
    email: string;
    password: string;
    company?: string;
  }) => AuthUser;
  signIn: (data: { email: string; password: string }) => AuthUser;
  signOut: () => void;

  /* settings */
  updateSettings: (patch: Partial<Settings>) => void;
  setApiKey: (key: string) => void;

  /* jobs */
  addJob: (job: ScrapeJob) => void;
  updateJob: (id: string, patch: Partial<ScrapeJob>) => void;
  removeJob: (id: string) => void;

  /* saved searches */
  addSavedSearch: (
    search: Omit<SavedSearch, "id" | "createdAt">,
  ) => SavedSearch;
  removeSavedSearch: (id: string) => void;

  /* hydration */
  setHydrated: (v: boolean) => void;
};

/**
 * Bump this whenever the persisted shape changes meaningfully so that
 * stale demo data on existing devices is wiped on next load.
 */
const PERSIST_VERSION = 2;

const EMPTY_INITIAL = {
  user: null as AuthUser | null,
  settings: DEFAULT_SETTINGS,
  jobs: [] as ScrapeJob[],
  savedSearches: [] as SavedSearch[],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...EMPTY_INITIAL,
      hydrated: false,

      isAuthenticated: () => !!get().user,

  signUp: ({ id, fullName, email, password: _password, company }) => {
        const user: AuthUser = {
          id: id || uid("user"),
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          company: company?.trim() || undefined,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({
          user,
          // Mirror profile fields into settings.account so the Settings page is prefilled.
          settings: {
            ...s.settings,
            account: {
              fullName: user.fullName,
              email: user.email,
              company: user.company,
            },
          },
          // Brand-new accounts always start with a clean slate.
          jobs: [],
          savedSearches: [],
        }));
        return user;
      },

      signIn: ({ email, password: _password }) => {
        // No real backend — synthesize a user record from the email.
        const existingEmail = get().settings.account.email?.trim().toLowerCase();
        const normalizedEmail = email.trim().toLowerCase();
        const matchesExisting = existingEmail === normalizedEmail;
        const user: AuthUser = matchesExisting && get().user
          ? get().user!
          : {
              id: uid("user"),
              fullName: normalizedEmail.split("@")[0].replace(/[._-]+/g, " "),
              email: normalizedEmail,
              createdAt: new Date().toISOString(),
            };
        set((s) => ({
          user,
          settings: matchesExisting
            ? s.settings
            : {
                ...s.settings,
                account: {
                  fullName: user.fullName,
                  email: user.email,
                  company: undefined,
                },
              },
          // If signing in to a different account locally, clear scrape data.
          jobs: matchesExisting ? s.jobs : [],
          savedSearches: matchesExisting ? s.savedSearches : [],
        }));
        return user;
      },

      signOut: () => {
        set(() => ({
          user: null,
          // Settings, including API key + saved searches, stay around — that
          // information is non-sensitive (the API key is local-only anyway).
        }));
      },

      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),

      setApiKey: (key) =>
        set((s) => ({ settings: { ...s.settings, apifyApiKey: key } })),

      addJob: (job) => set((s) => ({ jobs: [job, ...s.jobs] })),
      updateJob: (id, patch) =>
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        })),
      removeJob: (id) =>
        set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) })),

      addSavedSearch: (search) => {
        const newItem: SavedSearch = {
          ...search,
          id: uid("saved"),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ savedSearches: [newItem, ...s.savedSearches] }));
        return newItem;
      },
      removeSavedSearch: (id) =>
        set((s) => ({
          savedSearches: s.savedSearches.filter((p) => p.id !== id),
        })),

      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: STORAGE_KEYS.settings.replace(".settings", ""),
      storage: createJSONStorage(() => localStorage),
      version: PERSIST_VERSION,
      partialize: (state) => ({
        user: state.user,
        settings: state.settings,
        jobs: state.jobs,
        savedSearches: state.savedSearches,
      }),
      // Wipe stale demo data when the persist version changes.
      migrate: (_persisted, _version) => {
        return EMPTY_INITIAL as Partial<AppState>;
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

/** Convenience hook for components that just need the auth user. */
export function useAuthUser() {
  return useAppStore((s) => s.user);
}
