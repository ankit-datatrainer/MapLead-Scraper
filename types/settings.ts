export type Theme = "light" | "dark" | "system";
export type ExportFormat = "xlsx" | "csv";

export type Settings = {
  apifyApiKey: string;
  apifyCreditsUsed: number;
  defaultRadius: number;
  defaultResultLimit: number;
  theme: Theme;
  exportFormat: ExportFormat;
  notifications: {
    onCompletion: boolean;
    onFailure: boolean;
    productUpdates: boolean;
  };
  privacy: {
    storeKeyLocally: boolean;
    shareUsageAnalytics: boolean;
  };
  account: {
    fullName: string;
    email: string;
    company?: string;
  };
};

export const DEFAULT_SETTINGS: Settings = {
  apifyApiKey: "",
  apifyCreditsUsed: 0,
  defaultRadius: 10,
  defaultResultLimit: 1000,
  theme: "system",
  exportFormat: "xlsx",
  notifications: {
    onCompletion: true,
    onFailure: true,
    productUpdates: false,
  },
  privacy: {
    storeKeyLocally: true,
    shareUsageAnalytics: false,
  },
  account: {
    fullName: "",
    email: "",
    company: "",
  },
};
