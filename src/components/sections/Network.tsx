"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { network } from "@/content/profile";
import { SectionHead } from "@/components/ledger/SectionHead";

const MIN = -9;
const MAX = 7;
const W = 1000;
const BASE = 210;
const x = (offset: number) => 20 + ((offset - MIN) / (MAX - MIN)) * (W - 40);

const COLORS: Record<string, string> = {
  us: "var(--color-sky-fill)",
  ca: "var(--color-sky-fill)",
  pl: "var(--color-mint-fill)",
  ua: "var(--color-sky-fill)",
  in: "var(--color-sun-fill)",
  bd: "var(--color-sun-fill)",
};

const home = network.find((n) => n.home)!;
const homeX = x(home.offset[0]);

function arc(target: (typeof network)[number]) {
  const tx = x((target.offset[0] + target.offset[1]) / 2);
  const span = Math.abs(homeX - tx);
  const lift = Math.min(170, 30 + span * 0.3);
  return `M ${homeX} ${BASE} Q ${(homeX + tx) / 2} ${BASE - lift * 2} ${tx} ${BASE}`;
}

const fmtOffset = (o: number) => `${o >= 0 ? "+" : "−"}${Math.abs(Math.trunc(o))}${o % 1 ? ":30" : ""}`;

export function Network() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, desktop: "(min-width: 1024px)" }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;
        const q = gsap.utils.selector(root);
        const map = q("[data-map]")[0];
        // Desktop: hold the map in place while the routes draw out from Dhaka.
        const tl = gsap.timeline({
          scrollTrigger: desktop
            ? { trigger: map, start: "center 55%", end: "+=650", pin: true, scrub: 0.8 }
            : { trigger: map, start: "top 80%", end: "bottom 45%", scrub: 0.8 },
        });
        tl.from(q("[data-arc]"), { drawSVG: "0%", stagger: 0.12, ease: "none" }).from(
          q("[data-node]"),
          { scale: 0, transformOrigin: "50% 50%", stagger: 0.12, ease: "back.out(3)" },
          0.2,
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const ticks = Array.from({ length: MAX - MIN + 1 }, (_, i) => MIN + i);

  return (
    <section
      ref={root}
      aria-labelledby="network-title"
      data-accent="sky"
      className="mx-auto max-w-[1320px] px-4 py-20 sm:px-8 lg:py-28"
      data-ledger
    >
      <SectionHead id="network-title" title="Network" meta="Dhaka ⇄ 5 countries · local time, live" />

      <p className="max-w-[60ch] text-lg leading-relaxed text-ink-2" data-line>
        Most of my day overlaps with someone else&apos;s morning or evening. The NeuString team spans India, Ukraine
        and Poland for a client in the USA, and my first role shipped for the Canadian market from Dhaka.
      </p>

      <div data-map className="mt-14">
        <svg viewBox={`0 0 ${W} 250`} className="w-full overflow-visible" role="img" aria-labelledby="map-title">
          <title id="map-title">UTC offset ruler with arcs from Dhaka to the USA, Canada, Poland, Ukraine and India</title>

          {network
            .filter((n) => !n.home)
            .map((n) => (
              <path key={n.id} data-arc d={arc(n)} fill="none" stroke={COLORS[n.id]} strokeWidth={1.5} strokeOpacity={0.9} />
            ))}

          <line x1={x(MIN)} x2={x(MAX)} y1={BASE} y2={BASE} stroke="var(--color-rule-strong)" />
          {ticks.map((t) => (
            <g key={t}>
              <line x1={x(t)} x2={x(t)} y1={BASE} y2={BASE + (t % 3 === 0 ? 10 : 5)} stroke="var(--color-rule-strong)" />
              {t % 3 === 0 ? (
                <text x={x(t)} y={BASE + 30} textAnchor="middle" className="fig tz-label" fontSize={13} fill="var(--color-ink-3)">
                  {t === 0 ? "UTC" : fmtOffset(t)}
                </text>
              ) : null}
            </g>
          ))}

          {network.map((n) =>
            n.offset[0] === n.offset[1] ? (
              <circle
                key={n.id}
                data-node
                cx={x(n.offset[0])}
                cy={BASE}
                r={n.home ? 7 : 5}
                fill={n.home ? COLORS[n.id] : "var(--color-paper)"}
                stroke={COLORS[n.id]}
                strokeWidth={1.5}
              />
            ) : (
              <rect
                key={n.id}
                data-node
                x={x(n.offset[0])}
                y={BASE - 3}
                width={x(n.offset[1]) - x(n.offset[0])}
                height={6}
                fill={COLORS[n.id]}
                fillOpacity={0.35}
                stroke={COLORS[n.id]}
                strokeWidth={1}
              />
            ),
          )}
        </svg>

        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {network.map((n) => (
            <li key={n.id} className="border-t-2 pt-3" style={{ borderColor: COLORS[n.id] }} data-line>
              <p className="text-lg font-semibold" style={{ color: n.home ? "var(--color-sun-ink)" : undefined }}>
                {n.label}
              </p>
              <p className="text-sm text-ink-3">{n.detail}</p>
              {n.tz ? (
                <Clock tz={n.tz} />
              ) : (
                <>
                  <p className="fig mt-3 text-[13px] text-ink-2">Several zones</p>
                  <p className="fig mt-0.5 text-[10px] text-ink-3">
                    UTC{fmtOffset(n.offset[0])} … {fmtOffset(n.offset[1])}
                  </p>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Clock({ tz }: { tz: string }) {
  const [now, setNow] = useState<{ time: string; offset: string } | null>(null);

  useEffect(() => {
    const time = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit" });
    const zone = new Intl.DateTimeFormat("en-GB", { timeZone: tz, timeZoneName: "shortOffset" });
    const update = () => {
      const d = new Date();
      const offset = zone.formatToParts(d).find((p) => p.type === "timeZoneName")?.value ?? "";
      setNow({ time: time.format(d), offset: offset.replace("GMT", "UTC").replace("-", "−") });
    };
    update();
    const id = window.setInterval(update, 20_000);
    return () => window.clearInterval(id);
  }, [tz]);

  return (
    <>
      <p className="fig mt-3 text-[13px] text-ink-2">
        <time>{now?.time ?? "--:--"}</time>
      </p>
      <p className="fig mt-0.5 text-[10px] text-ink-3">{now?.offset ?? "UTC"}</p>
    </>
  );
}
