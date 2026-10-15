"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { profile } from "@/content/profile";
import { SectionHead } from "@/components/ledger/SectionHead";
import { CvSheet } from "@/components/cv/CvSheet";
import { buildCv, cvDefaultOff, cvHeadline, cvSummary } from "@/content/cv";
import { ArrowRight, Download } from "@/components/icons";

const DEFAULT_CV = buildCv(new Set(cvDefaultOff), cvHeadline, cvSummary);

/** First page of the default CV, scaled to fit its card. */
function PaperPreview() {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 794));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={box} className="relative aspect-[794/1123] overflow-hidden bg-[#fbfaf7]" aria-hidden="true">
      <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
        <CvSheet cv={DEFAULT_CV} />
      </div>
    </div>
  );
}

/** Home-page CV block: the CV as a paper card that rises and straightens as it scrolls in. */
export function CvSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const paper = root.current!.querySelector("[data-paper]");
        gsap.fromTo(
          paper,
          { yPercent: 18, rotate: 7, scale: 0.92 },
          {
            yPercent: 0,
            rotate: -2.5,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: paper, start: "top bottom", end: "center 55%", scrub: 0.7 },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="cv"
      aria-labelledby="cv-title"
      data-accent="mint"
      className="mx-auto max-w-[1320px] scroll-mt-0 lg:-scroll-mt-6 overflow-x-clip px-4 py-20 sm:px-8 lg:py-28"
      data-ledger
    >
      <SectionHead id="cv-title" title="Curriculum vitae" meta="Pick sections · live preview · PDF or text" />

      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <p className="max-w-[40ch] text-lg leading-relaxed text-ink-2" data-line>
            Need a shorter CV, or only the backend side? Tick the sections you want, reword the summary, watch the page
            update, then download it as an ATS-friendly PDF or plain text.
          </p>
          <div className="mt-8 flex flex-wrap gap-3" data-line>
            <Link
              href="/cv"
              data-magnetic
              data-cursor="Preview"
              className="stmt-wide group inline-flex items-center gap-2.5 bg-accent-fill px-5 py-3 text-sm text-on-accent hover:brightness-110"
            >
              Build your copy
              <ArrowRight className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
            </Link>
            <a
              href={profile.resume}
              download={profile.resumeFile}
              data-magnetic
              data-cursor="PDF"
              className="stmt-wide inline-flex items-center gap-2.5 border border-rule-strong px-5 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Download /> Standard résumé
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <Link
            href="/cv"
            aria-label="Open the CV builder"
            data-cursor="Open"
            data-paper
            className="group relative mx-auto block max-w-[560px]"
          >
            <span aria-hidden="true" className="absolute -inset-3 -z-10 translate-x-4 translate-y-4 rotate-3 bg-accent-fill" />
            <div className="transition-transform duration-500 ease-out-expo group-hover:-translate-y-2">
              <div className="shadow-[0_30px_60px_-24px_var(--shadow)]">
                <PaperPreview />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
