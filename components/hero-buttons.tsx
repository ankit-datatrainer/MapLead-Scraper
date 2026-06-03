"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuthUser } from "@/lib/store";

export function HeroButtons() {
  const user = useAuthUser();

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      {user ? (
        <Link
          href="/dashboard"
          className="bg-primary text-on-primary font-body-md text-body-md font-semibold px-8 py-3 rounded-lg hover:shadow-md hover:bg-on-primary-fixed-variant transition-all flex items-center justify-center gap-2"
        >
          Go to Dashboard
          <ArrowRight size={20} />
        </Link>
      ) : (
        <Link
          href="/signup"
          className="bg-primary text-on-primary font-body-md text-body-md font-semibold px-8 py-3 rounded-lg hover:shadow-md hover:bg-on-primary-fixed-variant transition-all flex items-center justify-center gap-2"
        >
          Start Scraping Free
          <ArrowRight size={20} />
        </Link>
      )}
      <Link
        href="#features"
        className="bg-surface-primary dark:bg-dark-surface text-on-surface dark:text-inverse-on-surface border border-border-subtle dark:border-outline-variant font-body-md text-body-md font-semibold px-8 py-3 rounded-lg hover:bg-surface-secondary dark:hover:bg-inverse-surface transition-all flex items-center justify-center gap-2"
      >
        View Features
      </Link>
    </div>
  );
}
