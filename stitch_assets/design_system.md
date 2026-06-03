# MapLead Scraper Design System

## Brand & Style

This design system is built for a high-performance, professional SaaS environment. The brand personality is **Trustworthy, Efficient, and Precise**, mirroring the reliability required for data extraction tools. 

The visual style follows a **Corporate Modern** aesthetic with strong influences from **Minimalism**. It prioritizes high-fidelity execution through subtle gradients, refined borders, and generous whitespace. The goal is to make complex data scraping tasks feel effortless and organized, similar to the interface standards set by industry leaders like Stripe and Linear. 

The UI communicates authority through structured layouts while remaining approachable via soft geometry and a vibrant primary palette.

---

## Color Palette

The color palette centers on a **Primary Blue (#3B82F6)** to evoke professionalism and technology. A **Success Green (#10B981)** is utilized for positive feedback loops, such as "Scrape Complete" or "Active" statuses. 

The neutral system uses a sophisticated range of slates and grays to define structural hierarchy. 

### Light Mode Colors
- **Primary:** `#0058be` (Primary blue)
- **Primary Container:** `#2170e4`
- **Background:** `#f8f9ff`
- **Surface:** `#f8f9ff`
- **Surface Primary:** `#FFFFFF`
- **Surface Secondary:** `#F9F9FC`
- **Border Subtle:** `#E2E8F0`
- **Text Main:** `#212226`
- **Secondary:** `#006c49`
- **Secondary Container:** `#6cf8bb`
- **Tertiary:** `#924700`
- **Tertiary Container:** `#b75b00`
- **Error:** `#ba1a1a`

### Dark Mode Colors (Theme Overrides)
- **Dark Background:** `#0F172A`
- **Dark Surface:** `#1E293B`
- **Border Subtle (Dark):** `#334155`

---

## Typography

The design system utilizes **Inter** as the primary typeface for its exceptional legibility and neutral, modern tone. **IBM Plex Mono** is introduced for technical values, such as GPS coordinates, phone numbers, and lead IDs, to distinguish raw data from UI controls.

### Hierarchy & Scales
- **display-lg:** `font-family: Inter; font-size: 48px; font-weight: 700; line-height: 56px; letter-spacing: -0.02em`
- **headline-lg:** `font-family: Inter; font-size: 32px; font-weight: 600; line-height: 40px; letter-spacing: -0.01em`
- **headline-lg-mobile:** `font-family: Inter; font-size: 24px; font-weight: 600; line-height: 32px`
- **headline-md:** `font-family: Inter; font-size: 24px; font-weight: 600; line-height: 32px`
- **body-lg:** `font-family: Inter; font-size: 18px; font-weight: 400; line-height: 28px`
- **body-md:** `font-family: Inter; font-size: 16px; font-weight: 400; line-height: 24px`
- **body-sm:** `font-family: Inter; font-size: 14px; font-weight: 400; line-height: 20px`
- **label-mono:** `font-family: IBM Plex Mono; font-size: 12px; font-weight: 500; line-height: 16px; letter-spacing: 0.05em`

---

## Spacing & Spacing Scale
An 8px (2-unit) base spacing system is strictly enforced for all component internal padding and external margins.

- **Base unit:** `4px`
- **Gutter Desktop:** `24px`
- **Margin Desktop:** `40px`
- **Gutter Mobile:** `16px`
- **Margin Mobile:** `16px`
- **Container Max-Width:** `1280px`

---

## Elevation & Depth

Hierarchy is established through **Tonal Layering** supplemented by **Ambient Shadows**.

- **Surfaces:** Use a tiered background system. Level 0 is the app background (`#F9F9FC`), Level 1 is a card or container (`#FFFFFF`), and Level 2 is a modal or dropdown.
- **Shadows:** Avoid heavy, dark shadows. Use diffused, low-opacity (8-12%) shadows with a subtle blue tint (`rgba(59, 130, 246, 0.08)`) to lift elements without breaking the clean aesthetic.
- **Borders:** In dark mode, depth is conveyed through 1px solid borders (`#334155`) rather than shadows, maintaining a crisp, technical look.
- **Glassmorphism:** Use backdrop blurs (12px - 20px) on sticky navigation headers to maintain context while scrolling.

---

## Shapes & Radii
The design system uses a **Rounded** shape language to balance the "technical" nature of scraping with an "approachable" software feel.

- **sm:** `0.25rem` (4px)
- **DEFAULT:** `0.5rem` (8px)
- **md:** `0.75rem` (12px)
- **lg:** `1rem` (16px)
- **xl:** `1.5rem` (24px)
- **full:** `9999px`

---

## Components

### Buttons
- **Primary:** Solid Primary Blue with white text. High-contrast, 8px radius.
- **Secondary:** Transparent background with a 1px border (`border-subtle`).
- **Action:** Small, 32px height buttons for table-row actions like "Export" or "View".

### Input Fields
- Inputs should have a 1px border that shifts to Primary Blue on focus.
- Labels are always positioned above the field in `body-sm` bold.
- Use inner icons for "Search" and "Location" parameters to aid visual recognition.

### Data Tables (Critical Component)
- **Rows:** 56px minimum height with a light 1px bottom border.
- **Header:** Light gray background (`surface-secondary`) with uppercase labels in `label-mono`.
- **Status Chips:** Small, pill-shaped indicators using Success Green (Active) or Neutral Gray (Pending).

### Cards
- Cards house scraping "Tasks." They should feature a subtle shadow on hover to indicate interactivity.
- Padding inside cards should be a consistent 24px (3 units).

### Progress Indicators
- Use a slim (4px height) progress bar for active scraping jobs, using a subtle pulse animation in the Primary Blue color.
