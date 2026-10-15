"use client";

import { useRef } from "react";
import { gsap, Flip, useGSAP, MOTION_OK } from "@/lib/gsap";
import { ledgerItems } from "@/content/profile";
import { Check } from "@/components/icons";

// Order rows appear in before they reconcile.
const PENDING_ORDER = [5, 2, 7, 0, 4, 1, 6, 3];

/** The work ledger: eight shipped items arrive pending, re-sort, and reconcile as the section scrolls in. */
export function Reconcile() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const q = gsap.utils.selector(root);
        const rows = q<HTMLElement>("[data-row]");
        const count = q("[data-count]")[0];
        const counter = { n: 0 };

        rows.forEach((row, i) => (row.style.order = String(PENDING_ORDER.indexOf(i))));
        gsap.set(q("[data-status-matched]"), { autoAlpha: 0 });
        gsap.set(q("[data-status-pending]"), { autoAlpha: 1 });
        gsap.set(q("[data-total-state]"), { autoAlpha: 0 });
        gsap.set(q("[data-stamp]"), { autoAlpha: 0 });
        if (count) count.textContent = "0";

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: q("[data-board]")[0], start: "top 72%", toggleActions: "play none none none" },
        });
        tl.from(q("[data-board-rule]"), { scaleX: 0, duration: 1.1, stagger: 0.05 }, 0)
          .from(rows, { autoAlpha: 0, x: 28, duration: 0.7, stagger: 0.05 }, 0.2)
          .add(() => {
            const state = Flip.getState(rows);
            rows.forEach((row) => (row.style.order = ""));
            Flip.from(state, { duration: 0.9, ease: "power3.inOut", stagger: 0.02 });
          }, 1.05);

        rows.forEach((row, i) => {
          const at = 1.85 + i * 0.09;
          tl.to(row.querySelector("[data-status-pending]"), { autoAlpha: 0, duration: 0.2 }, at)
            .fromTo(row.querySelector("[data-status-matched]"), { autoAlpha: 0, x: -6 }, { autoAlpha: 1, x: 0, duration: 0.45 }, at + 0.05)
            .fromTo(
              row,
              { backgroundColor: "rgba(98,249,213,0.10)" },
              { backgroundColor: "rgba(98,249,213,0)", duration: 0.9, immediateRender: false },
              at,
            );
        });

        tl.to(
          counter,
          {
            n: rows.length,
            duration: rows.length * 0.09,
            ease: "none",
            onUpdate: () => {
              if (count) count.textContent = String(Math.round(counter.n));
            },
          },
          1.9,
        )
          .to(q("[data-total-state]"), { autoAlpha: 1, duration: 0.4 }, ">-0.1")
          .fromTo(
            q("[data-stamp]"),
            { autoAlpha: 0, scale: 1.7, rotate: -14 },
            { autoAlpha: 1, scale: 1, rotate: -7, duration: 0.55, ease: "back.out(2.2)" },
            ">-0.05",
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="reconcile-title"
      data-accent="mint"
      className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 overflow-x-clip px-4 py-20 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:py-28"
      data-ledger
    >
      <div className="lg:col-span-4">
        <h2 id="reconcile-title" className="stmt text-[clamp(2.4rem,5vw,3.75rem)] font-semibold text-ink" data-split>
          Every brief, <span className="text-accent">shipped.</span>
        </h2>
        <p className="mt-5 max-w-[38ch] text-ink-2" data-line>
          Eight pieces of work across three employers since December 2021, from{" "}
          <span className="mark" data-mark>
            roaming settlement
          </span>{" "}
          to a{" "}
          <span className="mark" data-mark>
            national election
          </span>
          .
        </p>
      </div>

      <figure aria-labelledby="board-caption" className="relative lg:col-span-8" data-board>
        <figcaption id="board-caption" className="flex items-end justify-between gap-4 pb-3">
          <span className="stmt-wide text-sm font-semibold text-ink">Work reconciliation</span>
          <span className="fig text-[11px] text-ink-3">Dec 2021 → present</span>
        </figcaption>

        <div className="rule bg-accent-fill" data-board-rule />

        <div
          aria-hidden="true"
          className="fig grid grid-cols-[3.25rem_1fr_6.5rem] items-center gap-x-3 py-2.5 text-[10px] tracking-wide text-ink-3 uppercase sm:grid-cols-[3.75rem_1fr_4.5rem_7rem]"
        >
          <span>Code</span>
          <span>Item · shipped for</span>
          <span className="hidden sm:block">Period</span>
          <span className="text-right">Status</span>
        </div>
        <div className="rule" data-board-rule />

        <ol className="flex flex-col" aria-label="Reconciled work items">
          {ledgerItems.map((row) => (
            <li
              key={row.code}
              data-row
              className="grid grid-cols-[3.25rem_1fr_6.5rem] items-center gap-x-3 border-b border-rule py-3 transition-colors hover:bg-ink/[0.03] sm:grid-cols-[3.75rem_1fr_4.5rem_7rem]"
            >
              <span className="fig text-xs text-ink-3">{row.code}</span>
              <span className="min-w-0">
                <span className="block text-[15px] leading-tight text-ink sm:truncate sm:text-base">{row.item}</span>
                <span className="block truncate text-xs text-ink-3">{row.client}</span>
              </span>
              <span className="fig hidden text-xs text-ink-2 sm:block">{row.period}</span>
              <span className="fig grid justify-items-end text-[11px] uppercase">
                <span data-status-pending className="invisible col-start-1 row-start-1 inline-flex items-center gap-1.5 text-sun">
                  <span className="size-1.5 rounded-full bg-sun" aria-hidden="true" />
                  Pending
                </span>
                <span data-status-matched className="col-start-1 row-start-1 inline-flex items-center gap-1.5 text-mint">
                  <Check size={13} />
                  Matched
                </span>
              </span>
            </li>
          ))}
        </ol>

        <div className="grid grid-cols-[3.25rem_1fr_auto] items-baseline gap-x-3 pt-4 sm:grid-cols-[3.75rem_1fr_auto]">
          <span className="stmt-wide text-xs font-semibold text-ink-2">Total</span>
          <span className="fig text-xs text-ink-2">
            <span data-count>{ledgerItems.length}</span> / {ledgerItems.length} reconciled
            <span data-total-state> · 0 open</span>
          </span>
          <span className="fig text-sm text-mint" data-total-state>
            Balanced
          </span>
        </div>
        <div className="rule mt-4 bg-rule-strong" data-board-rule />
        <div className="rule mt-[3px] bg-rule-strong" data-board-rule />

        <div
          data-stamp
          aria-hidden="true"
          className="pointer-events-none absolute right-2 -bottom-9 -rotate-[7deg] border-2 border-mint bg-paper px-3 py-1.5 text-mint shadow-[0_8px_24px_-12px_rgba(98,249,213,0.5)] outline-1 outline-offset-2 outline-mint/60 outline-solid sm:right-24 sm:-bottom-11"
        >
          <span className="stmt block text-2xl font-semibold tracking-wide uppercase sm:text-3xl">Reconciled</span>
          <span className="fig block text-center text-[9px] tracking-[0.2em] uppercase">K.A. Shovon · DAC</span>
        </div>
      </figure>
    </section>
  );
}
