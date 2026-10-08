import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/content/work";
import { SiteHeader } from "@/components/SiteHeader";
import { Choreography } from "@/components/Choreography";
import { illustrationFor } from "@/components/work/Illustrations";
import { ReconcileDemo } from "@/components/demo/ReconcileDemo";
import { ArrowLeft, ArrowRight } from "@/components/icons";

const published = caseStudies.filter((c) => !c.withheld);

// Only the published case studies exist; anything else is a static 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return published.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study || study.withheld) return {};
  return { title: study.title, description: study.oneLine };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study || study.withheld) notFound();

  const index = published.findIndex((c) => c.slug === study.slug);
  const next = published[(index + 1) % published.length];
  const Illustration = illustrationFor[study.slug];

  const meta = [
    ["Ref", study.code],
    ["Client", study.client],
    ["Role", study.role],
    ["Period", study.period],
    ["Team", study.team],
    ["Stack", study.stack.join(" · ")],
  ];

  return (
    <>
      <SiteHeader />
      <main id="main" data-accent="sun" className="mx-auto max-w-[1320px] px-4 pt-10 pb-24 sm:px-8 lg:pt-16">
        <Link href="/#work" className="fig inline-flex items-center gap-2 text-[11px] text-ink-3 hover:text-accent pointer-coarse:min-h-10">
          <ArrowLeft size={13} /> All work
        </Link>

        <header className="mt-10 grid gap-10 grid-cols-1 lg:grid-cols-12" data-ledger>
          <div className="lg:col-span-8">
            <h1 className="stmt text-[clamp(2.8rem,7vw,5.5rem)] font-semibold text-ink" data-line>
              {study.title}
            </h1>
            <p className="mt-6 max-w-[56ch] text-xl leading-snug text-ink-2" data-line>
              {study.oneLine}
            </p>
          </div>
          <dl className="self-end lg:col-span-4">
            {meta.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[5rem_1fr] gap-x-4 border-t border-rule py-2.5 last:border-b" data-line>
                <dt className="fig pt-0.5 text-[11px] text-ink-3">{label}</dt>
                <dd className="text-sm text-ink-2">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="mt-16 lg:mt-24" data-ledger>
          <div data-line>{study.slug === "neustring" ? <ReconcileDemo /> : <Illustration />}</div>
          {study.slug === "neustring" ? (
            <p className="fig mt-3 text-[10.5px] text-ink-3">
              Try it: run the reconciliation, then filter. Illustrative recreation on synthetic data; not the production
              system.
            </p>
          ) : null}
        </div>

        <article className="mt-20 lg:mt-28">
          {study.sections.map((section) => (
            <section key={section.heading} className="grid gap-4 border-t border-rule py-10 grid-cols-1 lg:grid-cols-12 lg:gap-10" data-ledger>
              <h2 className="stmt-wide text-sm font-semibold text-ink lg:col-span-4" data-line>
                {section.heading}
              </h2>
              <div className="flex max-w-[66ch] flex-col gap-4 text-lg leading-relaxed text-ink-2 lg:col-span-8" data-line>
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        {next && next.slug !== study.slug ? (
          <nav aria-label="Next case study" className="mt-10 border-t-2 border-double border-rule-strong pt-8">
            <Link href={`/work/${next.slug}`} data-cursor="Next" className="group flex py-2 flex-wrap items-baseline justify-between gap-4">
              <span className="fig text-[11px] text-ink-3">Next case</span>
              <span className="stmt flex items-center gap-4 text-[clamp(1.8rem,4vw,3rem)] font-bold text-ink transition-colors group-hover:text-accent">
                {next.title}
                <ArrowRight size={28} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-2" />
              </span>
            </Link>
          </nav>
        ) : null}
      </main>
      <Choreography />
    </>
  );
}
