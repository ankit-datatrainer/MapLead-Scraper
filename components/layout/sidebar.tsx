"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Inbox,
  Star,
  KeyRound,
  HelpCircle,
  LogOut,
  Play,
  Shield,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useAppStore } from "@/lib/store";
import type { LucideIcon } from "lucide-react";

const NAV: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/new-scrape", label: "New Scrape", icon: PlusCircle },
  { href: "/dashboard/results", label: "Results Library", icon: Inbox },
  { href: "/dashboard/saved-searches", label: "Saved Searches", icon: Star },
  { href: "/dashboard/settings?tab=api-key", label: "API Settings", icon: KeyRound },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const signOut = useAppStore((s) => s.signOut);

  function handleLogout() {
    onNavigate?.();
    signOut();
    router.replace("/login");
  }

  return (
    <nav
      className="h-full w-[280px] flex flex-col bg-surface-secondary border-r border-border-subtle"
      aria-label="Primary navigation"
    >
      <div className="p-6 pb-2 border-b border-border-subtle">
        <Logo />
      </div>

      <div className="px-4 py-4">
        <Link
          href="/dashboard/new-scrape"
          onClick={onNavigate}
          className="w-full bg-primary text-white font-body-sm font-semibold rounded-lg py-2.5 px-4 hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-2 shadow-sm shadow-primary/20"
        >
          <Play size={18} fill="currentColor" />
          Start Scraping
        </Link>
      </div>

      <ul className="flex flex-col px-4 gap-y-1 flex-1 overflow-y-auto custom-scrollbar">
        {NAV.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href.split('?')[0]);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg font-body-sm text-body-sm transition-all duration-200",
                  active
                    ? "bg-primary-container text-on-primary-container font-semibold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-primary",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="px-4 py-6 border-t border-border-subtle flex flex-col gap-1">

        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-2 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
        >
          <HelpCircle size={20} /> Help Center
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors text-left"
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </nav>
  );
}
