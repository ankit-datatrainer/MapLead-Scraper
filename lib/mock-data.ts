import type { Lead } from "@/types/lead";
import type { ScrapeJob, SavedSearch } from "@/types/scrape";

/**
 * MOCK_LEADS is intentionally empty here.
 * All lead data is generated dynamically in apify.ts based on the
 * actual keyword and location the user searched for.
 * This prevents data cross-contamination between scrape sessions.
 */
export const MOCK_LEADS: Lead[] = [];

/* -------------------- Jobs -------------------- */
export const MOCK_JOBS: ScrapeJob[] = [];

/* -------------------- Saved Searches -------------------- */
export const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: "saved_1",
    name: "NY General Businesses",
    keyword: "business",
    location: "New York, NY",
    category: "general",
    radius: 10,
    resultLimit: 1000,
    filters: { minRating: 4 },
    createdAt: "2024-09-12T10:00:00Z",
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    avgResults: 1240,
    iconKey: "Store",
  },
  {
    id: "saved_2",
    name: "Texas Real Estate",
    keyword: "real estate agent",
    location: "Texas",
    category: "real-estate",
    radius: 50,
    resultLimit: 10000,
    filters: { hasPhone: true },
    createdAt: "2024-09-01T08:00:00Z",
    lastRunAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    avgResults: 8450,
    iconKey: "Home",
  },
];
