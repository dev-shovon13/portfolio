"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Flip, gsap, MOTION_OK } from "@/lib/gsap";
import { Check } from "@/components/icons";

type Row = { id: string; partner: string; dir: "In" | "Out"; ours: number; theirs: number };
type State = "unchecked" | "matched" | "open";
type Filter = "all" | "open" | "matched";

// Synthetic: fictional partners, invented figures.
const ROWS: Row[] = [
  { id: "r1", partner: "OPR-KST", dir: "In", ours: 48210.4, theirs: 48210.4 },
  { id: "r2", partner: "OPR-NRD", dir: "Out", ours: 12904.15, theirs: 13118.9 },
  { id: "r3", partner: "OPR-LUM", dir: "In", ours: 7342.0, theirs: 7342.0 },
  { id: "r4", partner: "OPR-VSA", dir: "Out", ours: 30155.72, theirs: 30155.72 },
  { id: "r5", partner: "OPR-HAL", dir: "In", ours: 2880.36, theirs: 2601.1 },
  { id: "r6", partner: "OPR-BRE", dir: "Out", ours: 19077.08, theirs: 19077.08 },
  { id: "r7", partner: "OPR-TAU", dir: "In", ours: 5512.5, theirs: 5512.5 },
  { id: "r8", partner: "OPR-OKA", dir: "Out", ours: 9930.0, theirs: 9984.45 },
];

const money = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const delta = (r: Row) => r.theirs - r.ours;

export function ReconcileDemo() {
  const [run, setRun] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const listRef = useRef<HTMLTableSectionElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const stateOf = (r: Row): State => (!run ? "unchecked" : Math.abs(delta(r)) < 0.005 ? "matched" : "open");

  const rows = useMemo(() => {
    const list = run
      ? [...ROWS].sort((a, b) => Math.abs(delta(b)) - Math.abs(delta(a)))
      : ROWS;
    return list.filter((r) => filter === "all" || stateOf(r) === filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, filter]);

  const open = run ? ROWS.filter((r) => Math.abs(delta(r)) >= 0.005) : [];
  const exposure = open.reduce((n, r) => n + delta(r), 0);

  const change = (next: () => void) => {
    if (listRef.current && window.matchMedia(MOTION_OK).matches) {
      flipState.current = Flip.getState(listRef.current.querySelectorAll("[data-flip]"));
    }
    next();
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !listRef.current) return;
    flipState.current = null;
    Flip.from(state, {
      targets: listRef.current.querySelectorAll("[data-flip]"),
      duration: 0.7,
      ease: "power3.inOut",
      stagger: 0.03,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }),
    });
    gsap.fromTo(
      listRef.current.querySelectorAll("[data-state]"),
      { autoAlpha: 0, x: -6 },
      { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.05, delay: 0.35 },
    );
  }, [rows]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: `All ${ROWS.length}` },
    { id: "open", label: `Open ${run ? open.length : "–"}` },
    { id: "matched", label: `Matched ${run ? ROWS.length - open.length : "–"}` },
  ];

  return (
    <div className="border border-rule bg-paper-2">
      <div className="flex flex-wrap items-center gap-3 border-b border-rule px-4 py-3">
        <p className="fig mr-auto text-[11px] text-ink-2">Partner settlement · period 2026-09 · SDR</p>
        <div role="group" aria-label="Filter rows" className="fig flex text-[11px]">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              disabled={!run && f.id !== "all"}
              onClick={() => change(() => setFilter(f.id))}
              className="-ml-px border border-rule px-2.5 py-1.5 pointer-coarse:min-h-10 text-ink-2 transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 aria-pressed:border-mint/60 aria-pressed:bg-mint/10 aria-pressed:text-mint"
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          data-magnetic
          data-cursor={run ? "Reset" : "Run"}
          onClick={() =>
            change(() => {
              setRun((r) => !r);
              setFilter("all");
            })
          }
          className="stmt-wide inline-flex items-center gap-2 bg-mint px-3.5 py-2 pointer-coarse:min-h-10 text-xs font-semibold text-paper transition-colors hover:bg-mint/85"
        >
          {run ? "Reset" : "Run reconciliation"}
        </button>
      </div>

      <div className="overflow-x-auto px-4 pb-2">
        <table className="fig w-full min-w-[520px] text-left text-[11.5px]">
          <caption className="sr-only">Synthetic partner settlement records</caption>
          <thead className="text-ink-3">
            <tr className="border-b border-rule">
              <th scope="col" className="py-2.5 font-normal">Partner</th>
              <th scope="col" className="py-2.5 font-normal">Dir</th>
              <th scope="col" className="py-2.5 text-right font-normal">Our records</th>
              <th scope="col" className="py-2.5 text-right font-normal">Partner invoice</th>
              <th scope="col" className="py-2.5 text-right font-normal">Δ</th>
              <th scope="col" className="py-2.5 text-right font-normal">State</th>
            </tr>
          </thead>
          <tbody ref={listRef} className="relative">
            {rows.map((r) => {
              const s = stateOf(r);
              const d = delta(r);
              return (
                <tr key={r.id} data-flip data-flip-id={r.id} className={`border-b border-rule ${s === "open" ? "bg-sun/[0.07]" : ""}`}>
                  <td className="py-2.5 text-ink">{r.partner}</td>
                  <td className="py-2.5 text-ink-2">{r.dir}</td>
                  <td className="py-2.5 text-right text-ink-2">{money.format(r.ours)}</td>
                  <td className={`py-2.5 text-right ${s === "open" ? "text-sun" : "text-ink-2"}`}>{money.format(r.theirs)}</td>
                  <td className={`py-2.5 text-right ${s === "open" ? "text-sun" : "text-ink-3"}`}>
                    {run ? (Math.abs(d) < 0.005 ? "0.00" : `${d > 0 ? "+" : "−"}${money.format(Math.abs(d))}`) : "·"}
                  </td>
                  <td className="py-2.5 text-right">
                    <span data-state className="inline-flex items-center justify-end gap-1.5">
                      {s === "unchecked" && <span className="text-ink-3">Unchecked</span>}
                      {s === "matched" && (
                        <span className="inline-flex items-center gap-1 text-mint">
                          <Check size={12} /> Matched
                        </span>
                      )}
                      {s === "open" && <span className="text-sun">Open</span>}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="fig flex flex-wrap justify-between gap-2 border-t border-rule px-4 py-3 text-[11px]" aria-live="polite">
        {run ? (
          <>
            <span className="text-ink-2">
              {ROWS.length - open.length} of {ROWS.length} matched · <span className="text-sun">{open.length} open</span>
            </span>
            <span className="text-sun">
              Net disputed {exposure > 0 ? "+" : "−"}
              {money.format(Math.abs(exposure))} SDR
            </span>
          </>
        ) : (
          <span className="text-ink-3">{ROWS.length} records loaded · not yet reconciled</span>
        )}
      </div>
    </div>
  );
}
