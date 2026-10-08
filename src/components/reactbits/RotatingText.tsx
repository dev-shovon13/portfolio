"use client";
// Adapted from React Bits "RotatingText" (MIT + Commons Clause, (c) David Haz). See ./NOTICE.md.
// Re-implemented on GSAP: letters of the outgoing word lift out, the next word's letters rise in.
// The box is always as wide as the longest word (invisible copies share its grid cell), so the
// surrounding text never re-wraps when the word changes.

import { useEffect, useRef } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

type Props = { words: string[]; interval?: number; className?: string };

export function RotatingText({ words, interval = 2200, className = "" }: Props) {
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = inner.current;
    if (!wrap || words.length < 2 || !window.matchMedia(MOTION_OK).matches) return;
    let i = 0;
    let busy = false;

    const render = (word: string) => {
      wrap.replaceChildren(
        ...[...word].map((ch) => {
          const s = document.createElement("span");
          s.className = "inline-block whitespace-pre";
          s.textContent = ch;
          return s;
        }),
      );
      return Array.from(wrap.children) as HTMLElement[];
    };
    render(words[0]);

    const next = () => {
      if (busy || document.hidden) return;
      busy = true;
      i = (i + 1) % words.length;
      gsap
        .timeline({ onComplete: () => void (busy = false) })
        .to(wrap.children, { yPercent: -110, autoAlpha: 0, duration: 0.3, ease: "power2.in", stagger: 0.018 })
        .add(() => {
          const letters = render(words[i]);
          gsap.fromTo(letters, { yPercent: 105, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out", stagger: 0.025 });
        });
    };
    const id = window.setInterval(next, interval);
    return () => {
      window.clearInterval(id);
      gsap.killTweensOf(Array.from(wrap.children));
    };
  }, [words, interval]);

  return (
    <span className={`inline-grid overflow-hidden align-bottom ${className}`} aria-hidden="true">
      {/* Invisible copies of every word reserve the widest width. */}
      {words.map((w) => (
        <span key={w} className="invisible col-start-1 row-start-1 whitespace-nowrap">
          {w}
        </span>
      ))}
      <span ref={inner} className="col-start-1 row-start-1 inline-flex justify-center whitespace-nowrap">
        {words[0]}
      </span>
    </span>
  );
}
