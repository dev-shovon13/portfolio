// Resolves once the page loader has lifted (once per full page load).
// Client-side navigations reuse the already-resolved promise, so nothing waits twice.
let resolve: () => void = () => {};

export const loaded: Promise<void> =
  typeof window === "undefined" ? Promise.resolve() : new Promise<void>((r) => (resolve = r));

export const markLoaded = () => resolve();
