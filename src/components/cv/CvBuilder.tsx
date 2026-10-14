"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  buildCv,
  cvContacts,
  cvDefaultOff,
  cvEducation,
  cvExperience,
  cvHeadline,
  cvProjects,
  cvSections,
  cvSkills,
  cvSummary,
  cvToText,
} from "@/content/cv";
import { CvSheet } from "@/components/cv/CvSheet";
import { Check, Copy, Download } from "@/components/icons";

const STORE = "kas-cv-builder-v1";
const FILE = "Kawser_Ahmed_Shovon_Resume";
const A4_HEIGHT = 1123;

const ALL_IDS = [
  ...cvContacts.map((c) => c.id),
  ...cvSections.map((s) => s.id),
  ...cvSkills.map((s) => s.id),
  ...cvExperience.flatMap((r) => [r.id, ...r.groups.flatMap((g) => [g.id, ...g.bullets.map((b) => b.id)])]),
  ...cvProjects.flatMap((p) => [p.id, ...p.bullets.map((b) => b.id)]),
  cvEducation.cgpa.id,
];

type Saved = { off: string[]; headline: string; summary: string };

function load(): Saved {
  try {
    const raw = window.localStorage.getItem(STORE);
    if (raw) return JSON.parse(raw) as Saved;
  } catch {
    // Private mode or blocked storage: start from defaults.
  }
  return { off: cvDefaultOff, headline: cvHeadline, summary: cvSummary };
}

export default function CvBuilder() {
  const [initial] = useState(load);
  const [off, setOff] = useState(() => new Set(initial.off));
  const [headline, setHeadline] = useState(initial.headline);
  const [summary, setSummary] = useState(initial.summary);
  const [status, setStatus] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORE, JSON.stringify({ off: [...off], headline, summary }));
    } catch {
      // Not persisting is fine.
    }
  }, [off, headline, summary]);

  const cv = useMemo(() => buildCv(off, headline, summary), [off, headline, summary]);
  const on = (id: string) => !off.has(id);
  const toggle = (id: string) =>
    setOff((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const flash = (msg: string) => {
    setStatus(msg);
    window.setTimeout(() => setStatus(""), 2400);
  };

  const save = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(cvToText(cv));
      flash("Copied as plain text");
    } catch {
      flash("Couldn't copy. Try the .TXT download.");
    }
  };

  const downloadTxt = () => {
    save(new Blob([cvToText(cv)], { type: "text/plain;charset=utf-8" }), `${FILE}.txt`);
    flash("Saved .txt");
  };

  const [making, setMaking] = useState(false);
  const downloadPdf = async () => {
    setMaking(true);
    try {
      const [{ pdf }, { CvPdf }] = await Promise.all([import("@react-pdf/renderer"), import("@/components/cv/CvPdf")]);
      save(await pdf(<CvPdf cv={cv} />).toBlob(), `${FILE}.pdf`);
      flash("Saved PDF");
    } catch {
      flash("Couldn't build the PDF. Please try again.");
    } finally {
      setMaking(false);
    }
  };

  const tool =
    "fig inline-flex h-9 items-center gap-2 pointer-coarse:h-10 border border-rule-strong px-3 text-[11px] tracking-wide text-ink uppercase transition-colors hover:border-accent hover:text-accent";

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
      {/* Choices */}
      <div className="lg:col-span-5">
        <Group title="Header">
          <label className="block">
            <span className="fig text-[11px] text-ink-3">Headline</span>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="mt-1.5 w-full border border-rule-strong bg-paper-2 px-3 py-2 text-sm text-ink outline-none focus:border-accent"
            />
          </label>
          {cvContacts.map((c) => (
            <Box key={c.id} checked={on(c.id)} onChange={() => toggle(c.id)} label={c.label} detail={c.value} />
          ))}
        </Group>

        <Group title="Sections">
          <Box checked={on("sec-summary")} onChange={() => toggle("sec-summary")} label="Summary" />
          {on("sec-summary") ? (
            <div className="ml-7">
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={6}
                aria-label="Summary text"
                className="w-full resize-y border border-rule-strong bg-paper-2 px-3 py-2.5 text-sm leading-relaxed text-ink outline-none focus:border-accent"
              />
              {summary !== cvSummary ? (
                <button type="button" onClick={() => setSummary(cvSummary)} className="fig mt-1 inline-flex items-center text-[11px] text-ink-3 hover:text-accent pointer-coarse:min-h-10">
                  Reset summary
                </button>
              ) : null}
            </div>
          ) : null}
          <Box checked={on("sec-skills")} onChange={() => toggle("sec-skills")} label="Technical skills" />
          <Nested enabled={on("sec-skills")}>
            {cvSkills.map((s) => (
              <Box key={s.id} small checked={on(s.id)} onChange={() => toggle(s.id)} label={s.label} />
            ))}
          </Nested>
          <Box checked={on("sec-strengths")} onChange={() => toggle("sec-strengths")} label="Core strengths" />
          <Box checked={on("sec-languages")} onChange={() => toggle("sec-languages")} label="Languages" />
        </Group>

        <Group title="Work experience" toggle={{ checked: on("sec-experience"), onChange: () => toggle("sec-experience") }}>
          <Nested enabled={on("sec-experience")} flush>
            {cvExperience.map((r) => (
              <div key={r.id}>
                <Box checked={on(r.id)} onChange={() => toggle(r.id)} label={r.company} detail={`${r.title} · ${r.period}`} />
                <Nested enabled={on(r.id)}>
                  {r.groups.map((g) =>
                    g.name || g.label ? (
                      <div key={g.id}>
                        <Box small checked={on(g.id)} onChange={() => toggle(g.id)} label={g.name ?? g.label!} strong />
                        <Nested enabled={on(g.id)}>
                          {g.bullets.map((b) => (
                            <Box key={b.id} small checked={on(b.id)} onChange={() => toggle(b.id)} label={b.text} />
                          ))}
                        </Nested>
                      </div>
                    ) : (
                      g.bullets.map((b) => <Box key={b.id} small checked={on(b.id)} onChange={() => toggle(b.id)} label={b.text} />)
                    ),
                  )}
                </Nested>
              </div>
            ))}
          </Nested>
        </Group>

        <Group title="Projects" toggle={{ checked: on("sec-projects"), onChange: () => toggle("sec-projects") }}>
          <Nested enabled={on("sec-projects")} flush>
            {cvProjects.map((p) => (
              <div key={p.id}>
                <Box checked={on(p.id)} onChange={() => toggle(p.id)} label={p.name} detail={p.meta} />
                <Nested enabled={on(p.id)}>
                  {p.bullets.map((b) => (
                    <Box key={b.id} small checked={on(b.id)} onChange={() => toggle(b.id)} label={b.text} />
                  ))}
                </Nested>
              </div>
            ))}
          </Nested>
        </Group>

        <Group title="Education" toggle={{ checked: on("sec-education"), onChange: () => toggle("sec-education") }}>
          <Nested enabled={on("sec-education")} flush>
            <p className="pl-7 text-[15px] text-ink">
              {cvEducation.degree}
              <span className="fig block text-[11px] text-ink-3">
                {cvEducation.school} · {cvEducation.period}
              </span>
            </p>
            <Box small checked={on(cvEducation.cgpa.id)} onChange={() => toggle(cvEducation.cgpa.id)} label={cvEducation.cgpa.text} />
          </Nested>
        </Group>

        <div className="fig mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-5 text-[11px] tracking-wide uppercase">
          <button type="button" onClick={() => setOff(new Set())} className="inline-flex items-center text-ink hover:text-accent pointer-coarse:min-h-10">
            Select all
          </button>
          <button type="button" onClick={() => setOff(new Set(ALL_IDS))} className="inline-flex items-center text-ink hover:text-accent pointer-coarse:min-h-10">
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              setOff(new Set(cvDefaultOff));
              setHeadline(cvHeadline);
              setSummary(cvSummary);
            }}
            className="inline-flex items-center text-ink-3 hover:text-accent pointer-coarse:min-h-10"
          >
            Reset to default
          </button>
        </div>
      </div>

      {/* Live preview */}
      <div className="lg:col-span-7">
        <div className="lg:sticky lg:top-20">
          <div className="flex flex-wrap items-center gap-2">
            <span className="fig mr-auto text-[11px] text-ink-3">A4 · live preview</span>
            <button type="button" onClick={copyText} className={tool} data-cursor="Copy">
              <Copy size={13} /> Copy text
            </button>
            <button type="button" onClick={downloadTxt} className={tool} data-cursor=".txt">
              <Download size={13} /> .txt
            </button>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={making}
              data-cursor="PDF"
              className="fig inline-flex h-9 items-center gap-2 bg-accent pointer-coarse:h-10 px-3.5 text-[11px] font-semibold tracking-wide text-paper uppercase hover:brightness-110 disabled:opacity-60"
            >
              <Download size={13} /> {making ? "Building…" : "PDF"}
            </button>
          </div>
          <p className="fig mt-2 h-4 text-[11px] text-accent" aria-live="polite">
            {status ? (
              <span className="inline-flex items-center gap-1.5">
                <Check size={12} /> {status}
              </span>
            ) : null}
          </p>
          <Preview>
            <CvSheet cv={cv} />
          </Preview>
        </div>
      </div>
    </div>
  );
}

function Group({ title, toggle, children }: { title: string; toggle?: { checked: boolean; onChange: () => void }; children: ReactNode }) {
  return (
    <fieldset className="mt-10 first:mt-0">
      <legend className="flex w-full items-center gap-3">
        {toggle ? (
          <Check3 checked={toggle.checked} onChange={toggle.onChange} label={title} />
        ) : (
          <span className="fig text-[11px] tracking-[0.14em] text-accent uppercase">{title}</span>
        )}
        <span className="h-px flex-1 bg-rule" aria-hidden="true" />
      </legend>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </fieldset>
  );
}

function Check3({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label className="fig inline-flex cursor-pointer items-center gap-2.5 text-[11px] tracking-[0.14em] text-accent uppercase pointer-coarse:min-h-10">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <Square checked={checked} />
      {label}
    </label>
  );
}

function Square({ checked, small }: { checked: boolean; small?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center border-2 border-accent transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent ${
        small ? "size-3.5" : "size-4"
      } ${checked ? "bg-accent" : "bg-transparent"}`}
    >
      <span className={`${small ? "size-1" : "size-1.5"} ${checked ? "bg-paper" : "bg-transparent"}`} />
    </span>
  );
}

function Box({
  checked,
  onChange,
  label,
  detail,
  small,
  strong,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  detail?: string;
  small?: boolean;
  strong?: boolean;
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-3 pointer-coarse:min-h-10 pointer-coarse:py-1">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span className="mt-[3px] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
        <Square checked={checked} small={small} />
      </span>
      <span className={`min-w-0 transition-opacity ${checked ? "" : "opacity-45"}`}>
        <span
          className={`block leading-snug ${small ? "text-[13.5px]" : "text-[15px]"} ${strong || !small ? "text-ink" : "text-ink-2"} ${
            strong ? "font-medium" : ""
          } group-hover:text-ink`}
        >
          {label}
        </span>
        {detail ? <span className="fig mt-0.5 block text-[11px] break-words text-ink-3">{detail}</span> : null}
      </span>
    </label>
  );
}

function Nested({ enabled, flush, children }: { enabled: boolean; flush?: boolean; children: ReactNode }) {
  return (
    <div
      className={`flex flex-col gap-2.5 transition-opacity ${flush ? "" : "ml-7"} ${enabled ? "" : "pointer-events-none opacity-35"}`}
      aria-disabled={!enabled}
    >
      {children}
    </div>
  );
}

/** Scales the 794px sheet to the column and marks A4 page breaks. */
function Preview({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.7);
  const [height, setHeight] = useState(A4_HEIGHT);

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (box.current) setScale(box.current.clientWidth / 794);
      if (sheet.current) setHeight(Math.max(A4_HEIGHT, sheet.current.scrollHeight));
    });
    if (box.current) ro.observe(box.current);
    if (sheet.current) ro.observe(sheet.current);
    return () => ro.disconnect();
  }, []);

  const pages = Math.ceil(height / A4_HEIGHT);

  return (
    <div
      data-lenis-prevent
      className="mt-2 max-h-[calc(100dvh-9.5rem)] overflow-y-auto overscroll-contain border border-rule bg-paper-2 p-3 sm:p-4"
    >
      <div ref={box} className="relative" style={{ height: height * scale }}>
        <div ref={sheet} className="absolute top-0 left-0 origin-top-left shadow-[0_24px_48px_-24px_rgba(0,0,0,0.7)]" style={{ transform: `scale(${scale})` }}>
          {children}
        </div>
        {Array.from({ length: pages - 1 }, (_, i) => (
          <div
            key={i}
            aria-hidden="true"
            className="fig pointer-events-none absolute inset-x-0 border-t border-dashed border-sun/70 text-right text-[10px] text-sun"
            style={{ top: (i + 1) * A4_HEIGHT * scale }}
          >
            page {i + 2}
          </div>
        ))}
      </div>
      <p className="fig mt-3 text-[10px] text-ink-3">
        {pages} {pages === 1 ? "page" : "pages"} · single column · Helvetica · readable by applicant tracking systems
      </p>
    </div>
  );
}
