"use client";

import Link from "next/link";
import { useAuthUser } from "@/lib/store";
import { User } from "lucide-react";

export function MarketingNav() {
  const user = useAuthUser();
  return (
    <nav className="bg-surface-primary/90 glass-header sticky top-0 z-40 border-b border-border-subtle">
      <div className="max-w-container-max mx-auto h-16 flex items-center justify-between px-margin-mobile lg:px-margin-desktop">
        <Link href="/" className="font-headline-md font-bold text-primary">
          MapLead Scraper
        </Link>
        <div className="hidden md:flex items-center gap-6">
          <Link href="/features" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Features</Link>
          <Link href="/#workflow" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">How it works</Link>
          <Link href="/#faq" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">FAQ</Link>
          <Link href="/docs" className="text-body-sm text-on-surface-variant hover:text-primary transition-colors">Docs</Link>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="bg-primary text-white text-body-sm font-semibold px-4 py-2 rounded-lg hover:bg-on-primary-fixed-variant transition-colors flex items-center gap-2"
            >
              <User size={16} />
              {user.fullName || "Dashboard"}
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden sm:inline text-body-sm text-on-surface-variant hover:text-primary transition-colors px-3 py-2">Sign in</Link>
              <Link href="/signup" className="bg-primary text-white text-body-sm font-semibold px-4 py-2 rounded-lg hover:bg-on-primary-fixed-variant transition-colors">
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
