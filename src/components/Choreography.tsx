"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * One scroll grammar for the whole page.
 *
 *   [data-ledger]         a block that reconciles as it enters
 *     [data-draw]         a rule inside it that draws left to right
 *     [data-line]         a line item inside it that slides in and locks
 *   [data-split]          a heading whose letters rise out of a mask on entry
 *   [data-ink]            prose that inks in word by word as you scroll through it
 *   [data-parallax="n"]   drifts n px against the scroll (scrubbed);
 *                         data-parallax-start="top" for elements already in view, data-parallax-desktop for ≥1024px only
 *   [data-fill]           a rule that fills top to bottom across its [data-fill-track]
 *   [data-page-progress]  the header rule that tracks reading progress
 *   [data-scramble]       text that decodes from noise on entry (codes, names, routes)
 *   [data-rise]           a frame that rises and tips up into place in 3D, then a sheen crosses it ([data-sheen])
 *   [data-mark]           a highlighter stroke swept in behind a key phrase
 *   [data-tighten]        a heading whose tracking closes up as it arrives, scrubbed
 *
 * With Cache Components, the previous route stays in the DOM (hidden) after a client-side
 * navigation, so every query is limited to elements that are actually rendered.
 */
const live = (selector: string) =>
  gsap.utils.toArray<HTMLElement>(selector).filter((el) => el.getClientRects().length > 0 && !el.closest(".loader"));

export function Choreography() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    // Set up one frame later, once every section's own effects (and React's dev double-run of them) have settled.
    // Entrance triggers use toggleActions "play none none none" rather than once: a `once` trigger kills itself
    // when it fires during creation (e.g. landing on /#cv, already past it), mutating ScrollTrigger's list
    // mid-refresh and crashing with "reading 'end'".
    const raf = requestAnimationFrame(() => mm.add(MOTION_OK, () => {
      const splits: SplitText[] = [];

      live("[data-ledger]").forEach((block) => {
        // Nested ledgers animate themselves; only take what belongs to this block.
        const own = (el: Element) => el.closest("[data-ledger]") === block;
        const rules = Array.from(block.querySelectorAll("[data-draw]")).filter(own);
        const lines = Array.from(block.querySelectorAll("[data-line]")).filter(own);

        const tl = gsap.timeline({
          scrollTrigger: { trigger: block, start: "top 84%", toggleActions: "play none none none" },
        });
        if (rules.length) tl.from(rules, { scaleX: 0, duration: 1.2, stagger: 0.08 }, 0);
        if (lines.length) tl.from(lines, { autoAlpha: 0, y: 18, duration: 0.8, stagger: 0.06 }, 0.1);
      });

      live("[data-split]").forEach((el) => {
        splits.push(
          SplitText.create(el, {
            type: "lines,chars",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.chars, {
                yPercent: 115,
                rotate: 4,
                duration: 1.1,
                stagger: 0.022,
                scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
              }),
          }),
        );
      });

      live("[data-ink]").forEach((el) => {
        const split = SplitText.create(el, { type: "words" });
        splits.push(split);
        // Fully inked by the time its section lands at the top (where the nav anchors park it),
        // or once the prose's last line clears 70% of the viewport, whichever comes first.
        const section = el.closest("section") ?? el;
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start: "top 78%",
              end: () => {
                const y = window.scrollY;
                const cleared = el.getBoundingClientRect().bottom + y - window.innerHeight * 0.7;
                const landed = section.getBoundingClientRect().top + y;
                return Math.min(cleared, landed);
              },
              scrub: 0.6,
            },
          },
        );
      });

      live("[data-parallax]").forEach((el) => {
        if (el.dataset.parallaxDesktop !== undefined && !window.matchMedia("(min-width: 1024px)").matches) return;
        const distance = Number(el.dataset.parallax) || 40;
        const atTop = el.dataset.parallaxStart === "top";
        gsap.fromTo(
          el,
          { y: atTop ? 0 : -distance / 2 },
          {
            y: atTop ? distance : distance / 2,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: atTop ? "top top" : "top bottom",
              end: atTop ? "bottom top" : "bottom top",
              scrub: true,
            },
          },
        );
      });

      live("[data-fill]").forEach((el) => {
        const track = el.closest("[data-fill-track]") ?? el.parentElement!;
        gsap.fromTo(
          el,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: track, start: "top 70%", end: "bottom 55%", scrub: 0.4 },
          },
        );
      });

      live("[data-scramble]").forEach((el, i) => {
        const text = el.textContent ?? "";
        gsap.to(el, {
          duration: Math.min(1.4, 0.5 + text.length * 0.03),
          delay: (i % 8) * 0.04,
          scrambleText: { text, chars: "01ABCDEF/:#", speed: 0.6, revealDelay: 0.15 },
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
        });
      });

      live("[data-rise]").forEach((el) => {
        const sheen = el.querySelector("[data-sheen]");
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" } });
        tl.from(el, {
          y: 70,
          rotateX: 16,
          scale: 0.95,
          autoAlpha: 0,
          transformPerspective: 1100,
          transformOrigin: "50% 100%",
          duration: 1.2,
          ease: "expo.out",
        });
        if (sheen) tl.fromTo(sheen, { xPercent: 0, opacity: 1 }, { xPercent: 420, opacity: 1, duration: 1.1, ease: "power2.inOut" }, 0.55).set(sheen, { opacity: 0 });
      });

      live("[data-mark]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { backgroundSize: "0% 100%" },
          {
            backgroundSize: "100% 100%",
            duration: 0.9,
            delay: 0.25 + (i % 3) * 0.15,
            ease: "power2.inOut",
            scrollTrigger: { trigger: el, start: "top 82%", toggleActions: "play none none none" },
          },
        );
      });

      live("[data-tighten]").forEach((el) => {
        gsap.fromTo(
          el,
          { letterSpacing: "0.12em", opacity: 0.25 },
          {
            letterSpacing: "-0.035em",
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 95%", end: "top 75%", scrub: 0.5 },
          },
        );
      });

      const progress = live("[data-page-progress]")[0];
      if (progress) {
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.3 },
          },
        );
      }

      ScrollTrigger.refresh();
      return () => splits.forEach((s) => s.revert());
    }));

    return () => {
      cancelAnimationFrame(raf);
      mm.revert();
    };
  });

  return null;
}
