"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, MOTION_OK } from "@/lib/gsap";
import { loaded } from "@/lib/loader";
import { setLenis } from "@/lib/scroll";

export function SmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia(MOTION_OK).matches) return;

    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);
    let alive = true;

    // Start smooth scrolling once the loader has lifted, so nothing scrolls underneath it.
    loaded.then(() => {
      if (!alive) return;
      // Land section headings just under the 56px header: sections carry 80px (112px at lg) of top padding.
      // Matches the scroll-margin on each section for non-Lenis jumps (e.g. arriving from another page).
      lenis = new Lenis({ duration: 1.1, anchors: { offset: window.innerWidth >= 1024 ? 24 : 0 } });
      lenis.on("scroll", ScrollTrigger.update);
      setLenis(lenis);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      alive = false;
      setLenis(null);
      gsap.ticker.remove(tick);
      lenis?.destroy();
    };
  }, []);

  return null;
}
