"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { markLoaded } from "@/lib/loader";
import { Check } from "@/components/icons";

const STEPS = ["Typefaces", "Assets", "Statement"];
const MIN_MS = 1100;
const MAX_MS = 3200;

/**
 * Full-reload loader: a ledger counter runs to 100 while fonts and the page load,
 * then a curtain wipes up. Hidden without JS (see .loader in globals.css).
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const count = q("[data-count]")[0];
      const bar = q("[data-bar]")[0];
      const ticks = q<HTMLElement>("[data-tick]");
      const html = document.documentElement;
      html.style.overflow = "hidden";

      const finish = () => {
        html.style.overflow = "";
        setGone(true);
      };

      // Reduced motion: no counting, just a short fade.
      if (!window.matchMedia(MOTION_OK).matches) {
        markLoaded();
        gsap.to(el, { autoAlpha: 0, duration: 0.3, delay: 0.2, onComplete: finish });
        return;
      }

      const progress = { v: 0 };
      let shown = 0;
      const render = () => {
        // Overlapping count-ups (e.g. fonts ready early) must never make the number go backwards.
        shown = Math.max(shown, Math.round(progress.v));
        const v = shown;
        count.textContent = String(v).padStart(3, "0");
        gsap.set(bar, { scaleX: v / 100 });
        ticks.forEach((t, i) => t.classList.toggle("is-done", v >= (i + 1) * 33));
      };
      const to = (v: number, duration: number) =>
        new Promise<void>((done) => gsap.to(progress, { v, duration, ease: "power2.out", onUpdate: render, onComplete: done }));

      const pageLoaded = new Promise<void>((r) => (document.readyState === "complete" ? r() : window.addEventListener("load", () => r(), { once: true })));
      const work = Promise.all([document.fonts.ready.then(() => to(Math.max(progress.v, 36), 0.5)), pageLoaded]);
      const atLeast = new Promise((r) => setTimeout(r, MIN_MS));
      const atMost = new Promise((r) => setTimeout(r, MAX_MS));

      let cancelled = false;
      (async () => {
        await to(30, 0.6);
        await Promise.race([Promise.all([work, atLeast]), atMost]);
        if (cancelled) return;
        await to(72, 0.35);
        await to(100, 0.45);
        if (cancelled) return;
        gsap
          .timeline({ onComplete: finish })
          .to(q("[data-loader-rise]"), { yPercent: -110, duration: 0.6, ease: "expo.in", stagger: 0.04 })
          .add(markLoaded, "-=0.05")
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" }, "-=0.1");
      })();

      return () => {
        cancelled = true;
        html.style.overflow = "";
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div
      ref={root}
      className="loader fixed inset-0 z-[100] flex-col justify-between bg-night px-4 py-6 text-ink sm:px-8 sm:py-8"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
      <div className="flex justify-between overflow-hidden" aria-hidden="true">
        <span data-loader-rise className="stmt text-[1.4rem] leading-none text-ink">
          Shovon<span className="text-sun">.</span>
        </span>
        <span data-loader-rise className="fig text-[11px] text-ink-3">
          Statement of work · Dec 2021 → present
        </span>
      </div>

      <div aria-hidden="true">
        <div className="flex items-end justify-between gap-6">
          <div className="overflow-hidden">
            <p data-loader-rise className="stmt text-[clamp(5rem,22vw,15rem)] leading-[0.8] font-semibold tabular-nums">
              <span data-count>000</span>
              <span className="text-sun">%</span>
            </p>
          </div>
          <ul className="fig hidden overflow-hidden pb-3 text-[11px] sm:block">
            {STEPS.map((s, i) => (
              <li key={s} data-loader-rise className="flex items-center gap-3 py-1 text-ink-3">
                <span className="w-5 text-ink-3">{String(i + 1).padStart(2, "0")}</span>
                <span className="w-24">{s}</span>
                <span data-tick className="loader-tick inline-flex w-16 items-center gap-1.5">
                  <span className="pending">Pending</span>
                  <span className="done items-center gap-1 text-mint">
                    <Check size={11} /> Matched
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-6 h-[3px] w-full overflow-hidden bg-rule">
          <div
            data-bar
            className="h-full origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-sun),var(--color-mint),var(--color-sky))]"
          />
        </div>
      </div>
    </div>
  );
}
