export const APP_NAME = "MapLead Scraper";
export const APP_TAGLINE = "Precision extraction for growth.";
export const APP_DESCRIPTION =
  "Turn Google Maps into a targeted list of B2B leads with advanced filtering and instant Excel export.";

/** Storage keys for client persistence */
export const STORAGE_KEYS = {
  settings: "maplead.settings",
  jobs: "maplead.jobs",
  savedSearches: "maplead.saved_searches",
  theme: "maplead.theme",
} as const;

/** Categories for the New Scrape form */
export const CATEGORIES: { value: string; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "food", label: "Food & Dining" },
  { value: "home", label: "Home Services" },
  { value: "health", label: "Health & Medical" },
  { value: "retail", label: "Retail & Shopping" },
  { value: "professional", label: "Professional Services" },
  { value: "automotive", label: "Automotive" },
  { value: "real-estate", label: "Real Estate" },
  { value: "fitness", label: "Fitness & Wellness" },
  { value: "education", label: "Education" },
];

/** Sidebar nav items */
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/dashboard/new-scrape", label: "New Scrape", icon: "PlusCircle" },
  {
    href: "/dashboard/results",
    label: "Results Library",
    icon: "Inbox",
  },
  {
    href: "/dashboard/saved-searches",
    label: "Saved Searches",
    icon: "Star",
  },
  { href: "/dashboard/settings", label: "API Settings", icon: "KeyRound" },
  { href: "/dashboard/billing", label: "Billing", icon: "CreditCard" },
] as const;

/** Estimated Apify cost per result (USD), used for the credits estimate display. */
export const ESTIMATED_COST_PER_RESULT = 0.0025;

/** Pricing plans */
export const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "forever",
    description: "Perfect to evaluate the tool.",
    features: [
      "Up to 100 results / month",
      "Bring your own Apify key",
      "CSV export",
      "Email support",
    ],
    cta: "Current plan",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 29,
    period: "month",
    description: "For growing teams that need volume.",
    features: [
      "Up to 50,000 results / month",
      "Bring your own Apify key",
      "Unlimited saved searches",
      "Excel + CSV export",
      "Priority support",
      "Advanced filters",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "scale",
    name: "Scale",
    price: 99,
    period: "month",
    description: "For agencies and power users.",
    features: [
      "Unlimited results",
      "Bring your own Apify key",
      "Team seats (up to 5)",
      "Webhook integrations",
      "Dedicated success manager",
      "Custom data fields",
    ],
    cta: "Upgrade to Scale",
    popular: false,
  },
];

/** Mock invoice history */
export const MOCK_INVOICES = [
  { id: "INV-1042", date: "Oct 1, 2024", amount: "$29.00", status: "Paid" },
  { id: "INV-1031", date: "Sep 1, 2024", amount: "$29.00", status: "Paid" },
  { id: "INV-1019", date: "Aug 1, 2024", amount: "$29.00", status: "Paid" },
  { id: "INV-1004", date: "Jul 1, 2024", amount: "$29.00", status: "Paid" },
];
