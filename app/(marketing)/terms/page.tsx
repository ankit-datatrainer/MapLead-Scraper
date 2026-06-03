import type { Metadata } from "next";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Terms of Service — ${APP_NAME}`,
  description: "MapLead Scraper Terms of Service. Read the terms governing your use of the platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingNav />
      <main className="max-w-3xl mx-auto px-margin-mobile lg:px-6 py-16 w-full flex-1">
        <p className="text-body-sm text-on-surface-variant mb-2">Last updated: May 30, 2026</p>
        <h1 className="font-display-lg text-headline-lg font-bold text-on-surface mb-8">Terms of Service</h1>

        <div className="space-y-8">

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using MapLead Scraper (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>MapLead Scraper is a web application that allows users to extract business listing data from Google Maps via the Apify platform. Users must provide their own Apify API key to use the scraping functionality.</p>
          </Section>

          <Section title="3. Account Registration">
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You must be at least 18 years old to use the Service.</li>
              <li>One person or legal entity may not maintain more than one free account.</li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <p className="mb-3">You agree to use the Service only for lawful purposes. You must not:</p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
              <li>Scrape data in violation of Google&apos;s Terms of Service or any applicable law.</li>
              <li>Use extracted data to send unsolicited communications (spam).</li>
              <li>Resell or redistribute scraped data without appropriate rights.</li>
              <li>Attempt to reverse-engineer, hack, or disrupt the Service.</li>
              <li>Use the Service to collect data on private individuals without consent.</li>
              <li>Violate any applicable data protection laws (GDPR, CCPA, etc.).</li>
            </ul>
          </Section>

          <Section title="5. Your Apify API Key">
            <p>You are solely responsible for your Apify account and any costs incurred through your API key. MapLead Scraper stores your API key locally in your browser and does not transmit it to our servers. You are responsible for keeping your API key secure.</p>
          </Section>

          <Section title="6. Data Ownership">
            <p>You retain ownership of all data you extract using the Service. We do not claim any rights to your scraped data. Scraped results are stored locally in your browser and are not accessible to us.</p>
          </Section>

          <Section title="7. Intellectual Property">
            <p>The MapLead Scraper application, including its design, code, and content, is owned by MapLead Scraper and protected by intellectual property laws. You may not copy, modify, or distribute any part of the Service without our written permission.</p>
          </Section>

          <Section title="8. Disclaimers">
            <p className="mb-3">The Service is provided &quot;as is&quot; without warranties of any kind. We do not warrant that:</p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
              <li>The Service will be uninterrupted or error-free.</li>
              <li>Scraped data will be accurate, complete, or up-to-date.</li>
              <li>The Service will meet your specific requirements.</li>
            </ul>
          </Section>

          <Section title="9. Limitation of Liability">
            <p>To the maximum extent permitted by law, MapLead Scraper shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of profits, data, or business opportunities.</p>
          </Section>

          <Section title="10. Termination">
            <p>We reserve the right to suspend or terminate your account at any time for violation of these Terms. You may terminate your account at any time by contacting us at <a href="mailto:support@maplead.app" className="text-primary hover:underline">support@maplead.app</a>.</p>
          </Section>

          <Section title="11. Changes to Terms">
            <p>We may update these Terms at any time. We will notify you of material changes by email or in-app notice. Continued use of the Service after changes constitutes acceptance.</p>
          </Section>

          <Section title="12. Governing Law">
            <p>These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.</p>
          </Section>

          <Section title="13. Contact">
            <p>For questions about these Terms, contact us at <a href="mailto:legal@maplead.app" className="text-primary hover:underline">legal@maplead.app</a>.</p>
          </Section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-headline-md text-[18px] font-semibold text-on-surface mb-3">{title}</h2>
      <div className="text-body-md text-on-surface-variant leading-relaxed">{children}</div>
    </div>
  );
}
