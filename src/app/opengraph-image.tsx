import { ImageResponse } from "next/og";
import { hero, profile, workPlaces } from "@/content/profile";
import { ArrowRight, Download } from "@/components/icons";
import { renderShareGlobe } from "@/lib/shareGlobe";

// The link preview is the hero, redrawn from the same content at every build: edit the hero copy in
// content/profile.ts and the image follows. Layout is the hero at a 1600px-wide desktop, scaled to the card.
export const dynamic = "force-static";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const teammates = workPlaces.filter((p) => !p.origin).map((p) => p.name);
export const alt = `${profile.name}: ${profile.role} with ${hero.years}+ ${hero.yearsLabel.toLowerCase()}, beside a globe centred on Dhaka with arcs to ${teammates.slice(0, -1).join(", ")} and ${teammates.at(-1)}.`;

const S = 0.75; // 1600px viewport → 1200px card
const C = {
  paper: "#0a192f",
  paper2: "rgba(13, 31, 58, 0.7)",
  ruleStrong: "#2c4a75",
  ink: "#e2e9f5",
  ink2: "#a9b6cf",
  ink3: "#8090ad",
  name: "#b9c4d9",
  mint: "#62f9d5",
  sun: "#ffd23f",
  sky: "#6ec8ff",
};
// The hero's globe canvas (600px tall, right five columns pulled 64px left), in card pixels.
const GLOBE = { left: 644, top: 69, width: 427, height: 450 };

// Fontshare returns one family per request, its .ttf listed first; Satori can't read woff2.
async function fontshare(slug: string, weight: number) {
  const css = await fetch(`https://api.fontshare.com/v2/css?f[]=${slug}@${weight}&display=swap`).then((r) => r.text());
  const url = css.match(/url\('([^']+\.ttf)'\)/)?.[1];
  if (!url) throw new Error(`no ttf for ${slug}@${weight}`);
  return fetch(`https:${url}`).then((r) => r.arrayBuffer());
}
async function google(family: string) {
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}`).then((r) => r.text());
  const url = css.match(/src: url\(([^)]+)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error(`no ttf for ${family}`);
  return fetch(url).then((r) => r.arrayBuffer());
}

type Font = { name: string; data: ArrayBuffer; weight: 400 | 500 | 600; style: "normal" };
async function loadFonts() {
  const want: [string, 400 | 500 | 600, () => Promise<ArrayBuffer>][] = [
    ["Clash Display", 600, () => fontshare("clash-display", 600)],
    ["General Sans", 400, () => fontshare("general-sans", 400)],
    ["General Sans", 500, () => fontshare("general-sans", 500)],
    ["General Sans", 600, () => fontshare("general-sans", 600)],
    ["JetBrains Mono", 400, () => google("JetBrains+Mono:wght@400")],
    ["Black Ops One", 400, () => google("Black+Ops+One")],
  ];
  const got = await Promise.all(
    want.map(async ([name, weight, get]): Promise<Font | null> => {
      try {
        return { name, weight, style: "normal", data: await get() };
      } catch (e) {
        // A missing font only degrades the preview; it shouldn't fail the deploy.
        console.warn(`opengraph-image: ${name} ${weight} unavailable, using fallback`, e);
        return null;
      }
    }),
  );
  return got.filter((f): f is Font => f !== null);
}

const wide = { fontFamily: "General Sans", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" } as const;
const mono = { fontFamily: "JetBrains Mono", fontWeight: 400 } as const;

export default async function Image() {
  const [fonts, globe] = await Promise.all([
    loadFonts(),
    renderShareGlobe({ places: workPlaces, focus: { lat: 23.81, lon: 90.41 }, distance: 4.6, width: GLOBE.width, height: GLOBE.height, background: C.paper }),
  ]);

  const [first, ...rest] = profile.nameLines;
  const nameSize = 116 * S;
  const tagline = [
    ...profile.role.split(" ").map((w) => ({ w, color: C.ink })),
    { w: "building", color: C.ink2 },
    null, // the stack pill
    ...hero.pitch.split(" ").map((w) => ({ w, color: C.ink2 })),
  ];

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: C.paper, fontFamily: "General Sans", color: C.ink }}>
        {/* Left column: name, experience, pitch, actions. */}
        <div style={{ position: "absolute", left: 172 * S, top: 32 * S, bottom: 64 * S, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Clash Display", fontWeight: 600, fontSize: nameSize, lineHeight: 0.94, letterSpacing: -0.035 * nameSize }}>
            <span style={{ color: C.name }}>{first}</span>
            <span style={{ color: C.name }}>{rest[0]}</span>
            <span style={{ color: C.sun }}>{rest[1]}.</span>
          </div>

          <div
            style={{
              marginTop: 36 * S,
              display: "flex",
              alignSelf: "flex-start",
              border: `1px solid ${C.ruleStrong}`,
              background: C.paper2,
              boxShadow: "0 12px 24px -15px rgba(0,0,0,0.8)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", padding: `${8 * S}px ${20 * S}px`, fontFamily: "Black Ops One", fontSize: 52 * S, lineHeight: 1, letterSpacing: 0.02 * 52 * S, color: C.mint }}>
              {`${hero.years}+`}
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 4 * S, borderLeft: `1px solid ${C.ruleStrong}`, padding: `${12 * S}px ${20 * S}px` }}>
              <span style={{ ...wide, fontSize: 16 * S, color: C.ink }}>{hero.yearsLabel}</span>
              <span style={{ ...mono, fontSize: 11 * S, color: C.ink3 }}>{hero.yearsNote}</span>
            </div>
          </div>

          <div style={{ marginTop: 28 * S, display: "flex", flexWrap: "wrap", alignItems: "center", maxWidth: 448 * S, fontSize: 20 * S, lineHeight: 1.375 }}>
            {tagline.map((t, i) =>
              t ? (
                <span key={i} style={{ color: t.color, marginRight: 0.26 * 20 * S }}>
                  {t.w}
                </span>
              ) : (
                // As wide as the longest word, like RotatingText's reserved grid cell.
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 0.26 * 20 * S, padding: `${2 * S}px ${8 * S}px`, background: C.sun, color: C.paper, fontWeight: 500 }}>
                  {hero.stack.map((w, k) => (
                    <span key={w} style={k ? { height: 0, overflow: "hidden" } : undefined}>
                      {w}
                    </span>
                  ))}
                </div>
              ),
            )}
          </div>

          <div style={{ marginTop: 36 * S, display: "flex", alignItems: "center", gap: 12 * S, fontSize: 14 * S, lineHeight: 20 / 14 }}>
            <div style={{ ...wide, display: "flex", alignItems: "center", gap: 10 * S, padding: `${12 * S}px ${20 * S}px`, background: C.sun, color: C.paper }}>
              <Download size={16 * S} stroke={C.paper} />
              Résumé
            </div>
            <div style={{ ...wide, display: "flex", alignItems: "center", gap: 10 * S, padding: `${12 * S}px ${20 * S}px`, border: "1px solid rgba(110,200,255,0.7)", color: C.sky }}>
              View CV
              <ArrowRight size={16 * S} stroke={C.sky} />
            </div>
            <div style={{ ...wide, display: "flex", alignItems: "center", padding: `${12 * S}px ${20 * S}px`, border: `1px solid ${C.ruleStrong}`, color: C.ink }}>
              Email me
            </div>
          </div>
        </div>

        {/* The globe, with its arcs, pins and labels. */}
        <div style={{ position: "absolute", left: GLOBE.left, top: GLOBE.top, width: GLOBE.width, height: GLOBE.height, display: "flex" }}>
          <img src={globe.src} width={GLOBE.width} height={GLOBE.height} alt="" />
          <svg width={GLOBE.width} height={GLOBE.height} viewBox={`0 0 ${GLOBE.width} ${GLOBE.height}`} style={{ position: "absolute", left: 0, top: 0 }}>
            {globe.arcs.map((a) => (
              <path key={a.name} d={a.d} fill="none" stroke={a.color} strokeWidth={a.width} strokeOpacity={0.95} strokeLinecap="round" strokeLinejoin="round" />
            ))}
            {globe.pins.map((p) => (
              <g key={p.name}>
                <circle cx={p.x} cy={p.y} r={p.ring} fill="none" stroke={p.color} strokeOpacity={0.55} strokeWidth={p.r * 0.7} />
                <circle cx={p.x} cy={p.y} r={p.r} fill={p.color} />
              </g>
            ))}
          </svg>
          {globe.labels.map((l) => (
            <span
              key={l.name}
              style={{
                ...mono,
                position: "absolute",
                left: l.x + 12 * S,
                top: l.y + (l.below ? 8 : -10) * S,
                padding: `${2 * S}px ${6 * S}px`,
                background: "rgba(10,25,47,0.8)",
                color: l.color,
                fontSize: 10 * S,
                textTransform: "uppercase",
              }}
            >
              {l.name}
            </span>
          ))}
        </div>

        {/* Caption under the globe. */}
        <div
          style={{
            position: "absolute",
            left: GLOBE.left,
            top: GLOBE.top + GLOBE.height + 4 * S,
            width: GLOBE.width,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12 * S,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 * S, fontSize: 14 * S, color: C.ink }}>
            <div style={{ width: 8 * S, height: 8 * S, borderRadius: 999, background: C.sun, boxShadow: `0 0 0 ${3 * S}px rgba(255,210,63,0.25)` }} />
            Built with international teammates in
          </div>
          <div style={{ ...mono, display: "flex", gap: 10 * S, fontSize: 11 * S, textTransform: "uppercase" }}>
            {workPlaces
              .filter((p) => !p.origin)
              .map((p) => (
                <span key={p.name} style={{ color: p.color }}>
                  {p.name}
                </span>
              ))}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
