import type Lenis from "lenis";

// The active Lenis instance (when smooth scrolling is on), so UI can scroll through it.
let current: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  current = l;
};

export function scrollToTop() {
  if (current) current.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}
