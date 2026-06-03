"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Filter,
  X,
  Bookmark,
  FileSpreadsheet,
  FileText,
  Star,
  MapPin,
  Phone,
  Globe,
  Search,
  CheckSquare,
  Square,
  ArrowLeft,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { LeadDrawer } from "@/components/dashboard/lead-drawer";
import { useToast } from "@/hooks/use-toast";
import { exportLeadsToCsv, exportLeadsToExcel, exportLeadsToJson } from "@/lib/export-excel";
import type { Lead } from "@/types/lead";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/formatters";

const ResultsMap = dynamic(
  () => import("@/components/dashboard/results-map"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-surface-container dark:bg-inverse-surface/30">
        <Skeleton className="w-3/4 h-3/4" />
      </div>
    ),
  },
);

type SortKey = "relevance" | "rating-desc" | "reviews-desc" | "name-asc";

export default function JobResultsPage() {
  const params = useParams<{ jobId: string }>();
  const router = useRouter();
  const { jobs, addSavedSearch } = useAppStore();
  const { success, error: errorToast, info } = useToast();

  const job = useMemo(
    () => jobs.find((j) => j.id === params?.jobId),
    [jobs, params?.jobId],
  );

  const allLeads = useMemo(() => job?.results ?? [], [job?.results]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("relevance");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [hasPhone, setHasPhone] = useState(false);
  const [hasWebsite, setHasWebsite] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Apply filters & search & sort
  const visibleLeads = useMemo(() => {
    let list = allLeads.slice();
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          (l.address ?? "").toLowerCase().includes(q) ||
          (l.category ?? "").toLowerCase().includes(q),
      );
    }
    if (hasPhone) list = list.filter((l) => !!l.phone);
    if (hasWebsite) list = list.filter((l) => !!l.website);
    if (minRating !== null)
      list = list.filter((l) => (l.rating ?? 0) >= minRating);
    switch (sort) {
      case "rating-desc":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "reviews-desc":
        list.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
        break;
      case "name-asc":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [allLeads, search, sort, minRating, hasPhone, hasWebsite]);

  useEffect(() => {
    if (visibleLeads.length > 0 && !activeId) setActiveId(visibleLeads[0].id);
  }, [visibleLeads, activeId]);

  if (!job) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 gap-4">
        <EmptyState
          icon={<MapPin size={20} />}
          title="Job not found"
          description="That scrape doesn't exist or has been deleted."
          action={
            <Link
              href="/dashboard/results"
              className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold"
            >
              <ArrowLeft size={16} /> Back to library
            </Link>
          }
        />
      </div>
    );
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allVisibleSelected =
    visibleLeads.length > 0 &&
    visibleLeads.every((l) => selectedIds.has(l.id));

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleLeads.forEach((l) => next.delete(l.id));
      } else {
        visibleLeads.forEach((l) => next.add(l.id));
      }
      return next;
    });
  };

  const exportLeads = async (
    scope: "all" | "filtered" | "selected",
    format: "xlsx" | "csv" | "json",
  ) => {
    const target =
      scope === "all"
        ? allLeads
        : scope === "filtered"
          ? visibleLeads
          : allLeads.filter((l) => selectedIds.has(l.id));
    if (target.length === 0) {
      errorToast("Nothing to export", "No leads match the chosen scope.");
      return;
    }
    try {
      let filename: string;
      if (format === "xlsx") {
        filename = await exportLeadsToExcel(target, job.name);
      } else if (format === "csv") {
        filename = await exportLeadsToCsv(target, job.name);
      } else {
        filename = await exportLeadsToJson(target, job.name);
      }
      success(`Exported ${target.length} leads`, filename);
    } catch (e) {
      errorToast(
        "Export failed",
        e instanceof Error ? e.message : "Please try again.",
      );
    }
  };

  const saveSearch = () => {
    addSavedSearch({
      name: job.name,
      keyword: job.keyword,
      location: job.location,
      category: job.category,
      radius: job.radius,
      resultLimit: job.resultLimit,
      filters: {
        ...job.filters,
        minRating,
        hasPhone,
        hasWebsite,
      },
      avgResults: visibleLeads.length,
    });
    info("Saved search", "You can re-run this preset anytime.");
  };

  const filterChips: { label: string; onClear: () => void }[] = [
    { label: job.keyword, onClear: () => router.push("/dashboard/results") },
    minRating !== null
      ? {
          label: `Rating > ${minRating}`,
          onClear: () => setMinRating(null),
        }
      : null,
    hasWebsite
      ? { label: "Has Website", onClear: () => setHasWebsite(false) }
      : null,
    hasPhone ? { label: "Has Phone", onClear: () => setHasPhone(false) } : null,
  ].filter(Boolean) as { label: string; onClear: () => void }[];

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Job header bar */}
      <div className="border-b border-border-subtle bg-surface-primary px-4 lg:px-gutter-desktop py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/dashboard/results"
            className="inline-flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors text-body-sm"
          >
            <ArrowLeft size={16} /> Library
          </Link>
          <span className="text-outline">/</span>
          <div className="min-w-0">
            <h1 className="font-headline-md text-[18px] font-semibold text-on-surface truncate">
              {job.name}
            </h1>
            <p className="text-[12px] text-on-surface-variant mt-0.5">
              Keyword: <span className="font-mono font-medium text-primary">&quot;{job.keyword}&quot;</span>
              {" · "}Location: <span className="font-mono font-medium text-primary">{job.location}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge tone="info">{formatNumber(allLeads.length)} leads</Badge>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* Mobile filter toggle */}
        <div className="lg:hidden p-4 border-b border-border-subtle dark:border-outline-variant flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <Filter size={16} /> Filters
          </Button>
          <span className="text-body-sm text-on-surface-variant">
            {formatNumber(visibleLeads.length)} of{" "}
            {formatNumber(allLeads.length)} results
          </span>
        </div>

        {/* Left: Filters & Actions */}
        <aside
          className={cn(
            "w-full lg:w-[280px] flex flex-col border-r border-border-subtle dark:border-outline-variant bg-surface-primary dark:bg-dark-surface shrink-0 z-10",
            filtersOpen ? "block" : "hidden lg:flex",
          )}
        >
          <div className="p-6 border-b border-border-subtle dark:border-outline-variant flex items-center justify-between">
            <h2 className="font-headline-md text-[18px] font-semibold text-on-surface dark:text-inverse-on-surface">
              Filters
            </h2>
            <Filter size={18} className="text-on-surface-variant" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-6">
            <div>
              <h3 className="font-mono text-label-mono text-outline mb-3 uppercase tracking-wider">
                Active Criteria
              </h3>
              {filterChips.length === 0 ? (
                <p className="text-body-sm text-on-surface-variant">
                  No filters applied.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {filterChips.map((chip, i) => (
                    <button
                      key={i}
                      onClick={chip.onClear}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-low dark:bg-inverse-surface/40 border border-border-subtle dark:border-outline-variant rounded-full font-body-sm text-[13px] text-on-surface dark:text-inverse-on-surface hover:border-error hover:text-error transition-colors"
                    >
                      <span>{chip.label}</span>
                      <X size={14} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-mono text-label-mono text-outline mb-3 uppercase tracking-wider">
                Search
              </h3>
              <Input
                icon={<Search size={16} />}
                placeholder="Search results..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div>
              <h3 className="font-mono text-label-mono text-outline mb-3 uppercase tracking-wider">
                Quick filters
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-body-sm">
                  <input
                    type="checkbox"
                    className="rounded border-outline text-primary focus:ring-primary"
                    checked={hasPhone}
                    onChange={(e) => setHasPhone(e.target.checked)}
                  />
                  Has phone
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-body-sm">
                  <input
                    type="checkbox"
                    className="rounded border-outline text-primary focus:ring-primary"
                    checked={hasWebsite}
                    onChange={(e) => setHasWebsite(e.target.checked)}
                  />
                  Has website
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-mono text-label-mono text-outline mb-3 uppercase tracking-wider">
                Minimum rating
              </h3>
              <div className="flex gap-2">
                {[null, 3, 4, 4.5].map((v) => {
                  const active = minRating === v;
                  return (
                    <button
                      key={String(v)}
                      type="button"
                      onClick={() => setMinRating(v)}
                      className={cn(
                        "flex-1 py-1.5 border rounded text-body-sm transition-colors",
                        active
                          ? "border-primary bg-primary-container/40 text-on-primary-container font-medium"
                          : "border-border-subtle dark:border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
                      )}
                    >
                      {v === null ? "Any" : `${v}+`}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-border-subtle dark:border-outline-variant" />

            {/* Bulk select */}
            <div>
              <h3 className="font-mono text-label-mono text-outline mb-3 uppercase tracking-wider">
                Selection ({selectedIds.size})
              </h3>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleSelectAllVisible}
                className="w-full"
              >
                {allVisibleSelected ? (
                  <CheckSquare size={16} />
                ) : (
                  <Square size={16} />
                )}
                {allVisibleSelected ? "Deselect all" : "Select visible"}
              </Button>
            </div>

            {/* Export */}
            <div>
              <h3 className="font-mono text-label-mono text-outline mb-3 uppercase tracking-wider">
                Export
              </h3>
              <div className="flex flex-col gap-2">
                <Button
                  variant="secondary"
                  onClick={() => exportLeads("filtered", "xlsx")}
                  size="sm"
                >
                  <FileSpreadsheet size={16} /> Filtered → Excel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => exportLeads("filtered", "csv")}
                  size="sm"
                >
                  <FileText size={16} /> Filtered → CSV
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => exportLeads("filtered", "json")}
                  size="sm"
                >
                  <FileText size={16} /> Filtered → JSON
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => exportLeads("selected", "xlsx")}
                  size="sm"
                  disabled={selectedIds.size === 0}
                >
                  <FileSpreadsheet size={16} /> Selected ({selectedIds.size}) →
                  Excel
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => exportLeads("all", "xlsx")}
                  size="sm"
                >
                  <FileSpreadsheet size={16} /> All → Excel
                </Button>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-border-subtle dark:border-outline-variant bg-surface-secondary dark:bg-dark-bg/30">
            <Button onClick={saveSearch} className="w-full">
              <Bookmark size={16} /> Save Search
            </Button>
          </div>
        </aside>

        {/* Center: Map */}
        <section className="flex-1 relative bg-surface-dim overflow-hidden hidden md:flex flex-col z-0 min-h-[400px]">
          {visibleLeads.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <EmptyState
                icon={<MapPin size={20} />}
                title="No leads to map"
                description="Adjust your filters or run a new scrape to see pins here."
              />
            </div>
          ) : (
            <ResultsMap
              leads={visibleLeads}
              selectedId={activeId}
              onSelect={(id) => setActiveId(id)}
            />
          )}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-surface-primary/95 dark:bg-dark-surface/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-border-subtle dark:border-outline-variant flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span className="font-body-sm font-medium text-on-surface dark:text-inverse-on-surface">
                {job.location}
              </span>
            </div>
            <div className="bg-surface-primary/95 dark:bg-dark-surface/95 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-border-subtle dark:border-outline-variant">
              <span className="font-body-sm text-on-surface-variant">
                {formatNumber(visibleLeads.length)} Results
              </span>
            </div>
          </div>
        </section>

        {/* Right: List */}
        <aside className="w-full lg:w-[380px] h-full flex flex-col border-l border-border-subtle dark:border-outline-variant bg-surface-primary dark:bg-dark-surface shrink-0 z-10">
          <div className="p-4 border-b border-border-subtle dark:border-outline-variant flex items-center justify-between bg-surface-secondary dark:bg-dark-bg/30">
            <h2 className="font-headline-md text-[18px] font-semibold text-on-surface dark:text-inverse-on-surface">
              Data List
            </h2>
            <div className="flex items-center gap-2">
              <span className="font-body-sm text-[12px] text-outline">
                Sort:
              </span>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="py-1 text-body-sm w-auto pr-9 font-medium text-primary border-none bg-surface-primary dark:bg-dark-surface"
              >
                <option value="relevance">Relevance</option>
                <option value="rating-desc">Rating (High → Low)</option>
                <option value="reviews-desc">Reviews (Most)</option>
                <option value="name-asc">Name (A → Z)</option>
              </Select>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {visibleLeads.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={<Search size={20} />}
                  title="No matching leads"
                  description="Try clearing some filters or searching for a different keyword."
                />
              </div>
            ) : (
              visibleLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  active={lead.id === activeId}
                  selected={selectedIds.has(lead.id)}
                  onSelect={() => toggleSelect(lead.id)}
                  onClick={() => {
                    setActiveId(lead.id);
                    setDrawerLead(lead);
                  }}
                />
              ))
            )}
          </div>
        </aside>

        {/* Drawer */}
        <LeadDrawer
          lead={drawerLead}
          onClose={() => setDrawerLead(null)}
          onExportContact={async (lead) => {
            await exportLeadsToExcel([lead], lead.name);
            success("Exported contact", `${lead.name}.xlsx`);
          }}
          onSaveNote={(_lead, note) => {
            info("Note saved", note ? note.slice(0, 60) + "…" : "Empty note");
          }}
        />
      </div>
    </div>
  );
}

function LeadCard({
  lead,
  active,
  selected,
  onSelect,
  onClick,
}: {
  lead: Lead;
  active: boolean;
  selected: boolean;
  onSelect: () => void;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "p-5 border-b border-border-subtle dark:border-outline-variant border-l-4 cursor-pointer transition-colors",
        active
          ? "bg-surface-container-low dark:bg-inverse-surface/40 border-l-primary"
          : "bg-surface-primary dark:bg-dark-surface border-l-transparent hover:bg-surface-container-low dark:hover:bg-inverse-surface/30",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label={selected ? "Deselect lead" : "Select lead"}
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className="mt-0.5"
        >
          {selected ? (
            <CheckSquare size={18} className="text-primary" />
          ) : (
            <Square size={18} className="text-outline" />
          )}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="font-headline-md text-[16px] font-bold text-on-surface dark:text-inverse-on-surface leading-tight truncate">
              {lead.name}
            </h3>
            {lead.rating !== undefined && (
              <Badge
                tone={lead.rating >= 4.5 ? "success" : "neutral"}
                className="!py-0.5"
              >
                <Star size={10} fill="currentColor" /> {lead.rating}
              </Badge>
            )}
          </div>
          {lead.address && (
            <p className="font-body-sm text-[13px] text-on-surface-variant mb-3 flex items-start gap-1.5">
              <MapPin size={14} className="text-outline mt-0.5 shrink-0" />
              <span className="truncate">{lead.address}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 font-body-sm text-[12px] text-on-surface-variant">
            {lead.phone && (
              <span className="flex items-center gap-1">
                <Phone size={12} /> {lead.phone}
              </span>
            )}
            {lead.website && (
              <span className="flex items-center gap-1 text-primary truncate max-w-[180px]">
                <Globe size={12} />{" "}
                {lead.website.replace(/^https?:\/\//, "")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
