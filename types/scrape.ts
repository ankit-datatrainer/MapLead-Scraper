import type { Lead } from "./lead";

export type ScrapeStatus = "idle" | "running" | "completed" | "failed";

export type ScrapeFilters = {
  minRating?: number | null;
  minReviews?: number | null;
  hasPhone?: boolean;
  hasWebsite?: boolean;
};

export type ScrapeJob = {
  id: string;
  name: string;
  keyword: string;
  location: string;
  category?: string;
  radius: number;
  resultLimit: number;
  filters: ScrapeFilters;
  status: ScrapeStatus;
  progress?: number;
  resultCount: number;
  results?: Lead[];
  createdAt: string;
  completedAt?: string;
  error?: string;
};

export type SavedSearch = {
  id: string;
  name: string;
  keyword: string;
  location: string;
  category?: string;
  radius: number;
  resultLimit: number;
  filters: ScrapeFilters;
  createdAt: string;
  lastRunAt?: string;
  avgResults?: number;
  iconKey?: string;
};
