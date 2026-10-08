import Link from "next/link";
import { caseStudies } from "@/content/work";
import { SectionHead } from "@/components/ledger/SectionHead";
import { illustrationFor } from "@/components/work/Illustrations";
import { ArrowRight } from "@/components/icons";

export function CaseStudies() {
  const shown = caseStudies.filter((c) => !c.withheld);
  const withheld = caseStudies.filter((c) => c.withheld);

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      data-accent="sun"
      className="mx-auto max-w-[1320px] scroll-mt-0 lg:-scroll-mt-6 px-4 py-20 sm:px-8 lg:py-28"
      data-ledger
    >
      <SectionHead id="work-title" title="Selected work" meta="Client work under NDA · shown as recreations" />

      <div className="flex flex-col">
        {shown.map((study, i) => {
          const Illustration = illustrationFor[study.slug];
          return (
            <article
              key={study.slug}
              className={`grid items-center gap-8 border-b border-rule py-12 first:pt-2 grid-cols-1 lg:grid-cols-12 lg:gap-12 lg:py-16 ${
                i === 0 ? "lg:py-20" : ""
              }`}
              data-ledger
            >
              <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2" : ""}`}>
                <h3 className="text-[clamp(1.6rem,2.8vw,2.2rem)] leading-[1.1] font-semibold tracking-[-0.02em] text-ink" data-line>
                  {study.title}
                </h3>
                <p className="mt-4 max-w-[52ch] text-ink-2" data-line>
                  {study.oneLine}
                </p>
                <p className="fig mt-5 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-ink-3" data-line>
                  <span className="text-accent">{study.code}</span>
                  <span>{study.client}</span>
                  <span>{study.period}</span>
                </p>
                <Link
                  href={`/work/${study.slug}`}
                  data-cursor="Read"
                  className="group mt-7 inline-flex items-center gap-2 pointer-coarse:min-h-10 border-b border-accent/50 pb-1 text-sm font-medium text-accent transition-colors hover:border-accent"
                  data-line
                >
                  Read the case
                  <span className="sr-only">: {study.title}</span>
                  <ArrowRight className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1" />
                </Link>
              </div>
              <div className={`lg:col-span-7 ${i % 2 ? "lg:order-1" : ""}`}>
                <Illustration />
              </div>
            </article>
          );
        })}

        {withheld.map((study) => (
          <article key={study.slug} className="grid gap-6 py-12 grid-cols-1 lg:grid-cols-12 lg:gap-12" data-ledger>
            <div className="lg:col-span-5">
              <h3 className="text-[clamp(1.4rem,2.2vw,1.75rem)] leading-[1.15] font-semibold text-ink" data-line>
                {study.title}
              </h3>
              <p className="mt-3 max-w-[52ch] text-ink-2" data-line>
                {study.oneLine} The rest stays with the client.
              </p>
              <p className="fig mt-4 flex gap-3 text-[11px] text-ink-3" data-line>
                <span className="text-sun">{study.code}</span>
                <span>Client withheld · Penta Global · 2023 – present</span>
              </p>
            </div>
            <div className="lg:col-span-7" data-line>
              {illustrationFor[study.slug]()}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
