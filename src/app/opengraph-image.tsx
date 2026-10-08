import { ImageResponse } from "next/og";
import { ledgerItems, profile } from "@/content/profile";

export const dynamic = "force-static";

export const alt = `${profile.name}: Software Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const rows = ledgerItems.slice(0, 5);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a192f",
          color: "#e2e9f5",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", width: 520 }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 88, fontWeight: 800, lineHeight: 0.95, letterSpacing: -2 }}>
            <span>KAWSER</span>
            <span>AHMED</span>
            <span>SHOVON</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#a9b6cf" }}>Software engineer · React · Next.js · Node.js</div>
          <div style={{ marginTop: "auto", fontSize: 20, color: "#8090ad" }}>Dhaka, Bangladesh</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, marginLeft: 48, borderTop: "2px solid #2c4a75" }}>
          {rows.map((r) => (
            <div
              key={r.code}
              style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #1d3558", fontSize: 22 }}
            >
              <span style={{ color: "#8090ad", width: 70 }}>{r.code}</span>
              <span style={{ flex: 1 }}>{r.item}</span>
              <span style={{ color: "#ffd23f" }}>MATCHED</span>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignSelf: "flex-end",
              marginTop: 36,
              border: "3px solid #ffd23f",
              color: "#ffd23f",
              padding: "8px 18px",
              fontSize: 40,
              fontWeight: 800,
              transform: "rotate(-7deg)",
            }}
          >
            RECONCILED
          </div>
        </div>
      </div>
    ),
    size,
  );
}
