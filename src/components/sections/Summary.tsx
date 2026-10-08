import { profile } from "@/content/profile";
import { Highlight } from "@/components/Highlight";

const facts = [
  ["Experience", "5+ years, since Dec 2021"],
  ["Employers", "Penta Global · BYSL Global · TechHack Canada"],
  ["Domains", "Telecom settlement · Government · Enterprise ERP"],
  ["Backend", "Node.js · Express · MongoDB REST APIs (personal projects)"],
  ["Education", `${profile.education.degree}, ${profile.education.school}`],
  ["Languages", profile.languages],
];

export function Summary() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      data-accent="sky"
      className="mx-auto max-w-[1320px] scroll-mt-0 lg:-scroll-mt-6 px-4 py-20 sm:px-8 lg:py-28"
      data-ledger
    >
      <h2 id="about-title" className="stmt text-[clamp(2.6rem,7vw,4.75rem)] font-semibold text-ink" data-split>
        Hello, I&apos;m <span className="text-accent">Kawser.</span>
      </h2>
      <div className="rule mt-5 bg-accent" data-draw />

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
        <p
          className="text-[clamp(1.35rem,2.6vw,2.1rem)] leading-[1.26] font-light tracking-[-0.012em] text-ink lg:col-span-8"
          data-ink
        >
          <Highlight
            text={profile.summary}
            phrases={["can't afford to be wrong", "own modules end to end", "REST APIs in Node.js and Express"]}
          />
        </p>

        <dl className="self-end lg:col-span-4">
          {facts.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-x-4 border-t border-rule py-3 last:border-b" data-line>
              <dt className="fig pt-0.5 text-[11px] text-ink-3">{label}</dt>
              <dd className="text-sm leading-snug text-ink-2">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
