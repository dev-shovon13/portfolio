"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

const rows = [
  ["React", "Next.js", "TypeScript", "Tailwind CSS", "Redux Toolkit", "Material UI"],
  ["Node.js", "Express", "MongoDB", "REST APIs", "GraphQL", "Firebase"],
];

const DOTS = ["var(--color-sun)", "var(--color-sky)", "var(--color-mint)"];

/** Frontend row drifts left to right, backend row right to left; both speed up with the scroll. */
export function Marquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tracks = gsap.utils.toArray<HTMLElement>("[data-track]", root.current);
        const loops = tracks.map((track, i) =>
          gsap.fromTo(
            track,
            // Row 0 (frontend) runs left to right; row 1 (backend) runs right to left.
            { xPercent: i % 2 ? 0 : -50 },
            { xPercent: i % 2 ? -50 : 0, duration: 38, ease: "none", repeat: -1 },
          ),
        );

        // Scrolling speeds both rows up (never reverses them).
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 260, 7);
            loops.forEach((loop) => gsap.to(loop, { timeScale: boost, duration: 0.2, overwrite: true }));
          },
        });
        // Ease back to cruising speed when the scroll stops.
        const settle = () => loops.forEach((loop) => gsap.to(loop, { timeScale: 1, duration: 1.2, overwrite: true }));
        ScrollTrigger.addEventListener("scrollEnd", settle);

        return () => {
          st.kill();
          ScrollTrigger.removeEventListener("scrollEnd", settle);
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Technologies" className="overflow-hidden border-y border-rule py-10 sm:py-14">
      {rows.map((words, i) => (
        <div key={i} className="flex w-max" data-track>
          {[0, 1].map((copy) => (
            <p
              key={copy}
              aria-hidden={copy === 1}
              className="stmt flex shrink-0 items-center text-[clamp(2.75rem,8vw,6rem)] leading-[1.05] font-semibold"
            >
              {words.map((w, j) => (
                <span key={w} className="flex items-center">
                  <span
                    className={(j + i) % 2 ? "text-transparent" : "text-ink"}
                    style={(j + i) % 2 ? { WebkitTextStroke: `1.5px ${DOTS[(j + i + 1) % DOTS.length]}` } : undefined}
                  >
                    {w}
                  </span>
                  <span
                    className="mx-[0.45em] inline-block size-[0.16em] rotate-45"
                    style={{ backgroundColor: DOTS[(j + i) % DOTS.length] }}
                    aria-hidden="true"
                  />
                </span>
              ))}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
