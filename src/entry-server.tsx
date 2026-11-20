import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import { HeadCollector, HeadProvider, renderHead } from "./seo/head";
import { preloadPath } from "./pages/registry";
import { langFromPath } from "./lib/routes";

export async function render(url: string) {
  const pathname = new URL(url, "http://localhost").pathname;
  await preloadPath(pathname);
  const collector = new HeadCollector();
  const html = renderToString(
    <StrictMode>
      <HeadProvider collector={collector}>
        <StaticRouter location={url} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <App />
        </StaticRouter>
      </HeadProvider>
    </StrictMode>,
  );
  return { html, head: collector.data ? renderHead({ ...collector.data, preload: [...(collector.data.preload ?? []), ...collector.preloads] }) : "", lang: collector.data?.lang ?? langFromPath(pathname), noindex: !!collector.data?.noindex };
}

export { routes, LANGS, destinationSlugs, legacyRedirects, matchRoute } from "./lib/routes";
export { publishedTrips } from "./content/trips";
export { site } from "./lib/site";
