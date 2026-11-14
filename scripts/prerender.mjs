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

page = page
  .replace("</head>", `    ${headTags.join("\n    ")}\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

if (!page.includes('id="home"')) {
  throw new Error("Prerender failed: homepage markup missing");
}

fs.writeFileSync(path.join(dist, "index.html"), page);
fs.rmSync(ssrDir, { recursive: true, force: true });

console.log(
  `Prerendered / (${(Buffer.byteLength(page) / 1024).toFixed(1)} KB) -> dist/index.html; SPA shell -> dist/spa.html`
);
