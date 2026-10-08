"use client";
// Adapted from React Bits "ShinyText" (MIT + Commons Clause, (c) David Haz). See ./NOTICE.md.
// Ported from motion/react to the GSAP ticker.

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

type Props = {
  children: ReactNode;
  /** When false, renders plain text (no gradient), e.g. while an intro animation owns the letters. */
  active?: boolean;
  speed?: number; // seconds per sweep
  delay?: number; // seconds of rest between sweeps
  offset?: number; // seconds to start into the cycle (stagger several lines)
  color: string;
  shineColor: string;
  spread?: number;
  className?: string;
  style?: CSSProperties;
};

export function ShinyText({ children, active = true, speed = 2.4, delay = 1.6, offset = 0, color, shineColor, spread = 120, className = "", style: extra }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !active || !window.matchMedia(MOTION_OK).matches) return;
    let elapsed = -offset * 1000;
    const run = speed * 1000;
    const cycle = run + delay * 1000;
    const tick = (_t: number, dt: number) => {
      elapsed += dt;
      const ct = elapsed < 0 ? run : elapsed % cycle;
      const p = ct < run ? (ct / run) * 100 : 100; // hold off-screen during the rest
      // p=0 -> shine off the right; p=100 -> off the left.
      el.style.backgroundPosition = `${150 - p * 2}% center`;
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [active, speed, delay, offset]);

  const style: CSSProperties | undefined = active
    ? {
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: "200% auto",
        backgroundPosition: "150% center",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }
    : undefined;

  return (
    <span ref={ref} className={`inline-block ${className}`} style={{ ...extra, ...style }}>
      {children}
    </span>
  );
}
