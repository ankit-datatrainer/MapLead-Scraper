import type { Lead } from "@/types/lead";
import type { ScrapeJob } from "@/types/scrape";
import { sleep, uid } from "./utils";

/**
 * NOTE: This is a frontend-only placeholder. Real Apify calls should be made
 * from a server route (e.g. /app/api/scrape) so the user-supplied API token
 * is never persisted in the browser bundle.
 */

export type ApifyInput = {
  keyword: string;
  location: string;
  category?: string;
  radius: number;
  resultLimit: number;
  filters: ScrapeJob["filters"];
  token: string;
};

export type ApifyTestResult = {
  ok: boolean;
  message: string;
};

/** Shallow validation that the token looks plausible. */
export async function testApifyConnection(token: string): Promise<ApifyTestResult> {
  await sleep(700);
  if (!token || token.trim().length < 8) {
    return { ok: false, message: "Token is too short to be valid." };
  }
  if (!token.startsWith("apify_api_") && !token.startsWith("apify_")) {
    return {
      ok: false,
      message: 'Token should start with "apify_api_". Double-check it in Apify Console > Settings > Integrations.',
    };
  }
  return { ok: true, message: "Connection looks good. Token format is valid." };
}

/**
 * Call the Apify API to run the Google Maps scraper actor and fetch results.
 */
export async function runMockScrape(
  input: ApifyInput,
  onProgress: (progress: number, partial: number) => void,
): Promise<Lead[]> {
  const token = input.token;
  if (!token) {
    throw new Error("Apify API token is required. Please check your settings.");
  }

  // Using the standard compass Google Maps Scraper
  const actorId = "compass~crawler-google-places";

  const searchString = input.keyword ? `${input.keyword} in ${input.location}` : input.location;
  const runInput = {
    searchStringsArray: [searchString],
    maxCrawledPlacesPerSearch: input.resultLimit || 20,
    language: "en"
  };

  onProgress(5, 0);
  
  // 1. Start the run
  const startRes = await fetch(`https://api.apify.com/v2/acts/${actorId}/runs?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(runInput)
  });

  if (!startRes.ok) {
    const errText = await startRes.text();
    throw new Error(`Failed to start Apify scrape: ${startRes.status} ${errText}`);
  }

  const startData = await startRes.json();
  const runId = startData.data.id;
  const defaultDatasetId = startData.data.defaultDatasetId;

  // 2. Poll for completion
  let status = startData.data.status;
  while (status !== "SUCCEEDED" && status !== "FAILED" && status !== "ABORTED") {
    await sleep(3000);
    
    const pollRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
    if (!pollRes.ok) throw new Error("Failed to poll Apify run status");
    const pollData = await pollRes.json();
    status = pollData.data.status;
    
    onProgress(50, 0); 
  }

  if (status !== "SUCCEEDED") {
    throw new Error(`Apify run did not succeed. Status: ${status}`);
  }

  onProgress(90, 0);

  // 3. Fetch dataset items
  const dataRes = await fetch(`https://api.apify.com/v2/datasets/${defaultDatasetId}/items?token=${token}`);
  if (!dataRes.ok) throw new Error("Failed to fetch Apify dataset results");
  const items = await dataRes.json();

  onProgress(95, items.length);

  // 4. Transform items into Lead[]
  const leads: Lead[] = items.map((item: any) => ({
    id: uid("lead"),
    name: item.title || item.name || "Unknown",
    category: item.categoryName || input.category || "General",
    rating: item.totalScore || 0,
    reviews: item.reviewsCount || 0,
    phone: item.phone || item.phoneUnformatted || undefined,
    website: item.website || undefined,
    email: item.email || undefined,
    address: item.address || item.street || "",
    city: item.city || "",
    state: item.state || "",
    postalCode: item.postalCode || "",
    country: item.countryCode || "US",
    latitude: item.location?.lat || 0,
    longitude: item.location?.lng || 0,
    hours: item.openingHours ? JSON.stringify(item.openingHours) : undefined,
    verified: item.claimed || false,
    scrapedAt: new Date().toISOString(),
  }));

  const filtered = applyFilters(leads, input.filters);
  onProgress(100, filtered.length);
  return filtered;
}

function applyFilters(leads: Lead[], filters: ScrapeJob["filters"]): Lead[] {
  return leads.filter((lead) => {
    if (filters.hasPhone && !lead.phone) return false;
    if (filters.hasWebsite && !lead.website) return false;
    if (filters.minRating != null && (lead.rating ?? 0) < filters.minRating)
      return false;
    if (filters.minReviews != null && (lead.reviews ?? 0) < filters.minReviews)
      return false;
    return true;
  });
}
