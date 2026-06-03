import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-surface">
      <aside className="hidden lg:flex flex-col justify-between bg-primary text-white p-12 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-container rounded-full opacity-30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-secondary-container rounded-full opacity-20 blur-3xl pointer-events-none" />
        <Link href="/" className="text-headline-md font-bold relative z-10">MapLead Scraper</Link>
        <div className="relative z-10 max-w-md">
          <h2 className="font-display-lg text-headline-lg font-bold leading-tight">Precision lead extraction.</h2>
          <p className="font-body-md text-body-md opacity-90 mt-4">Configure once, scrape forever. Bring your Apify key and own your pipeline.</p>
        </div>
        <p className="font-body-sm text-body-sm opacity-70 relative z-10">© {new Date().getFullYear()} MapLead Scraper</p>
      </aside>
      <main className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
