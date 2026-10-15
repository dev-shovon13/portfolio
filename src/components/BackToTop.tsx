"use client";

import { useEffect, useRef, useState } from "react";
import { scrollToTop } from "@/lib/scroll";

const R = 21;
const C = 2 * Math.PI * R;

/** Appears after about a screen of scrolling; its ring shows reading progress. */
export function BackToTop() {
  const [shown, setShown] = useState(false);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setShown(y > window.innerHeight * 0.9);
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - (max > 0 ? Math.min(1, y / max) : 0)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={shown ? 0 : -1}
      aria-hidden={!shown}
      data-cursor="Top"
      className={`group fixed right-4 bottom-4 z-30 grid size-12 place-items-center rounded-full border border-rule-strong bg-night/90 text-ink shadow-[0_12px_28px_-12px_var(--shadow)] backdrop-blur-sm transition-[opacity,transform,border-color] duration-500 ease-out-expo hover:border-[var(--cursor)] motion-reduce:transition-none sm:right-6 sm:bottom-6 ${
        shown ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-75 opacity-0"
      }`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle
          ref={ring}
          cx="24"
          cy="24"
          r={R}
          fill="none"
          stroke="var(--cursor)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C}
        />
      </svg>
      <svg
        viewBox="0 0 16 16"
        className="relative size-4 transition-transform duration-300 ease-out-expo group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
        aria-hidden="true"
      >
        <path d="M8 13V3.5M4 7.5 8 3.5l4 4" />
      </svg>
    </button>
  );
}
