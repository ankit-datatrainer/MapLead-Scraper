"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Rocket,
  Users,
  Download,
  ArrowUp,
  Clock,
  Lightbulb,
  Map as MapIcon,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber, timeAgo } from "@/lib/formatters";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function DashboardPage() {
  const jobs = useAppStore((s) => s.jobs);
  const settings = useAppStore((s) => s.settings);
  const recentJobs = jobs.slice(0, 4);

  const totalLeads = jobs.reduce((sum, j) => sum + j.resultCount, 0);
  const totalExports = jobs.filter((j) => j.status === "completed").length;
  const hasApiKey = !!settings.apifyApiKey;
  const credits = { used: settings.apifyCreditsUsed || 0, total: hasApiKey ? 100 : 0, daysLeft: 30 };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 lg:p-gutter-desktop max-w-container-max mx-auto w-full"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display-lg text-headline-lg lg:text-display-lg text-on-background dark:text-inverse-on-surface font-semibold">
            Dashboard
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Overview of your extraction tasks and usage.
          </p>
        </div>
        <Link
          href="/dashboard/new-scrape"
          className="bg-primary text-on-primary rounded-lg py-2.5 px-6 font-semibold hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/20 shrink-0"
        >
          <Rocket size={18} />
          Start New Scraping
        </Link>
      </motion.div>

      {/* Stats grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Leads"
          value={formatNumber(totalLeads)}
          icon={<Users size={18} />}
          trend={
            totalLeads === 0 ? (
              <span className="flex items-center gap-1 text-on-surface-variant">
                Run your first scrape to populate this
              </span>
            ) : (
              <span className="flex items-center gap-1 text-secondary">
                <ArrowUp size={14} /> Across {formatNumber(jobs.length)} job
                {jobs.length === 1 ? "" : "s"}
              </span>
            )
          }
        />
        <StatCard
          label="Completed Scrapes"
          value={formatNumber(totalExports)}
          icon={<Download size={18} />}
          trend={
            totalExports === 0 ? (
              <span className="flex items-center gap-1 text-on-surface-variant">
                <Clock size={14} /> No completed runs yet
              </span>
            ) : (
              <span className="flex items-center gap-1 text-on-surface-variant">
                <Clock size={14} /> Ready to export
              </span>
            )
          }
        />
        <CreditsCard
          used={credits.used}
          total={credits.total}
          daysLeft={credits.daysLeft}
          hasApiKey={hasApiKey}
        />
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent jobs */}
        <motion.section variants={itemVariants} className="lg:col-span-2 bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant shadow-ambient flex flex-col">
          <div className="p-6 border-b border-border-subtle dark:border-outline-variant flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-on-background dark:text-inverse-on-surface">
              Recent Scrapes
            </h2>
            <Link
              href="/dashboard/results"
              className="font-body-sm text-body-sm text-primary font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-secondary dark:bg-inverse-surface/30 border-b border-border-subtle dark:border-outline-variant">
                  <th className="py-3 px-6 font-mono text-label-mono text-outline uppercase tracking-wider">
                    Search Query
                  </th>
                  <th className="py-3 px-6 font-mono text-label-mono text-outline uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-3 px-6 font-mono text-label-mono text-outline uppercase tracking-wider">
                    Results
                  </th>
                  <th className="py-3 px-6 font-mono text-label-mono text-outline uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-sm text-body-sm">
                {recentJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-border-subtle dark:border-outline-variant hover:bg-surface-container-low dark:hover:bg-inverse-surface/40 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-on-surface dark:text-inverse-on-surface">
                        {job.name}
                      </div>
                      <div className="text-on-surface-variant text-[12px] mt-1">
                        {timeAgo(job.createdAt)}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {job.status === "running" ? (
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-primary font-medium">
                              Processing ({job.progress ?? 0}%)
                            </span>
                          </div>
                          <div className="w-full bg-surface-container rounded-full h-1 mt-2">
                            <div
                              className="bg-primary h-1 rounded-full pulse-bar"
                              style={{ width: `${job.progress ?? 0}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : job.status === "completed" ? (
                        <Badge tone="success">
                          <CheckCircle2 size={14} /> Completed
                        </Badge>
                      ) : job.status === "failed" ? (
                        <Badge tone="error">
                          <XCircle size={14} /> Failed
                        </Badge>
                      ) : (
                        <Badge>Idle</Badge>
                      )}
                    </td>
                    <td className="py-4 px-6 text-on-surface-variant">
                      {job.status === "running"
                        ? `~${formatNumber(job.resultCount)} found`
                        : job.status === "failed"
                          ? "—"
                          : `${formatNumber(job.resultCount)} leads`}
                    </td>
                    <td className="py-4 px-6 text-right">
                      {job.status === "completed" ? (
                        <Link
                          href={`/dashboard/results/${job.id}`}
                          className="inline-flex items-center gap-1 bg-surface-secondary dark:bg-inverse-surface border border-border-subtle dark:border-outline-variant text-on-surface dark:text-inverse-on-surface hover:border-primary hover:text-primary rounded px-3 py-1.5 text-[13px] font-medium transition-colors"
                        >
                          <Download size={16} /> View
                        </Link>
                      ) : (
                        <Button variant="ghost" size="sm" aria-label="More">
                          ⋯
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
                {recentJobs.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-on-surface-variant"
                    >
                      No scrapes yet. Click&nbsp;
                      <Link
                        href="/dashboard/new-scrape"
                        className="text-primary hover:underline"
                      >
                        Start New Scraping
                      </Link>
                      &nbsp;to begin.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Right column */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
          {/* Tip card */}
          <div className="bg-primary-container text-on-primary-container rounded-xl p-6 shadow-ambient relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary rounded-full opacity-20 blur-2xl pointer-events-none" />
            <div className="flex items-start gap-3 relative z-10">
              <Lightbulb className="text-surface-container-highest" size={28} />
              <div>
                <h4 className="font-headline-md text-[18px] font-semibold mb-2">
                  Maximize your results
                </h4>
                <p className="font-body-sm text-body-sm opacity-90 mb-4">
                  Use specific keywords alongside generic categories to filter
                  out irrelevant businesses. E.g., instead of just
                  &quot;Restaurants&quot;, try &quot;Vegan Restaurants&quot;.
                </p>
                <Link
                  href="/dashboard/new-scrape"
                  className="bg-surface-primary text-primary font-medium text-body-sm py-1.5 px-4 rounded hover:bg-surface-container-lowest transition-colors inline-block"
                >
                  Try it now
                </Link>
              </div>
            </div>
          </div>

          {/* Activity Map placeholder */}
          <div className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant shadow-ambient flex flex-col overflow-hidden flex-1">
            <div className="p-4 border-b border-border-subtle dark:border-outline-variant">
              <h4 className="font-body-md text-body-md font-semibold text-on-background dark:text-inverse-on-surface">
                Recent Activity Map
              </h4>
            </div>
            <div className="relative flex-1 min-h-[200px] bg-surface-container-low dark:bg-inverse-surface/30 flex items-center justify-center p-4">
              <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle,#0b1c30_1px,transparent_1px)] [background-size:20px_20px]" />
              <div className="text-center z-10">
                <MapIcon
                  size={48}
                  className="text-outline opacity-50 mx-auto mb-2"
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[200px] mx-auto">
                  {jobs.length === 0
                    ? "Start a scrape to see your geographic activity here."
                    : `Your scrapes have run across ${new Set(jobs.map((j) => j.location)).size} location${new Set(jobs.map((j) => j.location)).size === 1 ? "" : "s"}.`}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend: React.ReactNode;
}) {
  return (
    <div className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant p-6 shadow-ambient hover:shadow-ambient-hover transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-label-mono uppercase text-outline">
          {label}
        </span>
        <div className="w-8 h-8 rounded-full bg-surface-container-low dark:bg-inverse-surface flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <div className="font-display-lg text-headline-lg font-bold text-on-background dark:text-inverse-on-surface">
        {value}
      </div>
      <div className="flex items-center gap-1 mt-2 font-body-sm text-body-sm">
        {trend}
      </div>
    </div>
  );
}

function CreditsCard({
  used,
  total,
  daysLeft,
  hasApiKey,
}: {
  used: number;
  total: number;
  daysLeft: number;
  hasApiKey: boolean;
}) {
  if (!hasApiKey) {
    return (
      <div className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant p-6 shadow-ambient hover:shadow-ambient-hover transition-shadow flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-label-mono uppercase text-outline">
              Apify Credits
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Not connected
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">
            Add your Apify API key to track usage and run real scrapes.
          </p>
        </div>
        <Link
          href="/dashboard/settings"
          className="mt-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:bg-on-primary-fixed-variant transition-colors"
        >
          Add API key
        </Link>
      </div>
    );
  }
  const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
  return (
    <div className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant p-6 shadow-ambient hover:shadow-ambient-hover transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-label-mono uppercase text-outline">
            Apify Credits
          </span>
          <span className="font-body-sm text-body-sm font-semibold text-primary">
            ${used.toFixed(2)} / ${total.toFixed(0)}
          </span>
        </div>
        <div className="w-full bg-surface-container rounded-full h-2 mt-4 overflow-hidden">
          <div
            className="bg-primary h-2 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <div className="mt-4 font-body-sm text-body-sm text-on-surface-variant">
        Renews in {daysLeft} days.
      </div>
    </div>
  );
}
