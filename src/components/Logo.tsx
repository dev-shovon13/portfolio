"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const WORD = "Shovon";

/** The KS monogram (same drawing as the favicon), without its tile. */
function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="6 8 52 50" className={className} aria-hidden="true">
      <g fill="none" stroke="var(--color-ink)" strokeWidth="6.5" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M14 13v28" />
        <path d="M29 13 18.5 27 29 41" />
        <path d="M50 14H39.5a4.5 4.5 0 0 0-4.5 4.5v3.2a4.5 4.5 0 0 0 4.5 4.5h6a4.5 4.5 0 0 1 4.5 4.5v4.1a4.5 4.5 0 0 1-4.5 4.5H35" />
      </g>
      <path
        d="M10 49h44M10 54h44"
        stroke="var(--color-sun-fill)"
        strokeWidth="3"
        className="origin-left transition-transform duration-500 ease-out-expo [transform-box:fill-box] group-hover:scale-x-[1.12]"
      />
    </svg>
  );
}

/**
 * Header wordmark: KS monogram + "Shovon." in Clash Display.
 * Hover rolls each letter up into a yellow copy; past the top of the page the word tucks away
 * and only the monogram stays.
 */
export function Logo() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 160);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <Link href="/" aria-label="Kawser Ahmed Shovon, home" data-cursor="Home" className="group flex min-h-10 shrink-0 items-center gap-2.5">
      <Mark className="h-7 w-auto transition-transform duration-500 ease-out-expo group-hover:-rotate-6 motion-reduce:transition-none" />
      <span
        aria-hidden="true"
        className={`grid max-[359px]:hidden transition-[grid-template-columns,opacity] duration-500 ease-out-expo motion-reduce:transition-none ${
          compact ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100"
        }`}
      >
        <span className="min-w-0 overflow-hidden">
          <span className="stmt flex pr-0.5 text-[1.4rem] leading-none whitespace-nowrap">
            {[...WORD, "."].map((ch, i) => (
              <span key={i} className="relative inline-block overflow-hidden">
                <span
                  className={`block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full motion-reduce:transition-none ${
                    ch === "." ? "text-sun-fill" : "text-ink"
                  }`}
                  style={{ transitionDelay: `${i * 28}ms` }}
                >
                  {ch}
                </span>
                <span
                  className="absolute inset-0 block translate-y-full text-sun transition-transform duration-500 ease-out-expo group-hover:translate-y-0 motion-reduce:transition-none"
                  style={{ transitionDelay: `${i * 28}ms` }}
                >
                  {ch}
                </span>
              </span>
            ))}
          </span>
        </span>
      </span>
    </Link>
  );
}
