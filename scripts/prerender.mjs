// Build-time prerender of the homepage.
//
// 1. `vite build` produces the normal SPA in dist/.
// 2. `vite build --ssr src/entry-server.jsx --outDir dist-ssr` produces a
//    Node-loadable copy of the app.
// 3. This script renders "/" to static HTML and writes it into
//    dist/index.html, so the hero, text and images show before any
//    JavaScript has downloaded. React then takes over in the browser.
//
// The untouched SPA shell is kept as dist/spa.html and vercel.json rewrites
// every other route to it, so other pages behave exactly as before.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const ssrDir = path.join(root, "dist-ssr");

// Minimal browser globals: some modules read localStorage during render.
const memoryStorage = () => {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear(),
  };
};
globalThis.localStorage ??= memoryStorage();
globalThis.sessionStorage ??= memoryStorage();

// Fetch the CMS content shown near the top of the homepage so the
// prerendered HTML matches what the live API returns (otherwise text swaps
// after first paint and causes layout shift). Failures fall back to the
// static content bundled with the app.
const API_URL = (
  process.env.VITE_API_URL ||
  readEnvFile(".env.production").VITE_API_URL ||
  "https://kavuturu-backend.vercel.app/api"
).replace(/\/$/, "");

async function fetchCms(endpoint) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      signal: AbortSignal.timeout(15000),
    });
    const json = await res.json();
    return json?.success ? json.data : undefined;
  } catch (err) {
    console.warn(`Prerender: could not fetch ${endpoint} (${err.message}); using static fallback`);
    return undefined;
  }
}

function readEnvFile(name) {
  try {
    return Object.fromEntries(
      fs
        .readFileSync(path.join(root, name), "utf-8")
        .split(/\r?\n/)
        .filter((l) => /^\s*[A-Z_]+=/.test(l))
        .map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
    );
  } catch {
    return {};
  }
}

const [hero, about, featuredDoctor, testimonials] = await Promise.all([
  fetchCms("/website/hero"),
  fetchCms("/website/about"),
  fetchCms("/website/doctors/featured"),
  fetchCms("/website/testimonials?homepage=true"),
]);
const initialData = Object.fromEntries(
  Object.entries({ hero, about, featuredDoctor, testimonials }).filter(([, v]) => v !== undefined)
);
globalThis.__INITIAL_DATA__ = initialData;

const entry = fs
  .readdirSync(ssrDir)
  .find((f) => /^entry-server\.(m?js)$/.test(f));
const { render } = await import(pathToFileURL(path.join(ssrDir, entry)).href);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf-8");

// Keep a pristine SPA shell for all non-prerendered routes.
fs.writeFileSync(path.join(dist, "spa.html"), template);

const { html } = render("/");

// React 19 emits <title>/<meta>/<link> tags (from <SEO />) at the start of
// the rendered markup. Move them into <head> where they belong.
let body = html;
const headTags = [];
for (;;) {
  const m = body.match(/^(<title>[\s\S]*?<\/title>|<(?:meta|link)\b[^>]*>)/);
  if (!m) break;
  headTags.push(m[0]);
  body = body.slice(m[0].length);
}

// Many classNames are written across several lines in the source; collapse
// that whitespace so the HTML is smaller.
body = body.replace(
  /class="([^"]*)"/g,
  (_, cls) => `class="${cls.trim().replace(/\s+/g, " ")}"`
);

let page = template;

// Drop template defaults that the page provides itself (avoid duplicates).
if (headTags.some((t) => t.startsWith("<title>"))) {
  page = page.replace(/<title>[\s\S]*?<\/title>/, "");
}
if (headTags.some((t) => /^<meta name="description"/.test(t))) {
  page = page.replace(/<meta\s+name="description"[\s\S]*?\/>/, "");
}

// Embed the same CMS data for the browser (escape "<" so it can't close the tag).
const dataScript = `<script>window.__INITIAL_DATA__=${JSON.stringify(initialData).replace(/</g, "\\u003c")}</script>`;
headTags.unshift(dataScript);

page = page
  .replace("</head>", `    ${headTags.join("\n    ")}\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

// Inline the (small) stylesheet so the first paint doesn't wait for an extra
// request. Other routes keep loading it as a normal cached file.
page = page.replace(
  /<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/,
  (tag, href) => {
    const css = fs.readFileSync(path.join(dist, href), "utf-8");
    return `<style>${css}</style>`;
  }
);

// ---- Homepage-only loading order -------------------------------------
// 1. Replace the script-inserted hero preload with static <link> tags at the
//    top of <head> so the browser starts the LCP image request immediately.
page = page.replace(
  /<!-- =+\s*PERFORMANCE: HERO PRELOAD[\s\S]*?<\/script>\s*/,
  ""
);
const heroPreloads = [
  ["(max-width: 1023.98px)", "/images/hero/hero-mobile-480.webp 480w, /images/hero/hero-mobile-768.webp 768w, /images/hero/hero-mobile-853.webp 853w"],
  ["(min-width: 1024px)", "/images/hero/hero-desktop-1280.webp 1280w, /images/hero/hero-desktop-1672.webp 1672w"],
]
  .map(
    ([media, srcset]) =>
      `<link rel="preload" as="image" media="${media}" imagesrcset="${srcset}" imagesizes="100vw" fetchpriority="high" />`
  )
  .join("\n    ");
// Must come after <meta name="viewport">, otherwise the browser picks the
// image size using the default 980px desktop viewport.
page = page.replace(
  /<meta\s+name="viewport"[^>]*\/>/,
  (m) => `${m}\n    ${heroPreloads}`
);

// 2. Start downloading the app JavaScript only once the hero image has
//    loaded (or on first tap/keypress, or after 3s at most). The page is
//    already fully rendered HTML, so this keeps the JS from competing with
//    the hero image for bandwidth on slow mobile connections.
page = page.replace(/<link rel="modulepreload"[^>]*>\s*/g, "");
page = page.replace(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
  (tag, src) => {
    fs.writeFileSync(path.join(dist, ".main-entry"), src);
    return "";
  }
);
const mainSrc = fs.readFileSync(path.join(dist, ".main-entry"), "utf-8");
fs.rmSync(path.join(dist, ".main-entry"));
const loader = `<script>
(function () {
  var started = false;
  function start() {
    if (started) return;
    started = true;
    var s = document.createElement("script");
    s.type = "module";
    s.crossOrigin = "";
    s.src = "${mainSrc}";
    document.head.appendChild(s);
  }
  var img = document.querySelector("#home img");
  if (img && !img.complete) {
    img.addEventListener("load", start, { once: true });
    img.addEventListener("error", start, { once: true });
  } else {
    start();
  }
  ["pointerdown", "keydown", "touchstart"].forEach(function (e) {
    addEventListener(e, start, { once: true, passive: true });
  });
  setTimeout(start, 3000);
})();
</script>`;
page = page.replace("</body>", `${loader}\n  </body>`);

if (!page.includes('id="home"')) {
  throw new Error("Prerender failed: homepage markup missing");
}

fs.writeFileSync(path.join(dist, "index.html"), page);
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(
  `Prerendered / (${(Buffer.byteLength(page) / 1024).toFixed(1)} KB) -> dist/index.html; SPA shell -> dist/spa.html`
);
