import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Scrape",
};

export default function NewScrapeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
