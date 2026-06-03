"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  Plus,
  Store,
  Wrench,
  HeartPulse,
  Dumbbell,
  Briefcase,
  Coffee,
  Building2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { exportLeadsToExcel } from "@/lib/export-excel";
import { cn } from "@/lib/utils";
import { formatNumber, formatDate, formatTime } from "@/lib/formatters";
import type { ScrapeJob, ScrapeStatus } from "@/types/scrape";

const PAGE_SIZE = 10;

type SortKey = "name" | "date" | "results";
type SortDir = "asc" | "desc";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  food: Coffee,
  home: Wrench,
  health: HeartPulse,
  retail: Store,
  professional: Briefcase,
  fitness: Dumbbell,
  "real-estate": Building2,
};

export default function ResultsLibraryPage() {
  const router = useRouter();
  const jobs = useAppStore((s) => s.jobs);
  const removeJob = useAppStore((s) => s.removeJob);
  const { success, error: errorToast, info } = useToast();

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ScrapeStatus | "all">(
    "all",
  );
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState<ScrapeJob | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);

  const filtered = useMemo(() => {
    let list = jobs.slice();
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (j) =>
          j.name.toLowerCase().includes(q) ||
          j.keyword.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      list = list.filter((j) => j.status === statusFilter);
    }
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortKey) {
        case "name":
          return a.name.localeCompare(b.name) * dir;
        case "results":
          return (a.resultCount - b.resultCount) * dir;
        case "date":
        default:
          return (
            (new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()) *
            dir
          );
      }
    });
    return list;
  }, [jobs, query, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = filtered.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const allVisibleSelected =
    visible.length > 0 &&
    visible.every((j) => selected.has(j.id) || j.status !== "completed");

  const completedSelectedCount = Array.from(selected).filter((id) => {
    const j = jobs.find((x) => x.id === id);
    return j?.status === "completed";
  }).length;

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllVisible() {
    setSelected((prev) => {
      const next = new Set(prev);
      const completedVisible = visible.filter((j) => j.status === "completed");
      if (completedVisible.every((j) => next.has(j.id))) {
        completedVisible.forEach((j) => next.delete(j.id));
      } else {
        completedVisible.forEach((j) => next.add(j.id));
      }
      return next;
    });
  }

  async function exportJob(job: ScrapeJob) {
    if (!job.results || job.results.length === 0) {
      errorToast("No data", "This job has no results to export.");
      return;
    }
    try {
      const filename = await exportLeadsToExcel(job.results, job.name);
      success(`Exported ${job.results.length} leads`, filename);
    } catch (e) {
      errorToast(
        "Export failed",
        e instanceof Error ? e.message : "Try again.",
      );
    }
  }

  async function bulkExport() {
    const ids = Array.from(selected);
    if (ids.length === 0) {
      errorToast("Nothing selected", "Pick at least one completed job.");
      return;
    }
    const targets = jobs.filter(
      (j) => ids.includes(j.id) && j.status === "completed" && j.results,
    );
    if (targets.length === 0) {
      errorToast("Nothing to export", "Selected jobs have no results.");
      return;
    }
    const merged = targets.flatMap((j) => j.results ?? []);
    try {
      const filename = await exportLeadsToExcel(merged, "bulk-export");
      success(
        `Exported ${merged.length} leads from ${targets.length} jobs`,
        filename,
      );
    } catch (e) {
      errorToast(
        "Export failed",
        e instanceof Error ? e.message : "Try again.",
      );
    }
  }

  function bulkDelete() {
    const ids = Array.from(selected);
    ids.forEach((id) => removeJob(id));
    setSelected(new Set());
    setConfirmBulkDelete(false);
    success(`Deleted ${ids.length} job${ids.length === 1 ? "" : "s"}`);
  }

  return (
    <div className="p-margin-mobile lg:p-margin-desktop max-w-container-max mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-semibold text-on-surface dark:text-inverse-on-surface">
            Results Library
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage and export your completed data extraction jobs.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={bulkExport}
            disabled={completedSelectedCount === 0}
          >
            <Download size={16} /> Bulk export ({completedSelectedCount})
          </Button>
          <Link
            href="/dashboard/new-scrape"
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-body-sm font-semibold hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> New scrape
          </Link>
        </div>
      </div>

      {/* Card */}
      <div className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant shadow-ambient overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-subtle dark:border-outline-variant flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-surface-primary dark:bg-dark-surface">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="font-body-sm text-body-sm text-on-surface-variant font-medium whitespace-nowrap">
              Showing {filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}
              –{Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length} jobs
            </span>
          </div>
          <div className="flex items-center gap-3 flex-1 sm:flex-none sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Input
                icon={<Search size={16} />}
                placeholder="Filter by name, keyword, location..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                className="bg-surface-secondary dark:bg-inverse-surface/30"
              />
            </div>
            <div className="hidden sm:block">
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as ScrapeStatus | "all");
                  setPage(1);
                }}
                aria-label="Filter by status"
                className="w-40"
              >
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="running">Running</option>
                <option value="failed">Failed</option>
                <option value="idle">Idle</option>
              </Select>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="sm:hidden"
              onClick={() =>
                info("Status filter", "Use the dropdown on larger screens.")
              }
              aria-label="Filters"
            >
              <Filter size={16} />
            </Button>
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="p-10">
            <EmptyState
              icon={<Search size={20} />}
              title={
                query || statusFilter !== "all"
                  ? "No matching jobs"
                  : "No scrape jobs yet"
              }
              description={
                query || statusFilter !== "all"
                  ? "Try clearing the search or status filter."
                  : "Run your first scrape to see it appear here."
              }
              action={
                !query &&
                statusFilter === "all" && (
                  <Link
                    href="/dashboard/new-scrape"
                    className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-semibold"
                  >
                    <Plus size={16} /> Start your first scrape
                  </Link>
                )
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-surface-secondary dark:bg-inverse-surface/30 border-b border-border-subtle dark:border-outline-variant">
                  <th className="w-12 px-4 py-3 text-center">
                    <input
                      aria-label="Select visible completed"
                      type="checkbox"
                      className="rounded border-outline text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                    />
                  </th>
                  <SortableTh
                    label="Job Name"
                    sortKey="name"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={toggleSort}
                  />
                  <SortableTh
                    label="Date Run"
                    sortKey="date"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={toggleSort}
                  />
                  <SortableTh
                    label="Results"
                    sortKey="results"
                    activeKey={sortKey}
                    dir={sortDir}
                    onClick={toggleSort}
                    align="right"
                  />
                  <th className="px-6 py-3 font-mono text-label-mono text-on-surface-variant uppercase tracking-wider font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-3 font-mono text-label-mono text-on-surface-variant uppercase tracking-wider font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle dark:divide-outline-variant">
                {visible.map((job) => {
                  const Icon =
                    CATEGORY_ICONS[job.category ?? ""] ?? Briefcase;
                  const failed = job.status === "failed";
                  return (
                    <tr
                      key={job.id}
                      className="group hover:bg-surface-container-low dark:hover:bg-inverse-surface/30 transition-colors"
                    >
                      <td className="px-4 py-4 text-center">
                        <input
                          aria-label={`Select ${job.name}`}
                          type="checkbox"
                          className="rounded border-outline text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                          checked={selected.has(job.id)}
                          disabled={job.status !== "completed"}
                          onChange={() => toggleSelect(job.id)}
                        />
                      </td>
                      <td className={cn("px-6 py-4", failed && "opacity-75")}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-surface-container dark:bg-inverse-surface/50 flex items-center justify-center text-primary shrink-0">
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-body-sm text-body-sm font-medium text-on-surface dark:text-inverse-on-surface truncate">
                              {job.name}
                            </p>
                            <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5 truncate">
                              query:{" "}
                              <span className="font-mono">
                                &quot;{job.keyword} in {job.location}&quot;
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={cn("px-6 py-4", failed && "opacity-75")}>
                        <p className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
                          {formatDate(job.createdAt)}
                        </p>
                        <p className="font-body-sm text-[12px] text-on-surface-variant">
                          {formatTime(job.createdAt)}
                        </p>
                      </td>
                      <td
                        className={cn(
                          "px-6 py-4 text-right",
                          failed && "opacity-75",
                        )}
                      >
                        {job.status === "failed" ? (
                          <span className="font-body-sm text-body-sm font-medium text-outline">
                            —
                          </span>
                        ) : (
                          <span className="font-body-sm text-body-sm font-medium text-on-surface dark:text-inverse-on-surface">
                            {formatNumber(job.resultCount)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <StatusChip status={job.status} progress={job.progress} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <RowActions
                          job={job}
                          onView={() =>
                            router.push(`/dashboard/results/${job.id}`)
                          }
                          onExport={() => exportJob(job)}
                          onDelete={() => setConfirmDelete(job)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="p-4 border-t border-border-subtle dark:border-outline-variant flex items-center justify-between bg-surface-secondary dark:bg-dark-bg/30 gap-3 flex-wrap">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
            >
              <ChevronLeft size={16} /> Previous
            </Button>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - safePage) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p) => {
                  const last = acc[acc.length - 1];
                  if (last !== undefined && last !== "..." && p - (last as number) > 1) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`e-${i}`}
                      className="text-on-surface-variant mx-1"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p as number)}
                      className={cn(
                        "w-8 h-8 rounded-md text-body-sm font-medium flex items-center justify-center transition-colors",
                        p === safePage
                          ? "bg-primary text-on-primary"
                          : "text-on-surface-variant hover:bg-surface-container",
                      )}
                    >
                      {p}
                    </button>
                  ),
                )}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
            >
              Next <ChevronRight size={16} />
            </Button>
          </div>
        )}
      </div>

      {/* Bulk delete bar */}
      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 bg-surface-primary dark:bg-dark-surface border border-border-subtle dark:border-outline-variant rounded-xl shadow-ambient-hover px-4 py-3 flex items-center gap-3">
          <span className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface">
            {selected.size} selected
          </span>
          <Button variant="secondary" size="sm" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
          <Button
            size="sm"
            onClick={bulkExport}
            disabled={completedSelectedCount === 0}
          >
            <Download size={14} /> Export
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setConfirmBulkDelete(true)}
          >
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      )}

      {/* Single-delete dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete this job?"
        description={confirmDelete?.name}
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!confirmDelete) return;
                removeJob(confirmDelete.id);
                success("Job deleted", confirmDelete.name);
                setConfirmDelete(null);
              }}
            >
              <Trash2 size={16} /> Delete
            </Button>
          </>
        }
      >
        <p className="text-body-sm text-on-surface-variant">
          The scraped leads will be removed from this device permanently.
        </p>
      </Dialog>

      {/* Bulk-delete dialog */}
      <Dialog
        open={confirmBulkDelete}
        onClose={() => setConfirmBulkDelete(false)}
        title={`Delete ${selected.size} jobs?`}
        size="sm"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setConfirmBulkDelete(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={bulkDelete}>
              <Trash2 size={16} /> Delete all
            </Button>
          </>
        }
      >
        <p className="text-body-sm text-on-surface-variant">
          This permanently removes the selected jobs and their leads from this
          device.
        </p>
      </Dialog>
    </div>
  );
}

/* ----------------------------- Components --------------------------- */

function SortableTh({
  label,
  sortKey,
  activeKey,
  dir,
  onClick,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  dir: SortDir;
  onClick: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const isActive = activeKey === sortKey;
  return (
    <th
      onClick={() => onClick(sortKey)}
      className={cn(
        "px-6 py-3 font-mono text-label-mono text-on-surface-variant uppercase tracking-wider font-semibold cursor-pointer group select-none",
        align === "right" && "text-right",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1",
          align === "right" && "justify-end",
        )}
      >
        {label}
        {isActive ? (
          dir === "asc" ? (
            <ArrowUp size={14} />
          ) : (
            <ArrowDown size={14} />
          )
        ) : (
          <ArrowDown
            size={14}
            className="opacity-0 group-hover:opacity-50 transition-opacity"
          />
        )}
      </div>
    </th>
  );
}

function StatusChip({
  status,
  progress,
}: {
  status: ScrapeStatus;
  progress?: number;
}) {
  if (status === "running") {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-primary font-medium font-body-sm text-[12px]">
            Running ({progress ?? 0}%)
          </span>
        </div>
        <div className="w-24 bg-surface-container rounded-full h-1 mt-1.5">
          <div
            className="bg-primary h-1 rounded-full pulse-bar"
            style={{ width: `${progress ?? 0}%` }}
          />
        </div>
      </div>
    );
  }
  if (status === "completed") {
    return (
      <Badge tone="success">
        <CheckCircle2 size={12} /> Completed
      </Badge>
    );
  }
  if (status === "failed") {
    return (
      <Badge tone="error">
        <XCircle size={12} /> Failed
      </Badge>
    );
  }
  return (
    <Badge tone="neutral">
      <Clock size={12} /> Idle
    </Badge>
  );
}

function RowActions({
  job,
  onView,
  onExport,
  onDelete,
}: {
  job: ScrapeJob;
  onView: () => void;
  onExport: () => void;
  onDelete: () => void;
}) {
  if (job.status === "failed") {
    return (
      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <button
          type="button"
          title="Retry"
          aria-label={`Retry ${job.name}`}
          onClick={() => onView()}
          className="flex items-center gap-1 px-2 py-1 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded transition-colors font-body-sm text-[12px] font-medium"
        >
          <RefreshCw size={14} /> Retry
        </button>
        <IconBtn
          title="Delete"
          aria-label={`Delete ${job.name}`}
          tone="danger"
          onClick={onDelete}
        >
          <Trash2 size={18} />
        </IconBtn>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
      <IconBtn
        title="View results"
        aria-label={`View ${job.name}`}
        onClick={onView}
        disabled={job.status !== "completed"}
      >
        <Eye size={18} />
      </IconBtn>
      <IconBtn
        title="Export Excel"
        aria-label={`Export ${job.name}`}
        onClick={onExport}
        disabled={job.status !== "completed"}
      >
        <Download size={18} />
      </IconBtn>
      <IconBtn
        title="Delete"
        aria-label={`Delete ${job.name}`}
        tone="danger"
        onClick={onDelete}
      >
        <Trash2 size={18} />
      </IconBtn>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  disabled,
  tone = "default",
  ...rest
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
  tone?: "default" | "danger";
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded transition-colors",
        tone === "danger"
          ? "text-on-surface-variant hover:text-error hover:bg-error-container/50"
          : "text-on-surface-variant hover:text-primary hover:bg-surface-container",
        disabled && "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-on-surface-variant",
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
