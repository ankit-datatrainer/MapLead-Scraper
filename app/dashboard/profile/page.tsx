"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  User,
  Mail,
  Building2,
  Calendar,
  KeyRound,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatters";
import { getInitials } from "@/lib/formatters";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const jobs = useAppStore((s) => s.jobs);

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) return null;

  const completedJobs = jobs.filter((j) => j.status === "completed");
  const totalLeads = completedJobs.reduce((sum, j) => sum + (j.resultCount ?? 0), 0);

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-1">
          My Profile
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Your account details and usage summary.
        </p>
      </div>

      {/* Profile card */}
      <div className="bg-surface-primary rounded-xl border border-border-subtle shadow-ambient p-6 md:p-8 mb-6">
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-2xl shrink-0">
            {getInitials(user.fullName)}
          </div>
          <div>
            <h2 className="font-headline-md text-xl font-bold text-on-surface">
              {user.fullName}
            </h2>
            <p className="text-body-sm text-on-surface-variant">{user.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full text-[12px] font-semibold">
              All Features Enabled
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={<User size={16} />} label="Full Name" value={user.fullName} />
          <InfoRow icon={<Mail size={16} />} label="Email" value={user.email} />
          {user.company && (
            <InfoRow icon={<Building2 size={16} />} label="Company" value={user.company} />
          )}
          <InfoRow
            icon={<Calendar size={16} />}
            label="Member Since"
            value={formatDate(user.createdAt)}
          />
          <InfoRow icon={<KeyRound size={16} />} label="Account ID" value={user.id} mono />
        </div>
      </div>

      {/* Usage stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Scrapes" value={jobs.length} />
        <StatCard label="Completed" value={completedJobs.length} />
        <StatCard label="Leads Extracted" value={totalLeads.toLocaleString()} />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/dashboard">
          <Button variant="secondary">
            <LayoutDashboard size={16} /> Go to Dashboard
          </Button>
        </Link>
        <Link href="/dashboard/new-scrape">
          <Button>
            <PlusCircle size={16} /> Start New Scrape
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button variant="outline">
            <KeyRound size={16} /> API Settings
          </Button>
        </Link>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-surface-secondary rounded-lg">
      <div className="text-primary mt-0.5">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-mono text-outline uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p
          className={`text-body-sm font-medium text-on-surface truncate ${mono ? "font-mono text-[12px]" : ""}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-surface-primary rounded-xl border border-border-subtle p-4 text-center">
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="text-[12px] text-on-surface-variant mt-1">{label}</p>
    </div>
  );
}
