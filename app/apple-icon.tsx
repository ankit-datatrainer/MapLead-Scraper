import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * Apple touch icon — same brand mark as app/icon.svg but at 180×180.
 * Rendered on demand via next/og's edge ImageResponse.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0058be",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width={120}
          height={120}
          fill="none"
          stroke="#ffffff"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="6 10 12 7 20 10 26 7 26 22 20 25 12 22 6 25" />
          <line x1="12" y1="7" x2="12" y2="22" />
          <line x1="20" y1="10" x2="20" y2="25" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
