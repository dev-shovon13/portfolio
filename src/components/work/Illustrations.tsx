import type { ReactNode } from "react";
import { Check } from "@/components/icons";

/** Frame for a recreated interface. Always carries the synthetic-data label. */
export function RecreationFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="relative overflow-hidden border border-rule bg-paper-2 shadow-[0_24px_48px_-28px_var(--shadow)]" data-ledger data-rise>
      <span
        aria-hidden="true"
        data-sheen
        className="pointer-events-none absolute inset-y-0 -left-1/3 z-10 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.07] to-transparent opacity-0"
      />
      <div className="flex items-center justify-between gap-4 border-b border-rule px-4 py-2.5">
        <span className="fig truncate text-[11px] text-ink-2">{title}</span>
        <span className="fig shrink-0 text-[10px] text-ink-3">Recreation</span>
      </div>
      <div className="overflow-hidden p-4 sm:p-5">{children}</div>
      <figcaption className="fig border-t border-rule px-4 py-2 text-[10px] text-ink-3">
        Illustrative recreation · synthetic data · not the production system
      </figcaption>
    </figure>
  );
}

const settlement = [
  { partner: "OPR-KST", dir: "In", expected: "48,210.40", invoiced: "48,210.40", ok: true },
  { partner: "OPR-NRD", dir: "Out", expected: "12,904.15", invoiced: "13,118.90", ok: false },
  { partner: "OPR-LUM", dir: "In", expected: "7,342.00", invoiced: "7,342.00", ok: true },
  { partner: "OPR-VSA", dir: "Out", expected: "30,155.72", invoiced: "30,155.72", ok: true },
  { partner: "OPR-HAL", dir: "In", expected: "2,880.36", invoiced: "2,601.10", ok: false },
];

export function SettlementIllustration() {
  return (
    <RecreationFrame title="Reconciliation · period 2026-09 · SDR">
      <div className="fig mb-4 flex flex-wrap gap-2 text-[10px]">
        {["Period: Sep", "Direction: All", "Currency: SDR"].map((f) => (
          <span key={f} className="border border-rule px-2 py-1 text-ink-2">
            {f}
          </span>
        ))}
        <span className="ml-auto border border-sun/60 px-2 py-1 text-sun">2 open</span>
      </div>
      <table className="fig w-full text-left text-[10.5px] sm:text-[11px]">
        <thead className="text-ink-3">
          <tr className="border-b border-rule">
            <th className="py-2 font-normal">Partner</th>
            <th className="hidden py-2 font-normal sm:table-cell">Dir</th>
            <th className="py-2 text-right font-normal">Expected</th>
            <th className="py-2 text-right font-normal">Invoiced</th>
            <th className="py-2 text-right font-normal">State</th>
          </tr>
        </thead>
        <tbody className="text-ink-2">
          {settlement.map((r) => (
            <tr key={r.partner} className={`border-b border-rule ${r.ok ? "" : "bg-sun/[0.06]"}`} data-line>
              <td className="py-2 text-ink">{r.partner}</td>
              <td className="hidden py-2 sm:table-cell">{r.dir}</td>
              <td className="py-2 text-right">{r.expected}</td>
              <td className={`py-2 text-right ${r.ok ? "" : "text-sun"}`}>{r.invoiced}</td>
              <td className="py-2 text-right">
                {r.ok ? (
                  <span className="inline-flex items-center gap-1 text-mint">
                    <Check size={11} /> OK
                  </span>
                ) : (
                  <span className="text-sun">Δ</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </RecreationFrame>
  );
}

const stages = ["Received", "Review", "Assigned", "In progress", "Closed"];
const files = [
  { ref: "WF-2026-0412", stage: 3, owner: "Unit 4" },
  { ref: "WF-2026-0398", stage: 1, owner: "Unit 2" },
  { ref: "WF-2026-0371", stage: 4, owner: "Unit 1" },
  { ref: "WF-2026-0355", stage: 2, owner: "Unit 4" },
];

export function WorkflowIllustration() {
  return (
    <RecreationFrame title="Workflow · records in progress">
      <ol className="fig mb-5 grid grid-cols-5 gap-1 text-[9.5px] text-ink-3 sm:text-[10px]">
        {stages.map((s, i) => (
          <li key={s} className={`border-t-2 pt-1.5 ${i <= 2 ? "border-mint text-ink-2" : "border-rule-strong"}`}>
            {s}
          </li>
        ))}
      </ol>
      <ul className="flex flex-col">
        {files.map((f) => (
          <li key={f.ref} className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-rule py-2.5" data-line>
            <div>
              <p className="fig text-[11px] text-ink">{f.ref}</p>
              <p className="text-xs text-ink-3">{f.owner}</p>
            </div>
            <div className="flex gap-1" aria-label={`Stage ${f.stage + 1} of 5`}>
              {stages.map((s, i) => (
                <span key={s} className={`h-1.5 w-5 sm:w-7 ${i <= f.stage ? "bg-mint/80" : "bg-rule"}`} />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </RecreationFrame>
  );
}

const districts = [
  { name: "District A", centres: 412, staffed: 412 },
  { name: "District B", centres: 286, staffed: 279 },
  { name: "District C", centres: 530, staffed: 530 },
  { name: "District D", centres: 198, staffed: 191 },
];

export function ReadinessIllustration() {
  return (
    <RecreationFrame title="Readiness · polling centres">
      <table className="fig w-full text-left text-[10.5px] sm:text-[11px]">
        <thead className="text-ink-3">
          <tr className="border-b border-rule">
            <th className="py-2 font-normal">Area</th>
            <th className="py-2 text-right font-normal">Centres</th>
            <th className="py-2 text-right font-normal">Staffed</th>
            <th className="py-2 text-right font-normal">State</th>
          </tr>
        </thead>
        <tbody className="text-ink-2">
          {districts.map((d) => {
            const done = d.centres === d.staffed;
            return (
              <tr key={d.name} className="border-b border-rule" data-line>
                <td className="py-2.5 text-ink">{d.name}</td>
                <td className="py-2.5 text-right">{d.centres}</td>
                <td className="py-2.5 text-right">{d.staffed}</td>
                <td className={`py-2.5 text-right ${done ? "text-mint" : "text-sun"}`}>
                  {done ? "Ready" : `${d.centres - d.staffed} left`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </RecreationFrame>
  );
}

/** For work that can't be shown at all. */
export function Redacted() {
  const bars = ["w-11/12", "w-8/12", "w-10/12", "w-6/12", "w-9/12"];
  return (
    <div className="flex flex-col gap-2.5 border border-rule p-5" aria-label="Details withheld under NDA" role="img">
      {bars.map((w, i) => (
        <span key={i} className={`h-3 ${w} origin-left bg-ink/85`} data-draw />
      ))}
      <span className="fig mt-2 text-[10px] text-ink-3">Withheld at the client&apos;s request</span>
    </div>
  );
}

export const illustrationFor: Record<string, () => ReactNode> = {
  neustring: SettlementIllustration,
  "acc-erp": WorkflowIllustration,
  election: ReadinessIllustration,
  "intel-platform": Redacted,
};
