// Server entry used only at build time to prerender the homepage HTML
// (see scripts/prerender.mjs). The browser still runs src/main.jsx.

import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import App from "./App.jsx";

export function render(url) {
  const helmetContext = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
          {/* Must mirror src/main.jsx exactly so hydration matches */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
            }}
          />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>
  );

  return { html, helmet: helmetContext.helmet };
}
