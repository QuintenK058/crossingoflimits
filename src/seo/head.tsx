import { createContext, useContext, useEffect, type ReactNode } from "react";

export interface HeadData {
  title: string;
  description: string;
  canonical?: string;
  lang: string;
  alternates?: { hreflang: string; href: string }[];
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  noindex?: boolean;
  jsonLd?: object[];
  preload?: { href?: string; imagesrcset?: string; imagesizes?: string; type?: string; media?: string }[];
}

/** On the server the page writes its head data into this collector. */
export class HeadCollector {
  data: HeadData | null = null;
  /** Extra image preloads registered by components (e.g. the page hero). */
  preloads: NonNullable<HeadData["preload"]> = [];
}

const HeadContext = createContext<HeadCollector | null>(null);
export const HeadProvider = ({ collector, children }: { collector: HeadCollector | null; children: ReactNode }) => (
  <HeadContext.Provider value={collector}>{children}</HeadContext.Provider>
);

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Serialize head data to HTML (used by the prerender step). */
export function renderHead(d: HeadData): string {
  const tags: string[] = [];
  tags.push(`<title>${esc(d.title)}</title>`);
  tags.push(`<meta name="description" content="${esc(d.description)}" data-head="1">`);
  if (d.noindex) tags.push(`<meta name="robots" content="noindex, nofollow" data-head="1">`);
  if (d.canonical) tags.push(`<link rel="canonical" href="${esc(d.canonical)}" data-head="1">`);
  for (const a of d.alternates ?? [])
    tags.push(`<link rel="alternate" hreflang="${a.hreflang}" href="${esc(a.href)}" data-head="1">`);
  const og: [string, string | undefined][] = [
    ["og:site_name", "Crossing of Limits"],
    ["og:type", d.type ?? "website"],
    ["og:title", d.title],
    ["og:description", d.description],
    ["og:url", d.canonical],
    ["og:image", d.image],
    ["og:image:alt", d.imageAlt],
    ["og:locale", d.lang === "nl" ? "nl_NL" : "en_GB"],
  ];
  for (const [p, c] of og) if (c) tags.push(`<meta property="${p}" content="${esc(c)}" data-head="1">`);
  const tw: [string, string | undefined][] = [
    ["twitter:card", "summary_large_image"],
    ["twitter:title", d.title],
    ["twitter:description", d.description],
    ["twitter:image", d.image],
  ];
  for (const [n, c] of tw) if (c) tags.push(`<meta name="${n}" content="${esc(c)}" data-head="1">`);
  for (const p of d.preload ?? []) {
    const attrs = [
      `rel="preload" as="image" fetchpriority="high"`,
      p.href && `href="${esc(p.href)}"`,
      p.imagesrcset && `imagesrcset="${esc(p.imagesrcset)}"`,
      p.imagesizes && `imagesizes="${esc(p.imagesizes)}"`,
      p.type && `type="${p.type}"`,
      p.media && `media="${esc(p.media)}"`,
    ].filter(Boolean);
    tags.push(`<link ${attrs.join(" ")} data-head="1">`);
  }
  for (const j of d.jsonLd ?? [])
    tags.push(`<script type="application/ld+json" data-head="1">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`);
  return tags.join("\n    ");
}

/** Client-side: replace managed head tags on navigation. */
function applyHead(d: HeadData) {
  document.title = d.title;
  document.documentElement.lang = d.lang;
  const managed = document.head.querySelectorAll("[data-head]");
  const html = renderHead({ ...d, preload: [] });
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  // Skip <title>, we set it directly.
  const fresh = Array.from(tpl.content.children).filter((el) => el.tagName !== "TITLE");
  const same =
    managed.length === fresh.length && fresh.every((el, i) => el.isEqualNode(managed[i]));
  if (same) return;
  managed.forEach((el) => {
    if (!(el.tagName === "LINK" && el.getAttribute("rel") === "preload")) el.remove();
  });
  fresh.forEach((el) => document.head.appendChild(el));
}

/** Prerender only: adds a high-priority preload for an above-the-fold image. */
export function usePreloadImage(preload: NonNullable<HeadData["preload"]>[number]) {
  const collector = useContext(HeadContext);
  if (collector && !collector.preloads.some((p) => p.imagesrcset === preload.imagesrcset)) collector.preloads.push(preload);
}

export function useHead(data: HeadData) {
  const collector = useContext(HeadContext);
  if (collector) collector.data = data;
  const key = JSON.stringify(data);
  useEffect(() => {
    applyHead(JSON.parse(key) as HeadData);
  }, [key]);
}
