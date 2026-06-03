"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { useAppStore } from "@/lib/store";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);

  const hydrated = useAppStore((s) => s.hydrated);
  const user = useAppStore((s) => s.user);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return (
      <div
        className="min-h-screen bg-background dark:bg-dark-bg flex items-center justify-center"
        role="status"
        aria-label="Loading"
      >
        <div className="flex flex-col items-center gap-3 text-on-surface-variant">
          <Loader2 className="animate-spin text-primary" size={28} />
          <span className="font-body-sm text-body-sm">Loading…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex">
      <div className="fixed left-0 top-0 h-full hidden lg:flex z-40">
        <Sidebar />
      </div>
      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen min-w-0">
        <Topbar onMobileMenu={() => setNavOpen(true)} />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
