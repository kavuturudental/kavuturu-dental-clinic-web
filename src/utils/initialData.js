// CMS content fetched at build time by scripts/prerender.mjs and embedded in
// the prerendered homepage as window.__INITIAL_DATA__.
//
// Components use it as their *initial* state so the page the browser paints
// already shows the real CMS text. Without this the static fallback text is
// painted first and then swapped for the CMS text, which moves everything
// below it (a big Cumulative Layout Shift on mobile).
//
// Components still re-fetch from the API afterwards, so CMS edits made after
// the last deploy still appear.
export function getInitialData(key) {
  return globalThis.__INITIAL_DATA__?.[key];
}
