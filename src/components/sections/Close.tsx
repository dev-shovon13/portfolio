import { profile } from "@/content/profile";
import { CopyEmail } from "@/components/CopyEmail";
import { ArrowUpRight, Download } from "@/components/icons";

export function Close() {
  const links = [
    { label: "LinkedIn", href: profile.links.linkedin },
    { label: "GitHub", href: profile.links.github },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-0 lg:-scroll-mt-6 border-t border-rule bg-night text-ink" data-accent="sky" data-ledger>
      <div className="mx-auto max-w-[1320px] px-4 pt-20 pb-10 sm:px-8 lg:pt-28">
        <div className="flex flex-wrap items-end justify-between gap-4 pb-4">
          <h2 id="contact-title" className="stmt text-[clamp(3rem,9vw,6rem)] font-semibold" data-tighten>
            Closing <span className="text-accent">balance</span>
          </h2>
          <p className="fig pb-2 text-[11px] text-ink-3" data-line>
            Dhaka · GMT+6
          </p>
        </div>
        <div className="rule bg-accent" data-draw />
        <div className="rule mt-[3px] bg-accent" data-draw />

        <div className="grid gap-12 pt-12 grid-cols-1 lg:grid-cols-12 lg:gap-10">
          <p className="text-[clamp(1.35rem,2.6vw,2rem)] leading-tight font-light tracking-[-0.015em] text-ink-2 lg:col-span-6" data-line>
            Hiring a software engineer, or have a data-heavy product that needs to be right? <span className="mark text-ink" data-mark>
              Write to me.
            </span>
          </p>

          <div className="lg:col-span-6" data-line>
            <CopyEmail email={profile.email} />
            <ul className="mt-8 flex flex-wrap gap-3">
              <li>
                <a
                  href={profile.resume}
                  download={profile.resumeFile}
                  data-magnetic
                  data-cursor="PDF"
                  className="stmt-wide inline-flex items-center gap-2 bg-accent px-4 py-2.5 text-sm font-semibold text-paper transition-[filter] hover:brightness-110"
                >
                  <Download size={14} /> Résumé (PDF)
                </a>
              </li>
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    data-magnetic
                    data-cursor="Open"
                    className="stmt-wide inline-flex items-center gap-2 border border-rule-strong px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-accent hover:text-accent"
                  >
                    {l.label} <ArrowUpRight size={14} />
                    <span className="sr-only">(opens in new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <footer className="fig mt-24 flex flex-wrap justify-between gap-3 border-t border-rule pt-5 text-[10.5px] text-ink-3">
          <span>© 2026 {profile.name}</span>
          <span>Built with Next.js, Tailwind CSS &amp; GSAP · Dhaka</span>
          <span>End of statement</span>
        </footer>
      </div>
    </section>
  );
}
