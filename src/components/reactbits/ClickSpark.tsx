"use client";
// Adapted from React Bits "ClickSpark" (MIT + Commons Clause, (c) David Haz). See ./NOTICE.md.
// Page-wide: one fixed canvas, sparks in the accent of the section under the pointer, idle when nothing to draw.

import { useEffect, useRef } from "react";
import { MOTION_OK } from "@/lib/gsap";

type Spark = { x: number; y: number; angle: number; start: number; color: string };

const SIZE = 14;
const RADIUS = 28;
const COUNT = 8;
const DURATION = 560;
const easeOut = (t: number) => t * (2 - t);

export function ClickSpark() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvas.current;
    if (!c || !window.matchMedia(MOTION_OK).matches) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let sparks: Spark[] = [];
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks = sparks.filter((s) => {
        const t = (now - s.start) / DURATION;
        if (t >= 1) return false;
        const e = easeOut(t);
        const d = e * RADIUS;
        const len = SIZE * (1 - e);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(s.x + d * Math.cos(s.angle), s.y + d * Math.sin(s.angle));
        ctx.lineTo(s.x + (d + len) * Math.cos(s.angle), s.y + (d + len) * Math.sin(s.angle));
        ctx.stroke();
        return true;
      });
      raf = sparks.length ? requestAnimationFrame(draw) : 0;
    };

    const onDown = (e: PointerEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest("input, textarea, select, canvas")) return;
      const section = target?.closest("[data-accent]");
      const color = (section ? getComputedStyle(section).getPropertyValue("--accent") : getComputedStyle(document.documentElement).getPropertyValue("--cursor")).trim() || "#ffd23f";
      const now = performance.now();
      for (let i = 0; i < COUNT; i++) sparks.push({ x: e.clientX, y: e.clientY, angle: (2 * Math.PI * i) / COUNT, start: now, color });
      if (!raf) raf = requestAnimationFrame(draw);
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvas} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] size-full" />;
}
