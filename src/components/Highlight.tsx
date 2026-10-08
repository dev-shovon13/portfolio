import { Fragment, type ReactNode } from "react";

/** Wraps each phrase found in `text` in a highlighter mark (see .mark in globals.css). */
export function Highlight({ text, phrases }: { text: string; phrases: string[] }) {
  const parts: ReactNode[] = [];
  let rest = text;
  let key = 0;
  while (rest) {
    const hits = phrases.map((p) => ({ p, i: rest.indexOf(p) })).filter((h) => h.i >= 0).sort((a, b) => a.i - b.i);
    if (!hits.length) {
      parts.push(rest);
      break;
    }
    const { p, i } = hits[0];
    if (i) parts.push(rest.slice(0, i));
    parts.push(
      <span key={key++} className="mark" data-mark>
        {p}
      </span>,
    );
    rest = rest.slice(i + p.length);
  }
  return <>{parts.map((n, i) => (typeof n === "string" ? <Fragment key={`t${i}`}>{n}</Fragment> : n))}</>;
}
