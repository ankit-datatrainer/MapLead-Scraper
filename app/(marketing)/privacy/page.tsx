import type { Metadata } from "next";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { Footer } from "@/components/layout/footer";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Privacy Policy — ${APP_NAME}`,
  description: "MapLead Scraper Privacy Policy. Learn how we collect, use, and protect your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MarketingNav />
      <main className="max-w-3xl mx-auto px-margin-mobile lg:px-6 py-16 w-full flex-1">
        <p className="text-body-sm text-on-surface-variant mb-2">Last updated: May 30, 2026</p>
        <h1 className="font-display-lg text-headline-lg font-bold text-on-surface mb-8">Privacy Policy</h1>

        <div className="prose-like space-y-8 text-on-surface">

          <Section title="1. Overview">
            <p>MapLead Scraper (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights regarding that information when you use our web application at maplead.app.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p className="mb-3">We collect the minimum information necessary to provide the service:</p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
              <li><strong className="text-on-surface">Account information:</strong> Your name, email address, and optional company name when you create an account.</li>
              <li><strong className="text-on-surface">Usage data:</strong> Anonymized information about how you interact with the application (pages visited, features used) to improve the product.</li>
              <li><strong className="text-on-surface">Browser storage:</strong> Scrape results, saved searches, and your Apify API key are stored locally in your browser (localStorage). This data never leaves your device unless you explicitly export it.</li>
            </ul>
          </Section>

          <Section title="3. What We Do NOT Collect">
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
              <li>We do <strong className="text-on-surface">not</strong> store your Apify API key on our servers.</li>
              <li>We do <strong className="text-on-surface">not</strong> store your scraped lead data on our servers.</li>
              <li>We do <strong className="text-on-surface">not</strong> sell your personal information to third parties.</li>
              <li>We do <strong className="text-on-surface">not</strong> use your data for advertising purposes.</li>
            </ul>
          </Section>

          <Section title="4. How We Use Your Information">
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
              <li>To create and manage your account.</li>
              <li>To send transactional emails (account confirmation, password reset).</li>
              <li>To respond to support requests.</li>
              <li>To improve the application based on anonymized usage patterns.</li>
            </ul>
          </Section>

          <Section title="5. Third-Party Services">
            <p className="mb-3">We use the following third-party services:</p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
              <li><strong className="text-on-surface">Supabase:</strong> Authentication and database hosting. Your account data is stored securely in Supabase. See <a href="https://supabase.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a>.</li>
              <li><strong className="text-on-surface">Apify:</strong> The scraping engine. When you run a scrape, your Apify API key is used directly from your browser to call Apify&apos;s API. See <a href="https://apify.com/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Apify Privacy Policy</a>.</li>
            </ul>
          </Section>

          <Section title="6. Data Retention">
            <p>Account data is retained as long as your account is active. You may delete your account at any time by contacting us at <a href="mailto:privacy@maplead.app" className="text-primary hover:underline">privacy@maplead.app</a>, and we will delete your data within 30 days.</p>
          </Section>

          <Section title="7. Cookies">
            <p>We use only essential cookies required for authentication (session tokens). We do not use tracking or advertising cookies.</p>
          </Section>

          <Section title="8. Your Rights">
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 text-on-surface-variant">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your data.</li>
              <li>Object to or restrict processing of your data.</li>
              <li>Data portability.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:privacy@maplead.app" className="text-primary hover:underline">privacy@maplead.app</a>.</p>
          </Section>

          <Section title="9. Security">
            <p>We implement industry-standard security measures including HTTPS encryption, secure authentication via Supabase, and row-level security on all database tables. However, no system is 100% secure and we cannot guarantee absolute security.</p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice in the application. Continued use of the service after changes constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="11. Contact">
            <p>For privacy-related questions, contact us at <a href="mailto:privacy@maplead.app" className="text-primary hover:underline">privacy@maplead.app</a>.</p>
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
