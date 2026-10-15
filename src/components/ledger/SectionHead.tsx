import type { ReactNode } from "react";

/** A statement header: condensed title, data on the right, a drawn double rule beneath. */
export function SectionHead({ id, title, meta }: { id: string; title: string; meta?: ReactNode }) {
  // The last word takes the section's accent colour.
  const words = title.split(" ");
  const last = words.pop();
  const lead = words.join(" ");
  return (
    <div className="mb-10 sm:mb-14">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 pb-4">
        <h2 id={id} className="stmt text-[clamp(2.6rem,7vw,4.75rem)] font-semibold text-ink" data-split>
          {lead}
          {lead ? " " : null}
          <span className="accent-word text-accent">{last}</span>
        </h2>
        {meta ? (
          <p className="fig flex items-center gap-2 pb-1.5 text-[11px] text-ink-3" data-line>
            <span aria-hidden="true" className="blink inline-block h-3 w-1.5 bg-accent-fill" />
            {meta}
          </p>
        ) : null}
      </div>
      <div className="rule bg-accent-fill" data-draw />
      <div className="rule mt-[3px] bg-rule-strong" data-draw />
    </div>
  );
}
