import { ImageResponse } from "next/og";
import { APP_NAME, APP_TAGLINE } from "@/lib/constants";

export const runtime = "edge";
export const alt = `${APP_NAME} — ${APP_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Open Graph card rendered on demand.
 * Brand-blue background, white folded-map mark, wordmark, tagline, and a
 * "Scrape Google Maps Leads in Seconds" headline.
 */
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "linear-gradient(135deg, #0058be 0%, #2170e4 60%, #adc6ff 100%)",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          color: "#ffffff",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* top: logomark + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              background: "#ffffff",
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              width={56}
              height={56}
              fill="none"
              stroke="#0058be"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="6 10 12 7 20 10 26 7 26 22 20 25 12 22 6 25" />
              <line x1="12" y1="7" x2="12" y2="22" />
              <line x1="20" y1="10" x2="20" y2="25" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: "-0.01em",
            }}
          >
            {APP_NAME}
          </span>
        </div>

        {/* spacer */}
        <div style={{ flex: 1 }} />

        {/* headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <span
            style={{
              fontSize: 80,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            Scrape Google Maps Leads in Seconds
          </span>
          <span
            style={{
              fontSize: 30,
              opacity: 0.92,
              maxWidth: 880,
            }}
          >
            {APP_TAGLINE} Bring your own Apify key. Export to Excel.
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
