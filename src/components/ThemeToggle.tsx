"use client";

import { useRef, useSyncExternalStore } from "react";
import { Moon, Sun } from "@/components/icons";
import { MOTION_OK } from "@/lib/gsap";
import { applyTheme, currentTheme, type Theme } from "@/lib/theme";

const subscribe = (onChange: () => void) => {
  window.addEventListener("themechange", onChange);
  return () => window.removeEventListener("themechange", onChange);
};

/** Switches light/dark. The new theme opens as a circle from the button where view transitions exist. */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const btn = useRef<HTMLButtonElement>(null);
  // Null on the server, which can't know the theme; the icon settles on hydration.
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

  const toggle = () => {
    const next: Theme = currentTheme() === "light" ? "dark" : "light";
    const swap = () => applyTheme(next, true);
    if (!document.startViewTransition || !window.matchMedia(MOTION_OK).matches || !btn.current) return swap();

    const { left, top, width, height } = btn.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(swap).ready.then(() =>
      document.documentElement.animate(
        { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        { duration: 650, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
      ),
    );
  };

  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <button
      ref={btn}
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      data-cursor={theme === "light" ? "Dark" : "Light"}
      className={`group inline-flex size-10 items-center justify-center text-ink-2 transition-colors hover:text-accent lg:size-9 pointer-coarse:lg:size-10 ${className}`}
    >
      {/* Shows the theme you'd switch to. */}
      <span className="transition-transform duration-500 ease-out-expo group-hover:rotate-45">
        {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      </span>
    </button>
  );
}
