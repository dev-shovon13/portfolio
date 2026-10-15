import { experience } from "@/content/profile";
import { SectionHead } from "@/components/ledger/SectionHead";
import { ArrowUpRight } from "@/components/icons";

export function LineItems() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      data-accent="sky"
      className="mx-auto max-w-[1320px] scroll-mt-0 lg:-scroll-mt-6 px-4 py-20 sm:px-8 lg:py-28"
      data-ledger
    >
      <SectionHead id="experience-title" title="Line items" meta="3 employers · 7 engagements · Dec 2021 → present" />

      <div className="flex flex-col gap-16 sm:gap-20">
        {experience.map((role) => (
          <article key={role.company} className="grid gap-6 grid-cols-1 lg:grid-cols-12 lg:gap-10" data-ledger>
            <header className="self-start lg:sticky lg:top-24 lg:col-span-4">
              <h3 className="stmt text-[clamp(1.9rem,3.6vw,2.6rem)] font-bold text-ink" data-scramble>
                {role.company}
              </h3>
              <p className="mt-2 text-ink-2" data-line>
                {role.title}
              </p>
              <p className="mt-1 text-sm text-ink-3" data-line>
                {role.location}
              </p>
              <p className="fig mt-4 text-xs text-accent" data-line>
                {role.period}
              </p>
              {role.note ? (
                <p className="mt-5 max-w-[34ch] border-l border-rule-strong pl-3 text-sm leading-relaxed text-ink-2" data-line>
                  {role.note.includes("mentor junior developers") ? (
                    <>
                      {role.note.split("mentor junior developers")[0]}
                      <span className="mark" data-mark>
                        mentor junior developers
                      </span>
                      {role.note.split("mentor junior developers")[1]}
                    </>
                  ) : (
                    role.note
                  )}
                </p>
              ) : null}
            </header>

            <div className="relative lg:col-span-8" data-fill-track>
              <div className="rule bg-rule-strong" data-draw />
              <span aria-hidden="true" className="absolute top-0 bottom-0 -left-5 hidden w-px bg-rule lg:block">
                <span data-fill className="absolute inset-0 origin-top bg-accent-fill" />
              </span>
              <ol>
              {role.entries.map((entry) => (
                <li
                  key={entry.code}
                  className="group/entry relative isolate grid grid-cols-[3.25rem_1fr] gap-x-4 border-b border-rule py-5 sm:grid-cols-[4rem_1fr]"
                  data-line
                >
                  {/* Hover: an accent wash sweeps in from the left behind the row. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 right-0 -left-3 -z-10 origin-left scale-x-0 bg-gradient-to-r from-accent/[0.09] via-accent/[0.04] to-transparent transition-transform duration-500 ease-out-expo group-hover/entry:scale-x-100 motion-reduce:transition-none sm:-left-4"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute top-0 -left-3 h-px w-0 bg-accent-fill transition-[width] duration-500 ease-out-expo group-hover/entry:w-[calc(100%+0.75rem)] motion-reduce:transition-none sm:-left-4 sm:group-hover/entry:w-[calc(100%+1rem)]"
                  />
                  <span className="fig pt-1 text-xs text-ink-3 transition-colors duration-300 group-hover/entry:text-accent" data-scramble>
                    {entry.code}
                  </span>
                  <div className="transition-transform duration-500 ease-out-expo group-hover/entry:translate-x-1.5 motion-reduce:transition-none">
                    <h4 className="flex flex-wrap items-baseline gap-x-3 text-lg leading-snug font-medium text-ink">
                      {entry.name}
                      {entry.tag ? <span className="fig text-[11px] font-normal text-ink-3">{entry.tag}</span> : null}
                      {entry.link ? (
                        <a
                          href={entry.link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="fig inline-flex items-center gap-1 text-[11px] font-normal text-accent hover:underline pointer-coarse:min-h-10"
                        >
                          {entry.link.label} <ArrowUpRight size={12} />
                          <span className="sr-only">(opens in new tab)</span>
                        </a>
                      ) : null}
                    </h4>
                    <ul className="mt-2.5 flex max-w-[68ch] flex-col gap-2 text-[15px] leading-relaxed text-ink-2 transition-colors duration-300 group-hover/entry:text-ink">
                      {entry.lines.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
              </ol>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
