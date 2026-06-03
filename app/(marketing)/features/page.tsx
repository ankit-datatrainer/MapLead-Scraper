import type { Metadata } from "next";
import Link from "next/link";
import { Map, Filter, Download, ShieldCheck, Zap, Sparkles, BarChart3, Globe, Clock } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Features — ${APP_NAME}`,
  description: "Explore all MapLead Scraper features: geo-targeted scraping, advanced filters, Excel/CSV/JSON export, live progress, saved searches, and more.",
  alternates: { canonical: "/features" },
};

const FEATURES = [
  {
    icon: <Map size={24} />,
    title: "Geo-Targeted Scraping",
    description: "Search any city, state, zip code, or country with an adjustable radius from 1 to 50 miles. A live map preview shows your extraction area before you launch.",
    details: ["City, state, zip, or country targeting", "1–50 mile radius slider", "Live map area preview", "Multiple location support"],
  },
  {
    icon: <Filter size={24} />,
    title: "Advanced Filters",
    description: "Narrow your dataset before it even lands in your export. Filter by minimum rating, review count, phone number presence, and website availability.",
    details: ["Minimum star rating (3★, 4★, 4.5★)", "Minimum review count threshold", "Must-have phone number filter", "Must-have website filter"],
  },
  {
    icon: <Download size={24} />,
    title: "Multi-Format Export",
    description: "Export your leads in the format that fits your workflow. All exports happen entirely in your browser — no data ever touches our servers.",
    details: ["Excel (.xlsx) with formatted headers", "CSV for any spreadsheet tool", "JSON for developers and APIs", "Filtered, selected, or full export"],
  },
  {
    icon: <ShieldCheck size={24} />,
    title: "Bring Your Own API Key",
    description: "Your Apify token is stored locally in your browser and used only for execution. We never store credentials on our servers.",
    details: ["Token stored in browser only", "Never sent to MapLead servers", "Full control over your Apify account", "Transparent cost visibility"],
  },
  {
    icon: <Zap size={24} />,
    title: "Live Progress Tracking",
    description: "Watch your scrape run in real time with animated progress bars, partial result counts, and instant status updates.",
    details: ["Real-time progress percentage", "Partial result count as it runs", "Success / failure status chips", "Retry failed jobs instantly"],
  },
  {
    icon: <Sparkles size={24} />,
    title: "Saved Search Presets",
    description: "Save any search configuration as a named preset and re-run it in one click. Perfect for recurring outreach campaigns.",
    details: ["Name and save any search config", "One-click re-run", "Average result count tracking", "Manage and delete presets"],
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Results Library",
    description: "All your completed scrape jobs are stored in a searchable library. Sort, filter, bulk-export, or delete jobs at any time.",
    details: ["Searchable job history", "Sort by name, date, or result count", "Bulk export multiple jobs", "Bulk delete with confirmation"],
  },
  {
    icon: <Globe size={24} />,
    title: "Interactive Results Map",
    description: "Every result is plotted on an interactive map. Click any pin to see the full lead details in a side drawer.",
    details: ["Leaflet-powered interactive map", "Click pins to view lead details", "Map syncs with list filters", "Mobile-friendly layout"],
  },
  {
    icon: <Clock size={24} />,
    title: "Lead Detail Drawer",
    description: "Click any lead to open a full detail drawer with all available data: address, phone, website, hours, rating, and more.",
    details: ["Full contact information", "Business hours display", "Rating and review count", "Export single contact"],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingNav />

      {/* Hero */}
      <section className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pt-20 pb-12 text-center">
        <span className="inline-block font-mono text-label-mono uppercase tracking-wider text-primary mb-4">Features</span>
        <h1 className="font-display-lg text-headline-lg md:text-display-lg font-bold text-on-surface mb-4 text-balance">
          Everything you need to find leads fast
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
          Built on Apify infrastructure. Bring your own API key and own your data — no middlemen, no lock-in.
        </p>
        <Link href="/signup" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-on-primary-fixed-variant transition-colors">
          Start for free
        </Link>
      </section>

      {/* Feature grid */}
      <section className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-surface-primary rounded-xl border border-border-subtle p-6 shadow-ambient hover:shadow-ambient-hover transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary-container text-primary flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h2 className="font-headline-md text-[18px] font-semibold text-on-surface mb-2">{f.title}</h2>
              <p className="text-body-sm text-on-surface-variant mb-4">{f.description}</p>
              <ul className="space-y-1.5">
                {f.details.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-16 px-margin-mobile lg:px-margin-desktop text-center">
        <h2 className="font-headline-lg text-headline-lg font-bold mb-3">Ready to start extracting leads?</h2>
        <p className="text-body-md opacity-90 mb-6 max-w-xl mx-auto">Create a free account and run your first scrape in under two minutes.</p>
        <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-6 py-3 rounded-lg hover:bg-surface-container-low transition-colors">
          Get started free
        </Link>
      </section>

      <Footer />
    </div>
  );
}
