import "@fontsource-variable/oswald/wght.css";
import "@fontsource-variable/inter/wght.css";
import "./index.css";
import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { HeadProvider } from "./seo/head";
import { preloadPath } from "./pages/registry";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <HeadProvider collector={null}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <App />
      </BrowserRouter>
    </HeadProvider>
  </StrictMode>
);

// Load the current page chunk first so hydration matches the prerendered HTML.
preloadPath(window.location.pathname).finally(() => {
  // Hydrate only when the prerendered HTML belongs to this URL (SPA fallbacks may serve another page).
  const pre = container.dataset.prerendered;
  const here = window.location.pathname.replace(/\/+$/, "") || "/";
  if (container.firstElementChild && pre === here) hydrateRoot(container, app);
  else {
    container.innerHTML = "";
    createRoot(container).render(app);
  }
});
