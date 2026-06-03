import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, KeyRound, Play, Filter, Download, Map, Star, Settings } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Documentation — ${APP_NAME}`,
  description: "MapLead Scraper documentation. Learn how to set up your Apify API key, run scrapes, filter results, and export leads.",
  alternates: { canonical: "/docs" },
};

const SECTIONS = [
  {
    id: "getting-started",
    icon: <BookOpen size={20} />,
    title: "Getting Started",
    steps: [
      { heading: "1. Create an account", body: "Sign up at maplead.app/signup with your email. All features are enabled immediately — no credit card required." },
      { heading: "2. Get your Apify API key", body: "Create a free account at apify.com. Go to Settings → Integrations → API tokens and copy your token. It starts with apify_api_." },
      { heading: "3. Add your API key", body: "In MapLead Scraper, go to Dashboard → API Settings and paste your Apify token. It is stored only in your browser and never sent to our servers." },
      { heading: "4. Run your first scrape", body: "Click \"New Scrape\" in the sidebar, enter a keyword (e.g. \"coffee shop\") and a location (e.g. \"Austin, TX\"), then click through the steps and hit Start Scraping." },
    ],
  },
  {
    id: "api-key",
    icon: <KeyRound size={20} />,
    title: "Apify API Key Setup",
    steps: [
      { heading: "Where to find your key", body: "Log in to apify.com → click your avatar → Settings → Integrations → API tokens. Create a new token or copy your existing one." },
      { heading: "Free tier limits", body: "Apify's free tier includes $5/month of compute credits, which is enough for roughly 2,000 results. Upgrade your Apify plan for higher volume." },
      { heading: "Key security", body: "Your key is stored in your browser's localStorage. It is never transmitted to MapLead servers. Clear your browser storage to remove it." },
      { heading: "Testing your key", body: "In API Settings, click \"Test Connection\" to verify your token is valid before running a scrape." },
    ],
  },
  {
    id: "running-scrapes",
    icon: <Play size={20} />,
    title: "Running Scrapes",
    steps: [
      { heading: "Step 1 — Target", body: "Enter your search keyword (e.g. \"plumber\", \"Italian restaurant\", \"hair salon\") and a location. Optionally select a category and adjust the search radius." },
      { heading: "Step 2 — Filters", body: "Set optional filters: minimum star rating, minimum review count, must-have phone number, must-have website. Filters are applied after extraction." },
      { heading: "Step 3 — Settings", body: "Enter your Apify API key and set a result limit (max results to extract). The estimated Apify cost is shown based on your limit." },
      { heading: "Step 4 — Launch", body: "Review your configuration summary and click Start Scraping. You'll be redirected to the results page when the scrape completes." },
    ],
  },
  {
    id: "filters",
    icon: <Filter size={20} />,
    title: "Filtering Results",
    steps: [
      { heading: "Pre-scrape filters", body: "Set filters in Step 2 of the New Scrape wizard. These are applied to the raw Apify output before results are saved." },
      { heading: "Post-scrape filters", body: "On the Results page, use the left sidebar to further filter by search term, phone, website, and minimum rating." },
      { heading: "Active filter chips", body: "Active filters are shown as removable chips at the top of the filter panel. Click the × on any chip to remove that filter." },
      { heading: "Sort options", body: "Sort the results list by Relevance, Rating (high to low), Reviews (most), or Name (A–Z) using the dropdown above the list." },
    ],
  },
  {
    id: "export",
    icon: <Download size={20} />,
    title: "Exporting Data",
    steps: [
      { heading: "Excel (.xlsx)", body: "Click \"Filtered → Excel\" or \"All → Excel\" in the Export section of the results sidebar. The file downloads immediately with formatted column headers." },
      { heading: "CSV", body: "Click \"Filtered → CSV\" to download a comma-separated file compatible with Google Sheets, Excel, and any other spreadsheet tool." },
      { heading: "JSON", body: "Click \"Filtered → JSON\" to download a structured JSON file. Useful for importing into CRMs, databases, or custom scripts." },
      { heading: "Selected rows", body: "Check the boxes next to individual leads, then click \"Selected (N) → Excel\" to export only those rows." },
      { heading: "Bulk export", body: "In the Results Library, select multiple completed jobs and click \"Bulk export\" to merge all their leads into a single Excel file." },
    ],
  },
  {
    id: "map",
    icon: <Map size={20} />,
    title: "Results Map",
    steps: [
      { heading: "Map overview", body: "Every lead with coordinates is plotted as a pin on the interactive map. The map is visible on the results detail page on medium and large screens." },
      { heading: "Selecting a lead", body: "Click any pin on the map or any row in the list to highlight that lead. The map and list stay in sync." },
      { heading: "Lead drawer", body: "Click a lead card to open the full detail drawer with all available data: address, phone, website, hours, rating, and reviews." },
    ],
  },
  {
    id: "saved-searches",
    icon: <Star size={20} />,
    title: "Saved Searches",
    steps: [
      { heading: "Saving a search", body: "In Step 4 of the New Scrape wizard, check \"Save these settings as a preset\" and give it a name. You can also save from the results page sidebar." },
      { heading: "Re-running a preset", body: "Go to Dashboard → Saved Searches. Click \"Run\" on any preset to launch a new scrape with those exact settings." },
      { heading: "Managing presets", body: "Delete presets you no longer need from the Saved Searches page. Presets are stored locally in your browser." },
    ],
  },
  {
    id: "settings",
    icon: <Settings size={20} />,
    title: "Settings",
    steps: [
      { heading: "API Settings", body: "Go to Dashboard → API Settings to update your Apify API key, set a default result limit, and configure your default search radius." },
      { heading: "Account", body: "Update your name, email, and company from Dashboard → My Profile." },
      { heading: "Data storage", body: "All scrape data is stored in your browser's localStorage. Clearing browser data will remove your jobs and saved searches. Export important results before clearing." },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingNav />

      <div className="max-w-container-max mx-auto px-margin-mobile lg:px-margin-desktop py-12 w-full flex-1 flex gap-10">
        {/* Sidebar TOC */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <p className="font-mono text-label-mono text-outline uppercase tracking-wider mb-4">Contents</p>
            <nav className="flex flex-col gap-1">
              {SECTIONS.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-primary transition-colors py-1">
                  <span className="text-primary">{s.icon}</span>
                  {s.title}
                </a>
              ))}
            </nav>
            <div className="mt-8 p-4 bg-primary-container rounded-lg">
              <p className="text-body-sm font-medium text-on-primary-container mb-2">Need help?</p>
              <Link href="/contact" className="text-body-sm text-primary hover:underline font-semibold">Contact Support →</Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <h1 className="font-display-lg text-headline-lg font-bold text-on-surface mb-2">Documentation</h1>
          <p className="text-body-md text-on-surface-variant mb-10">Everything you need to get the most out of MapLead Scraper.</p>

          <div className="space-y-14">
            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg bg-primary-container text-primary flex items-center justify-center shrink-0">
                    {section.icon}
                  </div>
                  <h2 className="font-headline-md text-xl font-bold text-on-surface">{section.title}</h2>
                </div>
                <div className="space-y-5 pl-11">
                  {section.steps.map((step) => (
                    <div key={step.heading} className="bg-surface-primary rounded-lg border border-border-subtle p-5">
                      <h3 className="font-semibold text-on-surface mb-1.5">{step.heading}</h3>
                      <p className="text-body-sm text-on-surface-variant leading-relaxed">{step.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-14 p-6 bg-surface-primary rounded-xl border border-border-subtle text-center">
            <p className="text-on-surface font-medium mb-2">Still have questions?</p>
            <p className="text-body-sm text-on-surface-variant mb-4">Our support team is happy to help.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-on-primary-fixed-variant transition-colors">
              Contact Support
            </Link>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
