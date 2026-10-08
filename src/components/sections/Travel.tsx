"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { travel } from "@/content/profile";
import { SectionHead } from "@/components/ledger/SectionHead";
import { TravelMap } from "@/components/travel/TravelMap";
import type { WorldMap } from "@/lib/worldMap";

export function Travel({ map }: { map: WorldMap }) {
  const root = useRef<HTMLElement>(null);
  const { visited, total } = travel.districts;
  const abroad = travel.countries.filter((c) => c.country !== "Bangladesh");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const count = q("[data-district-count]")[0];
        const n = { v: 0 };
        gsap
          .timeline({ scrollTrigger: { trigger: q("[data-districts]")[0], start: "top 80%", toggleActions: "play none none none" } })
          .from(q("[data-cell]"), { scale: 0, duration: 0.5, ease: "back.out(2)", stagger: { each: 0.012, grid: [4, 16], from: "start" } })
          .to(
            n,
            {
              v: visited,
              duration: 1.2,
              ease: "power2.out",
              onUpdate: () => {
                if (count) count.textContent = String(Math.round(n.v));
              },
            },
            0,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="travel"
      aria-labelledby="travel-title"
      data-accent="sun"
      className="mx-auto max-w-[1320px] scroll-mt-0 lg:-scroll-mt-6 px-4 py-20 sm:px-8 lg:py-28"
      data-ledger
    >
      <SectionHead id="travel-title" title="Off the clock" meta={`${travel.countries.length} countries · ${visited} of ${total} districts`} />

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p className="max-w-[44ch] text-lg leading-relaxed text-ink-2" data-line>
            I love to travel. Home comes first: I&apos;ve been to{" "}
            <span className="mark" data-mark>
              {visited} of Bangladesh&apos;s {total} districts
            </span>
            . Beyond the border: India, Singapore and Malaysia.
          </p>

          <figure className="mt-10" data-districts>
            <div className="grid grid-cols-16 gap-1" role="img" aria-label={`${visited} of ${total} districts of Bangladesh visited`}>
              {Array.from({ length: total }, (_, i) => (
                <span
                  key={i}
                  data-cell
                  className={`aspect-square ${i < visited ? "bg-accent" : "border border-rule-strong"}`}
                />
              ))}
            </div>
            <figcaption className="fig mt-3 flex justify-between text-[11px] text-ink-3">
              <span>Districts of Bangladesh</span>
              <span>
                <span data-district-count className="text-accent">
                  {visited}
                </span>{" "}
                / {total}
              </span>
            </figcaption>
          </figure>

          <ul className="mt-10">
            {abroad.map((c) => (
              <li key={c.country} className="grid grid-cols-[7.5rem_1fr] gap-x-4 border-t border-rule py-4 last:border-b" data-line>
                <span className="stmt text-xl font-semibold text-ink">{c.country}</span>
                <span className="fig pt-1 text-[11px] leading-relaxed text-ink-2">{c.places.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-7">
          <TravelMap map={map} />
          <ul className="fig mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[10.5px] text-ink-3" aria-label="Map legend">
            {map.visited
              .filter((v, i, all) => all.findIndex((x) => x.color === v.color) === i)
              .map((v) => (
                <li key={v.id} className="inline-flex items-center gap-2">
                  <span className="size-2" style={{ backgroundColor: v.color }} aria-hidden="true" />
                  {map.visited.filter((x) => x.color === v.color).map((x) => x.name).join(" · ")}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
