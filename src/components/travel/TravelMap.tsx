"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { WorldMap } from "@/lib/worldMap";

const W = 1000;
const H = 520;

/** Zoom transform for progress p (0 = whole world, 1 = focus region), plus the matching label scale. */
function view(p: number, focus: WorldMap["focus"]) {
  const s = Math.pow(focus.scale, p);
  const cx = W / 2 + (focus.cx - W / 2) * p;
  const cy = H / 2 + (focus.cy - H / 2) * p;
  return { s, transform: `translate(${(W / 2 - s * cx).toFixed(2)} ${(H / 2 - s * cy).toFixed(2)}) scale(${s.toFixed(4)})` };
}

/**
 * Flat world map. As it scrolls through, it zooms from the whole world into South and
 * Southeast Asia while the visited countries light up in turn and flight paths draw out of Dhaka.
 * Server-rendered in its final state, so it reads complete without JS or with reduced motion.
 */
export function TravelMap({ map }: { map: WorldMap }) {
  const root = useRef<HTMLDivElement>(null);
  const end = view(1, map.focus);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const zoom = root.current!.querySelector<SVGGElement>("[data-zoom]")!;
        const pins = Array.from(root.current!.querySelectorAll<SVGGElement>("[data-pin]"));
        const place = (p: number) => {
          const v = view(p, map.focus);
          zoom.setAttribute("transform", v.transform);
          pins.forEach((pin) => pin.setAttribute("transform", `translate(${pin.dataset.x} ${pin.dataset.y}) scale(${(1 / v.s).toFixed(4)})`));
        };
        const state = { p: 0 };
        place(0);

        // Base map fades in once.
        gsap.from(q("[data-base] path"), {
          opacity: 0,
          duration: 0.6,
          stagger: { each: 0.004, from: "random" },
          scrollTrigger: { trigger: root.current, start: "top 85%", toggleActions: "play none none none" },
        });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          // Finishes by the time the map reaches the middle of the screen, so the final view is readable.
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "center 55%", scrub: 0.4 },
        });
        tl.to(state, { p: 1, duration: 1, ease: "power1.inOut", onUpdate: () => place(state.p) }, 0);

        // Bangladesh, then India, then Singapore and Malaysia. Dhaka (step 0) has no arc of its own.
        [0, 1, 2].forEach((step) => {
          const at = 0.35 + step * 0.22;
          const sel = (s: string) => q(`${s.replace("STEP", `[data-step="${step}"]`)}`);
          const countries = sel("[data-country]STEP");
          const arcs = sel("[data-arc]STEP");
          const dots = sel("[data-pin]STEP [data-dot]");
          const labels = sel("[data-pin]STEP [data-label]");
          if (countries.length) tl.fromTo(countries, { fillOpacity: 0, strokeOpacity: 0 }, { fillOpacity: 0.85, strokeOpacity: 1, duration: 0.14 }, at);
          if (arcs.length) tl.from(arcs, { drawSVG: "0%", duration: 0.2, stagger: 0.03 }, at + 0.04);
          if (dots.length) tl.from(dots, { scale: 0, transformOrigin: "50% 50%", duration: 0.08, stagger: 0.02 }, at + 0.08);
          if (labels.length) tl.from(labels, { opacity: 0, x: -6, duration: 0.1, stagger: 0.02 }, at + 0.12);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative overflow-hidden border border-rule bg-night">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-labelledby="travel-map-title">
        <title id="travel-map-title">
          World map highlighting Bangladesh, India, Singapore and Malaysia, with flight paths from Dhaka to each city visited
        </title>
        <defs>
          <pattern id="map-dots" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.7" fill="var(--color-rule)" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#map-dots)" />

        <g data-zoom transform={end.transform}>
          <g data-base>
            {map.base.map((c) => (
              <path key={c.id} d={c.d} fill="var(--color-paper-3)" stroke="var(--color-rule-strong)" strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
          <g>
            {map.visited.map((c) => (
              <path
                key={c.id}
                d={c.d}
                data-country
                data-step={c.step}
                fill={c.color}
                fillOpacity={0.85}
                stroke={c.color}
                strokeWidth={1.2}
                vectorEffect="non-scaling-stroke"
              >
                <title>{c.name}</title>
              </path>
            ))}
          </g>
          <g fill="none">
            {map.arcs.map((a) => (
              <path
                key={a.name}
                d={a.d}
                data-arc
                data-step={a.step}
                stroke={a.color}
                strokeWidth={1.6}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>
          {map.cities.map((c) => (
            <g
              key={c.name}
              data-pin
              data-step={c.step}
              data-origin={c.origin || undefined}
              data-x={c.x}
              data-y={c.y}
              transform={`translate(${c.x} ${c.y}) scale(${(1 / end.s).toFixed(4)})`}
            >
              <g data-dot>
                {c.origin ? <circle r={9} fill="none" stroke={c.color} strokeWidth={1.5} className="animate-ping [transform-box:fill-box] [transform-origin:center]" /> : null}
                <circle r={c.origin ? 5 : 3.5} fill={c.color} stroke="var(--color-night)" strokeWidth={1.5} />
              </g>
              {c.label ? (
                <g data-label>
                  <rect x={8} y={-9} width={c.name.length * 6.6 + 10} height={17} fill="var(--color-chip)" fillOpacity={0.85} />
                  <text x={13} y={4} fontSize={11} fill={c.color} className="fig uppercase" style={{ letterSpacing: "0.04em" }}>
                    {c.name}
                  </text>
                </g>
              ) : null}
            </g>
          ))}
        </g>
      </svg>
      <p className="fig pointer-events-none absolute right-3 bottom-2 text-[10px] text-ink-3">Flights out of Dhaka</p>
    </div>
  );
}
