import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";

const app = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

const container = document.getElementById("root");

// The homepage is prerendered at build time (scripts/prerender.mjs).
// Hydrating reuses that HTML instead of re-creating it, so the hero image
// and text that are already on screen aren't replaced.
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
