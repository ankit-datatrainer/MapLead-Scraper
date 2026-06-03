import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette
        primary: "#0058be",
        "primary-container": "#2170e4",
        "primary-fixed": "#d8e2ff",
        "primary-fixed-dim": "#adc6ff",
        "on-primary": "#ffffff",
        "on-primary-container": "#fefcff",
        "on-primary-fixed": "#001a42",
        "on-primary-fixed-variant": "#004395",
        "inverse-primary": "#adc6ff",
        "surface-tint": "#005ac2",

        // Secondary (success green)
        secondary: "#006c49",
        "secondary-container": "#6cf8bb",
        "secondary-fixed": "#6ffbbe",
        "secondary-fixed-dim": "#4edea3",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#00714d",
        "on-secondary-fixed": "#002113",
        "on-secondary-fixed-variant": "#005236",

        // Tertiary (orange)
        tertiary: "#924700",
        "tertiary-container": "#b75b00",
        "tertiary-fixed": "#ffdcc6",
        "tertiary-fixed-dim": "#ffb786",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fffbff",
        "on-tertiary-fixed": "#311400",
        "on-tertiary-fixed-variant": "#723600",

        // Error
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",

        // Surface system (light mode)
        background: "#f8f9ff",
        surface: "#f8f9ff",
        "surface-bright": "#f8f9ff",
        "surface-dim": "#cbdbf5",
        "surface-primary": "#FFFFFF",
        "surface-secondary": "#F9F9FC",
        "surface-variant": "#d3e4fe",
        "surface-container": "#e5eeff",
        "surface-container-low": "#eff4ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",

        // Text & outlines
        "text-main": "#212226",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#424754",
        "on-background": "#0b1c30",
        outline: "#727785",
        "outline-variant": "#c2c6d6",
        "border-subtle": "#E2E8F0",

        // Dark mode
        "dark-bg": "#0F172A",
        "dark-surface": "#1E293B",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
      fontSize: {
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-md": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", fontWeight: "600" },
        ],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-mono": [
          "12px",
          { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "500" },
        ],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.25rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "gutter-mobile": "16px",
        "gutter-desktop": "24px",
        "container-max": "1280px",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      boxShadow: {
        ambient:
          "0 4px 6px -1px rgba(59, 130, 246, 0.08), 0 2px 4px -1px rgba(59, 130, 246, 0.04)",
        "ambient-hover":
          "0 10px 15px -3px rgba(59, 130, 246, 0.10), 0 4px 6px -2px rgba(59, 130, 246, 0.05)",
      },
      backdropBlur: {
        glass: "12px",
      },
      keyframes: {
        "pulse-width": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "pulse-width": "pulse-width 2s infinite ease-in-out",
        "fade-in": "fade-in 0.3s ease forwards",
        "slide-in-right": "slide-in-right 0.3s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
