"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  HelpCircle,
  Search,
  Menu,
  LogOut,
  Settings as SettingsIcon,
  User as UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/lib/store";
import { getInitials } from "@/lib/formatters";

interface TopbarProps {
  onMobileMenu: () => void;
}

export function Topbar({ onMobileMenu }: TopbarProps) {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const signOut = useAppStore((s) => s.signOut);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [menuOpen]);

  const initials = getInitials(user?.fullName);

  function onSignOut() {
    setMenuOpen(false);
    signOut();
    router.replace("/login");
  }

  return (
    <header className="bg-surface-primary/85 glass-header sticky top-0 z-30 border-b border-border-subtle flex items-center h-16 px-4 lg:px-gutter-desktop gap-4">
      <button
        type="button"
        aria-label="Open navigation menu"
        onClick={onMobileMenu}
        className="lg:hidden p-2 -ml-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low"
      >
        <Menu size={22} />
      </button>

      <div className="lg:hidden font-headline-md font-bold text-primary mr-auto">
        MapLead
      </div>

      <div className="hidden lg:flex flex-1 max-w-md">
        <Input
          icon={<Search size={18} />}
          placeholder="Search saved places, scrapes…"
          aria-label="Search"
          className="bg-surface-container-low"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          type="button"
          aria-label="Notifications"
          className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          <Bell size={20} />
        </button>
        <Link
          href="/contact"
          aria-label="Help center"
          className="hidden sm:inline-flex p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
        >
          <HelpCircle size={20} />
        </Link>

        {/* User menu */}
        <div className="relative ml-2" ref={menuRef}>
          <button
            type="button"
            aria-label={`Account menu — ${user?.fullName ?? "user"}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          >
            {initials}
          </button>
          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-60 bg-surface-primary border border-border-subtle rounded-lg shadow-md py-1 z-40"
            >
              <div className="px-4 py-3 border-b border-border-subtle">
                <p className="font-body-sm text-body-sm font-semibold text-on-surface truncate">
                  {user?.fullName || "Account"}
                </p>
                {user?.email && (
                  <p className="font-body-sm text-[12px] text-on-surface-variant truncate">
                    {user.email}
                  </p>
                )}
              </div>
              <Link
                role="menuitem"
                href="/dashboard/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <UserIcon size={16} /> My Profile
              </Link>
              <Link
                role="menuitem"
                href="/dashboard/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-body-sm text-on-surface hover:bg-surface-container-low transition-colors"
              >
                <SettingsIcon size={16} /> Settings
              </Link>
              <hr className="my-1 border-border-subtle" />
              <button
                type="button"
                role="menuitem"
                onClick={onSignOut}
                className="w-full text-left flex items-center gap-2 px-4 py-2 text-body-sm text-error hover:bg-error-container/40 transition-colors"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
