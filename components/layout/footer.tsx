import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-surface-primary w-full py-12 px-margin-mobile lg:px-margin-desktop border-t border-border-subtle mt-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop max-w-container-max mx-auto">
        <div className="flex flex-col gap-4">
          <span className="font-headline-md font-bold text-primary">MapLead Scraper</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} MapLead Scraper. Precision extraction for growth.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-label-mono text-on-surface uppercase tracking-wider">Product</h4>
          <Link href="/dashboard/new-scrape" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Start scraping</Link>
          <Link href="/features" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Features</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-label-mono text-on-surface uppercase tracking-wider">Legal</h4>
          <Link href="/privacy" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Terms of Service</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-mono text-label-mono text-on-surface uppercase tracking-wider">Support</h4>
          <Link href="/docs" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Documentation</Link>
          <Link href="/contact" className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors">Contact Support</Link>
        </div>
      </div>
    </footer>
  );
}
