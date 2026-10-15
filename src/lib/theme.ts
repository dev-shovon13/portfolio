export type Theme = "light" | "dark";

/** localStorage key for an explicit choice; without one the site is dark. */
export const THEME_KEY = "kas-theme";

export const currentTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

/** Apply a theme; `save` records it as the visitor's own choice. Listeners hear "themechange". */
export function applyTheme(theme: Theme, save = false) {
  document.documentElement.dataset.theme = theme;
  if (save) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}
