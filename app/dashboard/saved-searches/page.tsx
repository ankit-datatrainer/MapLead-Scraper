"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  MoreVertical,
  Play,
  Store,
  Home,
  Stethoscope,
  Dumbbell,
  UtensilsCrossed,
  Scale,
  Briefcase,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useToast } from "@/hooks/use-toast";
import { formatNumber, timeAgo } from "@/lib/formatters";

const ICON_MAP: Record<string, LucideIcon> = {
  Store,
  Home,
  Stethoscope,
  Dumbbell,
  UtensilsCrossed,
  Scale,
  Briefcase,
};

export default function SavedSearchesPage() {
  const router = useRouter();
  const { savedSearches, removeSavedSearch } = useAppStore();
  const { success, info } = useToast();
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return savedSearches;
    const q = query.toLowerCase();
    return savedSearches.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.keyword.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q),
    );
  }, [savedSearches, query]);

  return (
    <div className="p-margin-mobile lg:p-margin-desktop max-w-container-max mx-auto w-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface dark:text-inverse-on-surface font-semibold">
            Saved Searches
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage and quickly re-run your frequent extraction queries.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Input
              icon={<Search size={16} />}
              placeholder="Search presets..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Link
            href="/dashboard/new-scrape"
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-body-sm font-semibold hover:bg-on-primary-fixed-variant transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Create Preset</span>
          </Link>
        </div>
      </motion.div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={20} />}
          title={query ? "No matching presets" : "No saved searches yet"}
          description={
            query
              ? "Try a different keyword."
              : "Save a preset on the New Scrape page to re-run searches in one click."
          }
          action={
            !query && (
              <Link
                href="/dashboard/new-scrape"
                className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold"
              >
                <Plus size={16} /> Create your first preset
              </Link>
            )
          }
        />
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter-desktop"
        >
          {filtered.map((preset) => {
            const Icon = ICON_MAP[preset.iconKey ?? "Briefcase"] ?? Briefcase;
            const tags = [
              preset.location,
              preset.keyword,
              preset.filters.minRating
                ? `Rating > ${preset.filters.minRating}`
                : null,
              preset.filters.hasPhone ? "Has Phone" : null,
              preset.filters.hasWebsite ? "Has Website" : null,
            ].filter(Boolean) as string[];
            return (
              <motion.article
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                key={preset.id}
                className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant p-6 shadow-ambient hover:shadow-ambient-hover transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-body-md text-body-md font-semibold text-on-surface dark:text-inverse-on-surface truncate">
                        {preset.name}
                      </h3>
                      <p className="font-mono text-label-mono text-on-surface-variant uppercase mt-1">
                        ID: {preset.id.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Preset actions"
                      onClick={() =>
                        setOpenMenuId((id) =>
                          id === preset.id ? null : preset.id,
                        )
                      }
                      className="text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openMenuId === preset.id && (
                      <div
                        className="absolute right-0 mt-2 w-44 bg-surface-primary dark:bg-dark-surface border border-border-subtle dark:border-outline-variant rounded-lg shadow-md py-1 z-20"
                        onMouseLeave={() => setOpenMenuId(null)}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            removeSavedSearch(preset.id);
                            success("Preset deleted", preset.name);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 w-full text-left px-3 py-2 text-body-sm text-error hover:bg-error-container/40 transition-colors"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant font-mono text-label-mono uppercase"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-auto grid grid-cols-2 gap-4 mb-6 border-t border-border-subtle dark:border-outline-variant pt-4">
                  <div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                      Last Run
                    </p>
                    <p className="font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
                      {preset.lastRunAt ? timeAgo(preset.lastRunAt) : "Never"}
                    </p>
                  </div>
                  <div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-1">
                      Avg. Results
                    </p>
                    <p className="font-body-md text-body-md font-medium text-on-surface dark:text-inverse-on-surface">
                      {preset.avgResults
                        ? formatNumber(preset.avgResults)
                        : "—"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    info("Preset loaded", `Reviewing "${preset.name}"…`);
                    localStorage.setItem("maplead_draft_scrape", JSON.stringify({
                      step: 4,
                      form: {
                        keyword: preset.keyword,
                        location: preset.location,
                        category: preset.category,
                        radius: preset.radius,
                        hasPhone: preset.filters.hasPhone,
                        hasWebsite: preset.filters.hasWebsite,
                        minRating: preset.filters.minRating,
                        minReviews: preset.filters.minReviews === null ? "" : preset.filters.minReviews,
                        resultLimit: preset.resultLimit,
                      }
                    }));
                    router.push("/dashboard/new-scrape");
                  }}
                >
                  <Play size={16} fill="currentColor" />
                  Run Extraction
                </Button>
              </motion.article>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
