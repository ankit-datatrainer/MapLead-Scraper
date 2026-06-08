import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  Bolt,
  Map as MapIcon,
  Filter,
  Download,
  ShieldCheck,
  Zap,
  Sparkles,
  Star,
  Check,
} from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { HeroButtons } from "@/components/hero-buttons";
import { APP_DESCRIPTION, APP_NAME, PLANS } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${APP_NAME} — Scrape Google Maps Leads in Seconds`,
  description: APP_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${APP_NAME} — Scrape Google Maps Leads in Seconds`,
    description: APP_DESCRIPTION,
    url: "/",
    type: "website",
  },
};

export default function LandingPage() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://maplead.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: APP_NAME,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl,
        description: APP_DESCRIPTION,
      },
      {
        "@type": "Organization",
        name: APP_NAME,
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Do I need to provide my own Apify API key?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. You bring your own Apify account and API key on every plan. This keeps usage costs transparent and means we never see your raw scrape data unless you explicitly export it.",
            },
          },
          {
            "@type": "Question",
            name: "Where is my data stored?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Scrape results live in your browser by default. You can export to Excel or CSV at any time.",
            },
          },
          {
            "@type": "Question",
            name: "Is the export limited?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. Export full results, filtered subsets, or selected rows. There's no row cap.",
            },
          },
          {
            "@type": "Question",
            name: "How accurate is the data?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The data is extracted directly from Google Maps in real-time, ensuring you get the most up-to-date and accurate business information available.",
            },
          },
          {
            "@type": "Question",
            name: "Can I run multiple scrapes at the same time?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, you can run multiple extraction tasks simultaneously from your dashboard, limited only by your Apify account's concurrency limits.",
            },
          },
          {
            "@type": "Question",
            name: "What if a business doesn't have an email listed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Google Maps rarely displays email addresses directly. However, we extract the business website URL, which you can use with tools like Hunter.io or Apollo to find contact emails.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="min-h-screen flex flex-col">
      {/* TopNav */}
      <MarketingNav />

      {/* Hero */}
      <header className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-16 md:pt-32 md:pb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-container-low dark:bg-inverse-surface text-primary dark:text-inverse-primary rounded-full font-mono text-label-mono mb-6 border border-primary-fixed dark:border-outline-variant">
          <Bolt size={16} />
          <span>Apify-Powered Engine</span>
        </div>
        <h1 className="font-display-lg text-headline-lg md:text-display-lg text-on-surface dark:text-inverse-on-surface max-w-4xl mb-6 text-balance">
          Scrape Google Maps Leads in Seconds
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-10">
          Precision extraction for growth. Instantly turn Google Maps into a
          targeted list of B2B leads with advanced filtering and instant Excel
          export.
        </p>
        <HeroButtons />

        {/* Mock dashboard preview */}
        <div className="w-full max-w-5xl mt-16 rounded-xl overflow-hidden border border-border-subtle dark:border-outline-variant shadow-sm bg-surface-primary dark:bg-dark-surface relative">
          <div className="h-12 bg-surface-secondary dark:bg-inverse-surface border-b border-border-subtle dark:border-outline-variant flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-error" />
            <div className="w-3 h-3 rounded-full bg-tertiary-fixed-dim" />
            <div className="w-3 h-3 rounded-full bg-secondary-fixed-dim" />
          </div>
          <div className="bg-surface-container-low dark:bg-inverse-surface/30 p-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Leads", value: "24,592", trend: "+12%" },
              { label: "Data Exports", value: "143", trend: "Last 2h ago" },
              { label: "Apify Credits", value: "$42.50", trend: "of $100" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant p-6 shadow-sm"
              >
                <span className="font-mono text-label-mono uppercase text-outline">
                  {stat.label}
                </span>
                <div className="font-display-lg text-headline-lg font-bold mt-3 text-on-surface dark:text-inverse-on-surface">
                  {stat.value}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features */}
      <section
        id="features"
        className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24"
      >
        <div className="text-center mb-12">
          <span className="font-mono text-label-mono uppercase tracking-wider text-primary">
            Features
          </span>
          <h2 className="font-headline-lg text-headline-lg md:text-headline-lg font-semibold text-on-surface dark:text-inverse-on-surface mt-2">
            Everything you need to find leads fast
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-2xl mx-auto">
            Built on the Apify infrastructure. Bring your own API key and own
            your data — no middlemen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop">
          {[
            {
              icon: <MapIcon size={20} />,
              title: "Geo-targeted scraping",
              text: "Search by city, state, or zip code with adjustable radius. See your area on a map preview.",
            },
            {
              icon: <Filter size={20} />,
              title: "Advanced filters",
              text: "Filter by rating, review count, phone, website. Only keep the leads you'd actually call.",
            },
            {
              icon: <Download size={20} />,
              title: "Excel export in-browser",
              text: "Export filtered, selected, or full results as XLSX or CSV with formatted headers.",
            },
            {
              icon: <ShieldCheck size={20} />,
              title: "Bring your own API key",
              text: "Your Apify token stays on your device. We never store credentials on our servers.",
            },
            {
              icon: <Zap size={20} />,
              title: "Live progress",
              text: "Watch your scrape run in real time, with progress bars, partial results, and pause/cancel controls.",
            },
            {
              icon: <Sparkles size={20} />,
              title: "Saved searches",
              text: "Save frequent presets and re-run them in one click. Perfect for recurring outreach campaigns.",
            },
          ].map((feat) => (
            <div
              key={feat.title}
              className="bg-surface-primary dark:bg-dark-surface rounded-xl border border-border-subtle dark:border-outline-variant p-6 shadow-ambient hover:shadow-ambient-hover transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container-low dark:bg-inverse-surface flex items-center justify-center text-primary mb-4">
                {feat.icon}
              </div>
              <h3 className="font-headline-md text-[18px] font-semibold text-on-surface dark:text-inverse-on-surface mb-2">
                {feat.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {feat.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section
        id="workflow"
        className="bg-surface-primary dark:bg-dark-surface border-y border-border-subtle dark:border-outline-variant"
      >
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
          <div className="text-center mb-12">
            <span className="font-mono text-label-mono uppercase tracking-wider text-primary">
              Workflow
            </span>
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface dark:text-inverse-on-surface mt-2">
              Three steps from search to spreadsheet
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
            {[
              {
                step: "01",
                title: "Configure",
                text: "Pick a keyword, location, radius, and any filters you need.",
              },
              {
                step: "02",
                title: "Extract",
                text: "Hit Start — our worker pulls leads from Google Maps via Apify.",
              },
              {
                step: "03",
                title: "Export",
                text: "Download as Excel or CSV. Save the search to re-run anytime.",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="rounded-xl border border-border-subtle dark:border-outline-variant p-6 bg-surface-secondary dark:bg-inverse-surface/30"
              >
                <span className="font-mono text-label-mono text-primary">
                  STEP {s.step}
                </span>
                <h3 className="font-headline-md text-[20px] font-semibold mt-2 text-on-surface dark:text-inverse-on-surface">
                  {s.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section
        id="faq"
        className="bg-surface-primary dark:bg-dark-surface border-y border-border-subtle dark:border-outline-variant"
      >
        <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
          <div className="text-center mb-12">
            <span className="font-mono text-label-mono uppercase tracking-wider text-primary">
              FAQ
            </span>
            <h2 className="font-headline-lg text-headline-lg font-semibold text-on-surface dark:text-inverse-on-surface mt-2">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Do I need to provide my own Apify API key?",
                a: "Yes. You bring your own Apify account and API key. This keeps usage costs transparent and means we never see your raw scrape data unless you explicitly export it.",
              },
              {
                q: "Where is my data stored?",
                a: "Scrape results live in your browser by default. You can export to Excel or CSV at any time.",
              },
              {
                q: "Is the export limited?",
                a: "No. Export full results, filtered subsets, or selected rows. There's no row cap on the Pro plan.",
              },
              {
                q: "How accurate is the data?",
                a: "The data is extracted directly from Google Maps in real-time, ensuring you get the most up-to-date and accurate business information available.",
              },
              {
                q: "Can I run multiple scrapes at the same time?",
                a: "Yes, you can run multiple extraction tasks simultaneously from your dashboard, limited only by your Apify account's concurrency limits.",
              },
              {
                q: "What if a business doesn't have an email listed?",
                a: "Google Maps rarely displays email addresses directly. However, we extract the business website URL, which you can use with email finder tools to gather contact emails.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group bg-surface-secondary dark:bg-inverse-surface/30 border border-border-subtle dark:border-outline-variant rounded-xl p-5 open:shadow-ambient transition-shadow"
              >
                <summary className="font-body-md text-body-md font-semibold text-on-surface dark:text-inverse-on-surface flex items-center justify-between cursor-pointer list-none">
                  {faq.q}
                  <span className="ml-2 text-outline group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 md:py-24">
        <div className="bg-primary text-on-primary rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary-container rounded-full opacity-30 blur-3xl pointer-events-none" />
          <Star size={32} className="mx-auto mb-3 text-on-primary opacity-80" />
          <h2 className="font-headline-lg text-headline-lg font-semibold mb-3 text-balance">
            Stop hand-collecting leads. Let MapLead do it.
          </h2>
          <p className="font-body-md text-body-md opacity-90 mb-8 max-w-xl mx-auto">
            Your first scrape takes less than two minutes. No credit card
            required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-surface-primary text-primary font-body-md font-semibold px-8 py-3 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Create your free account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}
