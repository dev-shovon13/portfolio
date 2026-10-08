import type { CvModel } from "@/content/cv";

/** The HTML twin of CvPdf: same model, same single-column layout, on an A4 sheet (794px wide at 96dpi). */
export function CvSheet({ cv }: { cv: CvModel }) {
  return (
    <article className="w-[794px] bg-[#fbfaf7] px-[59px] pt-[48px] pb-[56px] font-[Helvetica,Arial,sans-serif] text-[12.6px] leading-[1.38] text-[#111]">
      <h1 className="text-center text-[24px] font-bold tracking-[0.02em] text-[#1b2a4a]">{cv.name.toUpperCase()}</h1>
      <p className="mt-0.5 text-center text-[14px]">{cv.headline}</p>
      {cv.contacts.length ? (
        <p className="mt-1 text-center text-[11.3px] text-[#333]">
          {cv.contacts.map((c, i) => (
            <span key={c.label}>
              {i ? "  |  " : ""}
              {c.href ? <span className="text-[#1a56b8]">{c.value}</span> : c.value}
            </span>
          ))}
        </p>
      ) : null}

      {cv.sections.map((sec) => (
        <section key={sec.title} className="mt-[13px]">
          <h2 className="mb-[5px] border-b border-[#1b2a4a] pb-[2px] text-[13.3px] font-bold text-[#1b2a4a] uppercase">{sec.title}</h2>
          {sec.kind === "text" ? <p>{sec.text}</p> : null}
          {sec.kind === "pairs"
            ? sec.pairs.map((p) => (
                <p key={p.label}>
                  <b>{p.label}:</b> {p.text}
                </p>
              ))
            : null}
          {sec.kind === "entries"
            ? sec.entries.map((e, i) => (
                <div key={e.heading} className={i ? "mt-[7px]" : undefined}>
                  <div className="flex justify-between gap-4 font-bold">
                    <span>{e.heading}</span>
                    {e.right ? <span className="shrink-0">{e.right}</span> : null}
                  </div>
                  {e.sub ? <p className="text-[11.7px] text-[#555] italic">{e.sub}</p> : null}
                  {e.groups.map((g, j) => (
                    <div key={j}>
                      {g.name ? (
                        <p className="mt-[4px] font-bold text-[#2b4a8a]">
                          {g.name}
                          {g.tag ? <span className="font-normal text-[#555] italic">{`  |  ${g.tag}`}</span> : null}
                        </p>
                      ) : null}
                      <ul className="mt-px">
                        {g.bullets.map((b) => (
                          <li key={b} className="flex pl-[11px]">
                            <span className="w-[12px] shrink-0">•</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))
            : null}
        </section>
      ))}
    </article>
  );
}
