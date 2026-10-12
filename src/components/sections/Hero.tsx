"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { loaded } from "@/lib/loader";
import { hero, profile, workPlaces } from "@/content/profile";
import { ArrowRight, Download } from "@/components/icons";
import { ShinyText } from "@/components/reactbits/ShinyText";
import { RotatingText } from "@/components/reactbits/RotatingText";

const Globe = dynamic(() => import("@/components/three/Globe"), { ssr: false });
// Centred on Dhaka.
const FOCUS = { lat: 23.81, lon: 90.41 };

// Play the opening once per page load, not on every client-side return.
let played = false;

function DhakaTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: profile.timezone, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const update = () => setTime(fmt.format(new Date()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);
  const parts = (time ?? "--:--:--").split(":");
  return (
    <time dateTime={time ?? undefined}>
      {parts.map((p, i) => (
        <span key={i}>
          {i ? (
            <span className="blink" aria-hidden="true">
              :
            </span>
          ) : null}
          {p}
        </span>
      ))}
    </time>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [shine, setShine] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, (context) => {
        const q = gsap.utils.selector(root);
        const show = q("[data-enter]");
        let split: SplitText | null = null;
        const cleanup = () => split?.revert();

        if (played) {
          // Returning (or React's dev double-run): settle everything in its final state.
          gsap.set(show, { autoAlpha: 1 });
          gsap.set(q("[data-globe]"), { scale: 1, rotate: 0 });
          setShine(true);
          return cleanup;
        }
        played = true;

        // The intro plays as the page loader lifts. Registered on the context so it is reverted with it.
        // Letters rise in, then the split is undone and the Shiny Text sweep takes over the name.
        context.add("intro", () => {
          // Split the shine spans themselves so React keeps owning those elements after revert().
          split = SplitText.create(q("[data-name-line] > span"), { type: "chars", mask: "lines" });
          gsap.set(show, { autoAlpha: 1 });
          gsap
            .timeline({
              defaults: { ease: "expo.out" },
              onComplete: () => {
                split?.revert();
                split = null;
                setShine(true);
              },
            })
            .from(split.chars, { yPercent: 115, rotate: 6, duration: 1.2, stagger: 0.028 }, 0)
            // 5+ years: the digit counts up as the name lands, then the plus pops in with a spin.
            .from(q("[data-years] [data-years-n]"), { textContent: 0, duration: 1.1, ease: "power2.out", snap: { textContent: 1 } }, 0.5)
            .from(q("[data-years-plus]"), { scale: 0, rotate: -180, duration: 0.7, ease: "back.out(2.4)" }, 1.4)
            // ...and turns a half spin every few seconds afterwards.
            .add(() => {
              gsap.to(q("[data-years-plus]"), { rotate: "+=180", duration: 0.8, ease: "back.inOut(1.6)", repeat: -1, repeatDelay: 4.2 });
            }, 2.4)
            .from(q("[data-meta]"), { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.07 }, 0.45)
            // No rotation here: the globe panel must always settle level, north up.
            .from(q("[data-globe]"), { autoAlpha: 0, scale: 0.9, duration: 1.6, clearProps: "scale" }, 0.2);
        });
        let alive = true;
        loaded.then(() => alive && (context as unknown as { intro: () => void }).intro());

        return () => {
          alive = false;
          cleanup();
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const [first, ...rest] = profile.nameLines;

  return (
    <section
      ref={root}
      aria-labelledby="hero-name"
      data-accent="sun"
      className="relative mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-y-6 px-4 pt-10 pb-16 sm:px-8 lg:min-h-[calc(100dvh-3.5rem)] lg:grid-cols-12 lg:gap-x-8 lg:pt-8 lg:pb-16"
    >
      <div className="relative z-10 flex flex-col lg:col-span-7" data-parallax="90" data-parallax-start="top" data-parallax-desktop>
        <h1 id="hero-name" className="stmt text-[clamp(3.8rem,11vw,7.25rem)] font-semibold text-ink" data-enter>
          <span data-name-line className="block">
            <ShinyText active={shine} color="#b9c4d9" shineColor="#ffffff" offset={0}>
              {first}
            </ShinyText>
          </span>
          <span data-name-line className="block">
            <ShinyText active={shine} color="#b9c4d9" shineColor="#ffffff" offset={0.18}>
              {rest[0]}
            </ShinyText>
          </span>
          <span data-name-line className="block text-accent">
            <ShinyText active={shine} color="#ffd23f" shineColor="#ffffff" offset={0.36}>
              {rest[1]}.
            </ShinyText>
          </span>
        </h1>

        {/* Experience at a glance. */}
        <p
          className="mt-9 inline-flex items-stretch self-start border border-rule-strong bg-paper-2/70 shadow-[0_16px_32px_-20px_rgba(0,0,0,0.8)]"
          data-years
          data-meta
          data-enter
        >
          {/* Stencil figure (Black Ops One) in mint: reads instantly and never blends into the (Clash Display) name. */}
          {/* The "+" spins, so it gets its own shine inside the rotating wrapper: a transformed child of a
              background-clip:text element renders on its own layer and would otherwise be invisible. */}
          <span
            className="flex items-center px-4 py-2 text-[clamp(2.5rem,6vw,3.25rem)] leading-none tracking-[0.02em] sm:px-5"
            style={{ fontFamily: "var(--font-stat)" }}
            aria-label={`${hero.years}+`}
          >
            <ShinyText color="#62f9d5" shineColor="#ffffff" speed={1.6} delay={3.2} offset={-1.8}>
              <span data-years-n>{hero.years}</span>
            </ShinyText>
            <span data-years-plus className="inline-block">
              <ShinyText color="#62f9d5" shineColor="#ffffff" speed={1.6} delay={3.2} offset={-1.5}>
                +
              </ShinyText>
            </span>
          </span>
          <span className="flex flex-col justify-center gap-1 border-l border-rule-strong px-4 py-3 sm:px-5">
            <span className="stmt-wide text-sm text-ink sm:text-base">{hero.yearsLabel}</span>
            <span className="fig text-[11px] text-ink-3">{hero.yearsNote}</span>
          </span>
        </p>

        <p className="mt-7 max-w-[40ch] text-lg leading-snug text-ink-2 sm:text-xl" data-meta data-enter>
          <span className="text-ink">{profile.role}</span> building{" "}
          <RotatingText words={hero.stack} className="-my-1 bg-accent px-2 py-0.5 font-medium text-paper" /> {hero.pitch}
          <span className="sr-only">
            {" "}
            Stack: {hero.stack.slice(0, -1).join(", ")} and {hero.stack.at(-1)}.
          </span>
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3" data-meta data-enter>
          <a
            href={profile.resume}
            download={profile.resumeFile}
            data-magnetic
            data-cursor="PDF"
            className="stmt-wide group inline-flex items-center gap-2.5 bg-accent px-5 py-3 text-sm text-paper transition-[filter,transform] duration-200 hover:brightness-110 active:translate-y-px"
          >
            <Download className="transition-transform duration-300 ease-out-expo group-hover:translate-y-0.5" />
            Résumé
          </a>
          <Link
            href="/cv"
            data-magnetic
            data-cursor="Preview"
            className="stmt-wide group inline-flex items-center gap-2.5 border border-sky/70 px-5 py-3 text-sm text-sky transition-colors duration-200 hover:bg-sky hover:text-paper"
          >
            View CV
            <ArrowRight className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
          </Link>
          <a
            href={`mailto:${profile.email}`}
            data-magnetic
            data-cursor="Write"
            className="stmt-wide group inline-flex items-center gap-2.5 border border-rule-strong px-5 py-3 text-sm text-ink transition-colors duration-200 hover:border-mint hover:text-mint"
          >
            Email me
          </a>
        </div>

        <dl className="fig mt-12 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1.5 text-[11px] text-ink-3" data-meta data-enter>
          <dt>Dhaka</dt>
          <dd className="text-ink-2">
            <DhakaTime /> · GMT+6
          </dd>
          <dt>Since</dt>
          <dd className="text-ink-2">{profile.since}, 5+ years</dd>
          <dt>Also</dt>
          <dd className="text-ink-2">Node.js · Express · MongoDB</dd>
        </dl>
      </div>

      <figure
        className="relative lg:col-span-5 lg:-ml-16"
        data-globe
        data-enter
        data-parallax="-60"
        data-parallax-start="top"
        data-parallax-desktop
      >
        <div className="relative -mx-4 aspect-square max-h-155 overflow-hidden sm:mx-0 lg:aspect-auto lg:h-[min(600px,72dvh)] lg:overflow-visible">
          <Globe places={workPlaces} focus={FOCUS} distance={4.6} hold />
          <p className="fig pointer-events-none absolute right-1 bottom-1 text-[10px] text-ink-3 sm:right-2" aria-hidden="true">
            Drag to spin
          </p>
        </div>
        <figcaption className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-center lg:mt-1">
          <span className="inline-flex items-center gap-2 text-sm text-ink">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inset-0 animate-ping rounded-full bg-sun opacity-60 motion-reduce:animate-none" />
              <span className="relative size-2 rounded-full bg-sun" />
            </span>
            Built with international teammates in
          </span>
          <span className="fig flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-[11px] uppercase">
            {workPlaces
              .filter((p) => !p.origin)
              .map((p) => (
                <span key={p.name} style={{ color: p.color }}>
                  {p.name}
                </span>
              ))}
          </span>
          <span className="sr-only">
            The globe is centred on Dhaka, with arcs to each of these countries.
          </span>
        </figcaption>
      </figure>
    </section>
  );
}
