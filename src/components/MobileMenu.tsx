"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { ArrowUpRight, Download } from "@/components/icons";

export type NavItem = { href: string; label: string };

/** Below lg: a Menu button that opens a full-screen panel with every section link and quick actions. */
export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Lock page scroll, close on Escape, and move focus in and back out.
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    // Focus the first link once the panel is visible.
    const raf = requestAnimationFrame(() => panel.current?.querySelector<HTMLElement>("a")?.focus());
    const btn = button.current;
    return () => {
      cancelAnimationFrame(raf);
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      btn?.focus();
    };
  }, [open]);

  // Leaving the lg breakpoint while open should not leave the page locked.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="group relative -mr-2 inline-flex h-10 items-center gap-2.5 px-2 text-sm text-ink lg:hidden"
      >
        <span className="fig text-[11px] tracking-[0.12em] uppercase">{open ? "Close" : "Menu"}</span>
        <span aria-hidden="true" className="relative block h-3 w-5">
          <span
            className={`absolute left-0 h-[1.5px] w-5 bg-current transition-all duration-300 ease-out-expo ${open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`}
          />
          <span
            className={`absolute bottom-0 left-0 h-[1.5px] bg-sun transition-all duration-300 ease-out-expo ${open ? "bottom-1/2 w-5 translate-y-1/2 -rotate-45 bg-current" : "w-3.5"}`}
          />
        </span>
      </button>

      <div
        id="mobile-menu"
        ref={panel}
        data-lenis-prevent
        inert={!open}
        // Visible at once when opening (so focus can move in); hidden only after the wipe when closing.
        className={`fixed inset-x-0 top-14 bottom-0 z-30 flex flex-col overflow-y-auto bg-night px-4 pt-8 pb-8 duration-500 ease-out-expo sm:px-8 lg:hidden ${
          open
            ? "visible transition-[clip-path] [clip-path:inset(0_0_0_0)]"
            : "invisible transition-[clip-path,visibility] [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <nav aria-label="Mobile">
          <ul>
            {items.map((item, i) => (
              <li key={item.href} className="overflow-hidden border-b border-rule">
                <Link
                  href={item.href}
                  onClick={close}
                  className={`group/link flex items-center justify-between py-3.5 transition-[transform,opacity] duration-500 ease-out-expo ${
                    open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: open ? `${80 + i * 45}ms` : "0ms" }}
                >
                  <span className="stmt text-[clamp(2rem,9vw,3rem)] font-semibold text-ink transition-colors group-hover/link:text-sun group-active/link:text-sun">
                    {item.label}
                  </span>
                  <span className="fig text-[10px] text-ink-3">{item.href === "/cv" ? "Builder" : item.href.replace("/#", "#")}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div
          className={`mt-auto pt-10 transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: open ? `${120 + items.length * 45}ms` : "0ms" }}
        >
          <div className="flex flex-wrap gap-3">
            <a
              href={profile.resume}
              download={profile.resumeFile}
              onClick={close}
              className="stmt-wide inline-flex h-11 items-center gap-2 bg-sun px-4 text-sm text-paper"
            >
              <Download size={14} /> Résumé
            </a>
            <a href={`mailto:${profile.email}`} className="stmt-wide inline-flex h-11 items-center border border-rule-strong px-4 text-sm text-ink">
              Email
            </a>
          </div>
          <p className="fig mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-ink-2">
            {[
              ["LinkedIn", profile.links.linkedin],
              ["GitHub", profile.links.github],
            ].map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-1 hover:text-sun">
                {label} <ArrowUpRight size={12} />
                <span className="sr-only">(opens in new tab)</span>
              </a>
            ))}
          </p>
        </div>
      </div>
    </>
  );
}
