/**
 * Prerenders every route (NL + EN) to static HTML after `vite build`, so each
 * page has its own title/meta/hreflang/JSON-LD and content for crawlers.
 * Also writes sitemap.xml, robots.txt, 404.html and redirect files.
 */
import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const SSR = path.join(ROOT, "dist-ssr", "entry-server.js");

const { render, routes, LANGS, destinationSlugs, legacyRedirects, publishedTrips, site, matchRoute } = await import(pathToFileURL(SSR).href);
let template = await readFile(path.join(DIST, "index.html"), "utf8");
// Inline the (small, ~10 KB gzip) stylesheet: removes a render-blocking request.
const cssLink = template.match(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/);
if (cssLink) {
  const css = await readFile(path.join(DIST, cssLink[1]), "utf8");
  template = template.replace(cssLink[0], () => `<style>${css}</style>`);
}

// Preload the two variable fonts (latin subset) used above the fold.
const assets = await readdir(path.join(DIST, "assets"));
const fontPreloads = `<link rel="preload" href="/fonts/archivo-var-subset.woff2" as="font" type="font/woff2" crossorigin>`;

const noscript = `<noscript><style>[data-reveal]{opacity:1!important;transform:none!important}</style></noscript>`;

/** @type {{ url: string, alternates?: Record<string,string>, sitemap: boolean }[]} */
const pages = [];
for (const key of Object.keys(routes)) {
  if (key === "trip") {
    for (const trip of publishedTrips) {
      const alts = Object.fromEntries(LANGS.map((l) => [l, routes.trip[l].replace(":slug", trip.slug)]));
      for (const l of LANGS) pages.push({ url: alts[l], alternates: alts, sitemap: true });
    }
  } else if (key === "destination") {
    for (const id of Object.keys(destinationSlugs)) {
      const alts = Object.fromEntries(LANGS.map((l) => [l, routes.destination[l].replace(":slug", destinationSlugs[id][l])]));
      for (const l of LANGS) pages.push({ url: alts[l], alternates: alts, sitemap: true });
    }
  } else {
    const alts = Object.fromEntries(LANGS.map((l) => [l, routes[key][l]]));
    for (const l of LANGS) pages.push({ url: alts[l], alternates: alts, sitemap: true });
  }
}
pages.push({ url: "/auth", sitemap: false }, { url: "/admin", sitemap: false });

// modulepreload the JS chunks of each page (avoids a request waterfall before hydration)
const manifest = JSON.parse(await readFile(path.join(DIST, ".vite", "manifest.json"), "utf8"));
const PAGE_FILES = {
  home: "Home", groupTours: "GroupTours", individualTours: "IndividualTours", tailorMade: "TailorMade", destinations: "Destinations",
  destination: "DestinationDetail", trip: "TripDetail", experience: "Experience", faq: "Faq", plan: "Plan", contact: "Contact",
  guarantee: "Guarantee", terms: "Terms", privacy: "Privacy", cookies: "Cookies",
};
function chunkFiles(key, seen = new Set()) {
  const entry = manifest[key];
  if (!entry || seen.has(key)) return [];
  seen.add(key);
  return [entry.file, ...(entry.imports ?? []).flatMap((k) => chunkFiles(k, seen))];
}
const entryChunks = new Set(chunkFiles("index.html"));
function pagePreloads(url) {
  const m = url === "/404" ? { key: "notFound" } : matchRoute(url);
  const file = m ? (m.key === "notFound" ? "NotFound" : PAGE_FILES[m.key]) : url === "/admin" ? null : null;
  if (!file) return "";
  return chunkFiles(`src/pages/${file}.tsx`)
    .filter((f) => !entryChunks.has(f) && f.endsWith(".js"))
    .map((f) => `<link rel="modulepreload" fetchpriority="low" crossorigin href="/${f}">`)
    .join("\n    ");
}

// Content is prerendered, so the JS (hydration) may load at low priority: images and
// fonts needed for the first paint win the bandwidth race.
template = template.replace(/<script type="module" crossorigin/, '<script type="module" fetchpriority="low" crossorigin')
  .replace(/<link rel="modulepreload" crossorigin/g, '<link rel="modulepreload" fetchpriority="low" crossorigin');
const logoPreload = `<link rel="preload" as="image" type="image/webp" imagesrcset="/media/brand/logo-160.webp 1x, /media/brand/logo-240.webp 1.5x, /media/brand/logo-320.webp 2x" fetchpriority="high">`;

function fill(html, head, lang, url) {
  return template
    .replace('<html lang="nl">', `<html lang="${lang}">`)
    .replace("<!--app-head-->", `${logoPreload}\n    ${head}\n    ${fontPreloads}\n    ${pagePreloads(url)}\n    ${noscript}`)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-prerendered="${url}">${html}</div>`);
}

function outFile(url) {
  return url === "/" ? path.join(DIST, "index.html") : path.join(DIST, url, "index.html");
}

let count = 0;
for (const p of pages) {
  const { html, head, lang } = await render(p.url);
  const file = outFile(p.url);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, fill(html, head, lang, p.url));
  count++;
}

// 404 page (served by static hosts for unknown URLs)
{
  const { html, head, lang } = await render("/404-niet-gevonden");
  await writeFile(path.join(DIST, "404.html"), fill(html, head, lang, "/404"));
}

// Legacy URL redirect stubs (for hosts without server-side redirects)
const legacy = { ...legacyRedirects };
for (const trip of publishedTrips) legacy[`/tours/${trip.slug}`] = `/reizen/${trip.slug}`;
for (const [from, to] of Object.entries(legacy)) {
  const file = outFile(from);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(
    file,
    `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>Doorverwijzing…</title><meta name="robots" content="noindex"><link rel="canonical" href="${site.url}${to}"><meta http-equiv="refresh" content="0; url=${to}"></head><body><a href="${to}">${site.url}${to}</a></body></html>`,
  );
}

// Netlify-style redirects (301) + 404 fallback
await writeFile(
  path.join(DIST, "_redirects"),
  [...Object.entries(legacy).map(([f, t]) => `${f} ${t} 301`), "/* /404.html 404"].join("\n") + "\n",
);

// Sitemap with hreflang alternates
const today = new Date().toISOString().slice(0, 10);
const abs = (u) => `${site.url}${u === "/" ? "/" : u}`;
const urls = pages
  .filter((p) => p.sitemap)
  .map((p) => {
    const alts = Object.entries(p.alternates ?? {})
      .map(([l, u]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(u)}"/>`)
      .concat(p.alternates ? [`    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(p.alternates.nl)}"/>`] : [])
      .join("\n");
    return `  <url>\n    <loc>${abs(p.url)}</loc>\n    <lastmod>${today}</lastmod>\n${alts}\n  </url>`;
  });
await writeFile(
  path.join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`,
);
await writeFile(
  path.join(DIST, "robots.txt"),
  `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /auth\n\nSitemap: ${site.url}/sitemap.xml\n`,
);

await rm(path.join(ROOT, "dist-ssr"), { recursive: true, force: true });
console.log(`✓ prerendered ${count} pages + 404, ${Object.keys(legacy).length} legacy redirects, sitemap with ${urls.length} URLs`);
