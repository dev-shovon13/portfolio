import { toolkit } from "@/content/profile";
import { SectionHead } from "@/components/ledger/SectionHead";

export function Toolkit() {
  const total = toolkit.reduce((n, a) => n + a.entries.length, 0);

  return (
    <section
      id="toolkit"
      aria-labelledby="toolkit-title"
      data-accent="mint"
      className="mx-auto max-w-[1320px] scroll-mt-0 lg:-scroll-mt-6 px-4 py-20 sm:px-8 lg:py-28"
      data-ledger
    >
      <SectionHead id="toolkit-title" title="Toolkit" meta={`${toolkit.length} accounts · ${total} entries`} />

      <ul>
        {toolkit.map((account) => (
          <li
            key={account.code}
            className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-rule py-5 sm:grid-cols-[4.5rem_12rem_1fr_3rem] sm:items-baseline"
            data-line
          >
            <span className="fig text-xs text-ink-3" data-scramble>
              {account.code}
            </span>
            <h3 className="stmt-wide text-sm font-semibold text-ink">{account.account}</h3>
            <p className="col-start-2 text-[15px] leading-relaxed text-ink-2 sm:col-start-3">
              {account.entries.map((entry, i) => (
                <span key={entry}>
                  <span className="whitespace-nowrap">{entry}</span>
                  {i < account.entries.length - 1 ? (
                    <>
                      {" "}
                      <span className="px-1 text-rule-strong" aria-hidden="true">
                        /
                      </span>{" "}
                    </>
                  ) : null}
                </span>
              ))}
            </p>
            <span className="fig hidden text-right text-xs text-ink-3 sm:block" aria-hidden="true">
              {String(account.entries.length).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
