# instruction.md

## Project Goal

Build a production-ready Next.js SaaS application called **MapLead Scraper**.

This app lets users:
- Enter their own Apify API key.
- Configure a Google Maps lead scraping job.
- View scraped leads in a table and on an interactive map.
- Filter, save, export, and manage results.
- Download the results as an Excel file in the browser.
- Deploy easily on a free or low-cost hosting setup.

This project must be built by converting the provided **Stitch-exported HTML UI/screens** into a fully functional Next.js application.

---

## Product Principles

1. Keep the UI exactly aligned with the Stitch design.
2. Use the HTML exports as the visual source of truth.
3. Prefer reusable components and feature-based structure.
4. Optimize for free-tier hosting and simple deployment.
5. Make the app feel premium, fast, and intuitive.
6. Use client-side Excel export so the download is immediate and does not require server file generation. Client-side spreadsheet export is a common browser-based pattern with `xlsx` and file saving libraries. [web:10][web:13]

---

## Non-Negotiable Requirements

- Use **Next.js App Router**.
- Use **TypeScript**.
- Use **Tailwind CSS** for styling.
- Use a component-based architecture.
- Keep the app responsive.
- Support dark mode.
- Support mobile, tablet, and desktop layouts.
- Build a clean settings flow for Apify API key entry.
- Build export to Excel in-browser.
- Add loading, error, and empty states.
- Make the system easy to host on Vercel. Vercel supports Next.js with zero-config deployment. [web:9][web:12]

---

## Suggested Tech Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui or custom component system
- **State Management:** Zustand or React Context
- **Forms:** React Hook Form + Zod
- **Charts/Analytics:** Recharts or lightweight chart library
- **Map:** Leaflet or Mapbox GL JS
- **Tables:** TanStack Table
- **Excel Export:** `xlsx` + browser file saving
- **Auth:** NextAuth or Clerk if needed later
- **Database:** Supabase or Prisma later if persistence is needed
- **Hosting:** Vercel

---

## Input Artifacts

You will receive:
- HTML exports from Stitch
- CSS assets
- Images/icons if exported
- Possibly multiple screens with matching design language

Your job is to:
1. Read the HTML structure carefully.
2. Rebuild the layout in Next.js components.
3. Preserve the visual design.
4. Replace static HTML with interactive React components.
5. Connect mock data first, then real API integration later.

---

## Build Strategy

### Phase 1: UI Conversion
Convert every Stitch screen into a Next.js page/component with matching layout.

### Phase 2: App Shell
Create the main shell:
- Sidebar
- Top bar
- Content area
- Responsive behavior
- Dark mode toggle

### Phase 3: Core Workflows
Implement:
- API key settings
- Scraping form
- Results list
- Map view
- Export flows
- Saved searches
- Results library

### Phase 4: Functionality
Connect:
- Apify API integration placeholder
- Data filtering
- Data normalization
- Excel export
- Local state persistence

### Phase 5: Polish
Add:
- Loading skeletons
- Error banners
- Toast notifications
- Empty states
- Accessibility improvements

---

## Folder Structure

Use a feature-first structure inside the App Router.

```txt
app/
  layout.tsx
  page.tsx
  globals.css
  (marketing)/
    page.tsx
    pricing/page.tsx
  (auth)/
    login/page.tsx
    signup/page.tsx
  dashboard/
    layout.tsx
    page.tsx
    new-scrape/page.tsx
    results/page.tsx
    saved-searches/page.tsx
    settings/page.tsx
    billing/page.tsx

components/
  layout/
    sidebar.tsx
    topbar.tsx
    mobile-nav.tsx
  ui/
    button.tsx
    card.tsx
    dialog.tsx
    input.tsx
    select.tsx
    switch.tsx
    badge.tsx
    tabs.tsx
    toast.tsx
    skeleton.tsx
  dashboard/
    stats-cards.tsx
    scraping-form.tsx
    results-table.tsx
    results-map.tsx
    result-drawer.tsx
    export-actions.tsx
    saved-search-card.tsx
    apify-key-form.tsx
    pricing-cards.tsx

lib/
  utils.ts
  constants.ts
  validation.ts
  export-excel.ts
  mock-data.ts
  apify.ts
  formatters.ts

hooks/
  use-theme.ts
  use-toast.ts
  use-local-storage.ts

types/
  lead.ts
  scrape.ts
  settings.ts
```

---

## Screen-by-Screen Implementation Instructions

### 1. Landing Page
Build a clean SaaS marketing page with:
- Hero section
- Product value proposition
- Feature grid
- Workflow section
- Pricing section
- FAQ
- CTA buttons

Keep it polished and minimal.

### 2. Auth Pages
Build:
- Login
- Signup
- Forgot password
- Email verification
- First-time onboarding

Make forms clean, simple, and mobile-friendly.

### 3. Dashboard Home
Build a dashboard with:
- Summary cards
- Recent scraping jobs
- Usage meter
- Quick action buttons
- Notifications summary

Use mock data first.

### 4. New Scrape Page
This is the core screen.

Include:
- Location input
- Keyword input
- Category dropdown
- Radius selector
- Advanced filters
- Apify API key input
- Results limit input
- Estimated usage/credits display
- Start scraping button
- Save preset button

Break this into a multi-step form if needed.

### 5. Results Page
Create a three-panel layout:
- Left: filters and export actions
- Center: map
- Right: list of leads

Each lead card should show:
- Name
- Rating
- Reviews
- Phone
- Website
- Address
- Category
- Actions

Include:
- Pin click opens drawer
- Bulk select
- Export selected
- Search within results

### 6. Saved Searches
Create cards or list rows for saved scraping presets:
- Name
- Location
- Keyword
- Filters
- Last run
- Results count
- Run again button

### 7. Results Library
Create a searchable table of past jobs:
- Job name
- Date
- Status
- Results count
- Export
- Delete
- View details

### 8. Settings
Create tabs for:
- Account
- API Key
- Preferences
- Notifications
- Privacy
- Billing

The API key section must:
- Allow paste/edit
- Mask the value
- Test connection
- Save securely in local app state or backend later

### 9. Billing
Create a pricing and plan management page:
- Current plan
- Usage
- Plan cards
- Upgrade CTA
- Invoice history placeholder

---

## Stitch HTML Conversion Rules

When converting Stitch HTML:
1. Preserve spacing, typography, and layout intent.
2. Turn repeated structures into reusable components.
3. Replace hardcoded text with props.
4. Replace static buttons with real interactions.
5. Keep icons and visuals aligned with the source.
6. Avoid rewriting the design unless needed for responsiveness.

If the HTML contains inline styles:
- Refactor them into Tailwind classes.
- Keep class names readable.
- Extract repeated patterns into reusable components.

If the HTML contains static tables or cards:
- Convert them into mapped React components.
- Use arrays of objects from `mock-data.ts`.

If the HTML contains modal or drawer behavior:
- Convert to React state and component composition.

---

## Data Models

### Lead
```ts
type Lead = {
  id: string;
  name: string;
  rating?: number;
  reviews?: number;
  phone?: string;
  website?: string;
  address?: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  verified?: boolean;
};
```

### Scrape Job
```ts
type ScrapeJob = {
  id: string;
  name: string;
  keyword: string;
  location: string;
  radius: number;
  status: "idle" | "running" | "completed" | "failed";
  resultCount: number;
  createdAt: string;
};
```

### Settings
```ts
type Settings = {
  apifyApiKey: string;
  defaultRadius: number;
  defaultResultLimit: number;
  theme: "light" | "dark" | "system";
  exportFormat: "xlsx" | "csv";
};
```

---

## Excel Export Requirements

Implement a browser-side export system:
- Export full results to `.xlsx`
- Export selected rows only
- Export filtered data
- Use a clean file name with date/time
- Support headers and formatted rows

The export should work without server-side file generation. Browser-based spreadsheet generation is suitable for this use case. [web:10][web:13]

---

## Apify Integration Requirements

For now:
- Build a settings field for API key entry.
- Store the key securely in app state or encrypted storage later.
- Add a “Test Connection” button.
- Show success/error status.
- Add a placeholder service function in `lib/apify.ts`.

Later:
- Connect to real Apify actor runs.
- Poll job status.
- Parse returned data into normalized leads.
- Handle rate limits and error responses gracefully.

Do not hardcode Apify secrets in the frontend source.

---

## UI Rules

- Use a clean SaaS look.
- Follow the Stitch visuals closely.
- Use consistent spacing and typography.
- Keep buttons large and clear.
- Use cards, pills, tabs, badges, and drawers consistently.
- Make primary actions visually obvious.
- Use subtle shadows, soft borders, and rounded corners.
- Keep the map view and results list visually balanced.

---

## Responsive Rules

### Desktop
- Sidebar visible
- Multi-panel layouts allowed
- Dashboard should feel spacious

### Tablet
- Sidebar can collapse
- Stack less important panels
- Keep key actions visible

### Mobile
- Use a stacked layout
- Put key actions at the top
- Use bottom sheets/drawers where needed
- Keep forms easy to complete with thumbs

---

## States to Implement

### Loading
- Skeleton cards
- Table row skeletons
- Map loading state
- Button spinner during scraping

### Empty
- No results
- No saved searches
- No history
- No API key configured

### Error
- Invalid API key
- No results found
- Network failure
- Export failure
- Rate limit reached

### Success
- Scrape completed
- Export completed
- Settings saved
- Search preset saved

---

## Accessibility Requirements

- Semantic HTML
- Proper labels on inputs
- Keyboard navigation
- Focus rings
- Sufficient color contrast
- Accessible modal and drawer behavior
- ARIA labels where necessary

---

## Performance Requirements

- Use server components where possible.
- Keep client components focused only where interactivity is required.
- Load map libraries lazily.
- Virtualize long lists if needed.
- Avoid unnecessary re-renders.
- Keep bundle size low for free-tier hosting.

---

## Code Quality Rules

- Write clean, production-style code.
- Prefer small reusable components.
- Use TypeScript types everywhere.
- Avoid duplicate logic.
- Keep utilities in `lib/`.
- Keep magic values in constants.
- Make the code easy to extend later.

---

## Implementation Order

1. Set up Next.js App Router project.
2. Configure Tailwind.
3. Build app shell layout.
4. Convert Stitch pages into route files.
5. Build reusable UI components.
6. Add mock data.
7. Implement dashboard screens.
8. Implement scraping workflow screens.
9. Implement results map and list.
10. Implement settings and API key form.
11. Implement Excel export.
12. Add empty/loading/error states.
13. Polish responsiveness and dark mode.
14. Prepare deployment config.

---

## Output Expectations

The final app should be:
- Visually faithful to the Stitch design.
- Fully responsive.
- Componentized.
- Easy to maintain.
- Ready for Apify integration.
- Ready for deployment.

---

## Final Rule

Do not stop after building static UI.

Continue until:
- All screens are converted.
- All major interactions work.
- Mock data flows through the UI.
- Export works.
- Settings work.
- The app is ready for real backend integration.