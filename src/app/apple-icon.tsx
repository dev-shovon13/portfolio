import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Same monogram as icon.svg, full-bleed for iOS home screens.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0a192f" }}>
        <svg width="180" height="180" viewBox="-6 -6 76 76">
          <g fill="none" stroke="#e2e9f5" strokeWidth="6.5" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M14 13v28" />
            <path d="M29 13 18.5 27 29 41" />
            <path d="M50 14H39.5a4.5 4.5 0 0 0-4.5 4.5v3.2a4.5 4.5 0 0 0 4.5 4.5h6a4.5 4.5 0 0 1 4.5 4.5v4.1a4.5 4.5 0 0 1-4.5 4.5H35" />
          </g>
          <path d="M10 49h44M10 54h44" stroke="#ffd23f" strokeWidth="3" />
        </svg>
      </div>
    ),
    size,
  );
}
