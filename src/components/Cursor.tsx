"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const INTERACTIVE = "a, button, [data-cursor]";

/**
 * A trailing ring and dot that accompany the native cursor (never replace it).
 * Over anything interactive the ring grows; [data-cursor="Label"] shows a label.
 * [data-magnetic] elements lean toward the pointer.
 * Behind the content, a spotlight follows the pointer: a soft glow and a
 * ledger grid that only shows inside its circle. Everything takes the accent
 * colour of the section under the pointer (--cursor on :root).
 */
export function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const spot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`${FINE_POINTER} and ${MOTION_OK}`);
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled || !ring.current || !dot.current || !pill.current || !spot.current) return;
    const r = ring.current;
    const d = dot.current;
    const l = pill.current;
    const s = spot.current;

    const ringX = gsap.quickTo(r, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(r, "y", { duration: 0.5, ease: "power3.out" });
    const dotX = gsap.quickTo(d, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(d, "y", { duration: 0.12, ease: "power2.out" });
    const pillX = gsap.quickTo(l, "x", { duration: 0.35, ease: "power3.out" });
    const pillY = gsap.quickTo(l, "y", { duration: 0.35, ease: "power3.out" });

    // The spotlight trails further behind than the ring, like light catching up.
    const pos = { x: -999, y: -999 };
    const place = () => {
      s.style.setProperty("--x", `${pos.x}px`);
      s.style.setProperty("--y", `${pos.y}px`);
    };
    const spotX = gsap.quickTo(pos, "x", { duration: 0.9, ease: "power3.out", onUpdate: place });
    const spotY = gsap.quickTo(pos, "y", { duration: 0.9, ease: "power3.out", onUpdate: place });

    let magnet: HTMLElement | null = null;
    let hovering: Element | null = null;
    let hoverText = "";
    let shown = false;
    let accent = "";

    const setAccent = (el: Element | null) => {
      const section = el?.closest("[data-accent]");
      const next = section ? getComputedStyle(section).getPropertyValue("--accent").trim() : "#ffd23f";
      if (!next || next === accent) return;
      accent = next;
      gsap.to(document.documentElement, { "--cursor": next, duration: 0.8, ease: "power2.out" });
    };

    const release = () => {
      if (!magnet) return;
      gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      magnet = null;
    };

    const setHover = (el: Element | null) => {
      const text = el?.getAttribute("data-cursor") ?? "";
      if (el === hovering && text === hoverText) return;
      hovering = el;
      hoverText = text;
      setLabel(text);
      gsap.to(r, {
        scale: el ? 1.6 : 1,
        backgroundColor: el ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0)",
        opacity: el ? 1 : 0.75,
        duration: 0.35,
        ease: "power3.out",
      });
      // The label rides beside the pointer so it never covers what it names.
      gsap.to(l, { scale: text ? 1 : 0, autoAlpha: text ? 1 : 0, duration: 0.3, ease: "back.out(2)" });
      gsap.to(d, { scale: el ? 0 : 1, duration: 0.25 });
      // The light brightens a little over anything you can act on.
      gsap.to(s, { "--a": el ? 0.28 : 0.16, "--r": el ? "300px" : "240px", duration: 0.5, ease: "power2.out" });
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (!shown) {
        shown = true;
        gsap.set([r, d, l], { x: e.clientX, y: e.clientY });
        pos.x = e.clientX;
        pos.y = e.clientY;
        place();
        gsap.to(d, { autoAlpha: 1, duration: 0.3 });
        gsap.to(r, { autoAlpha: 0.75, duration: 0.3 });
        gsap.to(s, { autoAlpha: 1, duration: 0.6 });
      }
      ringX(e.clientX);
      ringY(e.clientY);
      dotX(e.clientX);
      dotY(e.clientY);
      pillX(e.clientX);
      pillY(e.clientY);
      spotX(e.clientX);
      spotY(e.clientY);

      const target = e.target instanceof Element ? e.target : null;
      setHover(target?.closest(INTERACTIVE) ?? null);
      setAccent(target);

      const m = target?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const box = m.getBoundingClientRect();
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height / 2);
        gsap.to(m, { x: dx * 0.28, y: dy * 0.38, duration: 0.4, ease: "power3.out" });
      }
    };

    const onLeave = () => {
      shown = false;
      release();
      setHover(null);
      gsap.to([r, d], { autoAlpha: 0, duration: 0.3 });
      gsap.to(s, { autoAlpha: 0, duration: 0.6 });
    };
    const onDown = () => gsap.to(r, { scale: "-=0.25", duration: 0.15, yoyo: true, repeat: 1 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      release();
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={spot}
        aria-hidden="true"
        className="spotlight pointer-events-none invisible fixed inset-0 -z-10 opacity-0"
      >
        <div className="spotlight-glow absolute inset-0" />
        <div className="spotlight-grid absolute inset-0" />
      </div>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60]">
      <div ref={ring} className="invisible absolute top-0 left-0 -mt-5 -ml-5 size-10 rounded-full border border-[var(--cursor)] opacity-0" />
      <div ref={pill} className="invisible absolute top-0 left-0 opacity-0">
        <span className="fig mt-6 ml-6 block bg-[var(--cursor)] px-2 py-1 text-[10px] font-semibold tracking-wide whitespace-nowrap text-paper uppercase">
          {label}
        </span>
      </div>
      <div ref={dot} className="invisible absolute top-0 left-0 -mt-1 -ml-1 size-2 rounded-full bg-[var(--cursor)] opacity-0" />
      </div>
    </>
  );
}
