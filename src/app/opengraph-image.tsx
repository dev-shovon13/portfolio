import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const dynamic = "force-static";

export const alt = `${profile.name}: Software Engineer with 5+ years of experience`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fonts are fetched at build time (never committed: Clash Display and General Sans are Fontshare fonts,
// Black Ops One is Google Fonts). The CSS APIs are asked for TTF, which the image renderer understands.
async function ttf(cssUrl: string, userAgent?: string) {
  const css = await (await fetch(cssUrl, userAgent ? { headers: { "User-Agent": userAgent } } : undefined)).text();
  const match = css.match(/url\(['"]?([^'")]+\.ttf)['"]?\)/);
  if (!match) throw new Error(`No TTF found in ${cssUrl}`);
  const url = match[1].startsWith("//") ? `https:${match[1]}` : match[1];
  return (await fetch(url)).arrayBuffer();
}

const NAVY = "#0a192f";
const INK = "#e2e9f5";
const INK2 = "#a9b6cf";
const INK3 = "#8090ad";
const SUN = "#ffd23f";
const MINT = "#62f9d5";
const SKY = "#6ec8ff";
const RULE = "#2c4a75";

export default async function OpengraphImage() {
  const [clash, general, generalBold, blackOps, globe] = await Promise.all([
    ttf("https://api.fontshare.com/v2/css?f[]=clash-display@600&display=swap"),
    ttf("https://api.fontshare.com/v2/css?f[]=general-sans@400&display=swap"),
    ttf("https://api.fontshare.com/v2/css?f[]=general-sans@600&display=swap"),
    ttf("https://fonts.googleapis.com/css2?family=Black+Ops+One", "Mozilla/4.0"),
    readFile(join(process.cwd(), "src/assets/og-globe.png")),
  ]);
  const globeSrc = `data:image/png;base64,${globe.toString("base64")}`;
  const [first, second, last] = profile.nameLines;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: NAVY, fontFamily: "General Sans" }}>
        {/* Glow behind the globe, like the hero spotlight. */}
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -40,
            width: 760,
            height: 760,
            display: "flex",
            background: "radial-gradient(circle, rgba(110,200,255,0.16) 0%, rgba(10,25,47,0) 62%)",
          }}
        />
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={globeSrc} width={520} height={520} style={{ position: "absolute", right: 28, top: 40 }} />

        <div style={{ display: "flex", flexDirection: "column", padding: "46px 0 0 64px", width: 660 }}>
          {/* Wordmark */}
          <div style={{ display: "flex", alignItems: "baseline", fontFamily: "Clash Display", fontSize: 30, color: INK, letterSpacing: -1 }}>
            Shovon<span style={{ color: SUN }}>.</span>
          </div>

          {/* Name */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 20,
              fontFamily: "Clash Display",
              fontSize: 98,
              lineHeight: 0.94,
              letterSpacing: -4,
            }}
          >
            <span style={{ color: INK }}>{first}</span>
            <span style={{ color: INK }}>{second}</span>
            <span style={{ color: SUN }}>{last}.</span>
          </div>

          {/* 5+ years panel */}
          <div style={{ display: "flex", marginTop: 28, border: `2px solid ${RULE}`, background: "#0d1f3a", alignSelf: "flex-start" }}>
            <div style={{ display: "flex", alignItems: "center", padding: "10px 22px", fontFamily: "Black Ops One", fontSize: 56, color: MINT, lineHeight: 1 }}>
              5+
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "12px 24px", borderLeft: `2px solid ${RULE}` }}>
              <span style={{ fontWeight: 600, fontSize: 22, color: INK, letterSpacing: 2.5 }}>YEARS OF EXPERIENCE</span>
              <span style={{ marginTop: 4, fontSize: 17, color: INK3 }}>Shipping software since Dec 2021</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", marginTop: 22, fontSize: 23, width: 680, color: INK2 }}>
            <span style={{ color: INK, whiteSpace: "nowrap", flexShrink: 0 }}>Software engineer</span>
            {["React", "Next.js", "TypeScript", "Node.js"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ width: 5, height: 5, borderRadius: 5, background: INK3, margin: "2px 12px 0" }} />
                <span style={{ whiteSpace: "nowrap" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-right caption under the globe */}
        <div style={{ position: "absolute", right: 48, bottom: 30, display: "flex", alignItems: "center", fontSize: 17, color: INK2 }}>
          <div style={{ width: 10, height: 10, borderRadius: 10, background: SUN, marginRight: 10 }} />
          Built with teammates in
          <span style={{ color: MINT, marginLeft: 8 }}>India</span>
          <span style={{ color: SKY, marginLeft: 8 }}>Ukraine</span>
          <span style={{ color: SKY, marginLeft: 8 }}>Poland</span>
          <span style={{ color: SUN, marginLeft: 8 }}>USA</span>
          <span style={{ color: SKY, marginLeft: 8 }}>Canada</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Clash Display", data: clash, weight: 600, style: "normal" },
        { name: "General Sans", data: general, weight: 400, style: "normal" },
        { name: "General Sans", data: generalBold, weight: 600, style: "normal" },
        { name: "Black Ops One", data: blackOps, weight: 400, style: "normal" },
      ],
    },
  );
}
