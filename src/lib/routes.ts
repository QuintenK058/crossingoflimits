/**
 * Central route map. NL is the default language (no prefix), EN lives under /en.
 * Every page in the site is listed here; links are always built with `pathFor`.
 */
export type Lang = "nl" | "en";
export const LANGS: Lang[] = ["nl", "en"];

export const routes = {
  home: { nl: "/", en: "/en" },
  groupTours: { nl: "/groepsreizen", en: "/en/group-tours" },
  individualTours: { nl: "/individuele-reizen", en: "/en/individual-tours" },
  tailorMade: { nl: "/op-maat", en: "/en/tailor-made" },
  destinations: { nl: "/bestemmingen", en: "/en/destinations" },
  destination: { nl: "/bestemmingen/:slug", en: "/en/destinations/:slug" },
  trip: { nl: "/reizen/:slug", en: "/en/tours/:slug" },
  experience: { nl: "/de-ervaring", en: "/en/the-experience" },
  faq: { nl: "/veelgestelde-vragen", en: "/en/faq" },
  plan: { nl: "/plan", en: "/en/plan" },
  contact: { nl: "/contact", en: "/en/contact" },
  guarantee: { nl: "/garantieregeling", en: "/en/guarantee-scheme" },
  terms: { nl: "/reisvoorwaarden", en: "/en/travel-terms" },
  privacy: { nl: "/privacyverklaring", en: "/en/privacy-policy" },
  cookies: { nl: "/cookieverklaring", en: "/en/cookie-policy" },
} as const;

export type RouteKey = keyof typeof routes;

/** Destination slugs differ per language. */
export const destinationSlugs = {
  spain: { nl: "spanje", en: "spain" },
  morocco: { nl: "marokko", en: "morocco" },
} as const;
export type DestinationId = keyof typeof destinationSlugs;

export function pathFor(key: RouteKey, lang: Lang, params: Record<string, string> = {}, search?: string) {
  let p: string = routes[key][lang];
  for (const [k, v] of Object.entries(params)) p = p.replace(`:${k}`, encodeURIComponent(v));
  return search ? `${p}?${search}` : p;
}

export function destinationPath(id: DestinationId, lang: Lang) {
  return pathFor("destination", lang, { slug: destinationSlugs[id][lang] });
}

export function destinationIdFromSlug(slug: string): DestinationId | undefined {
  return (Object.keys(destinationSlugs) as DestinationId[]).find(
    (id) => destinationSlugs[id].nl === slug || destinationSlugs[id].en === slug,
  );
}

export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "nl";
}

function matchPattern(pattern: string, pathname: string): Record<string, string> | null {
  const a = pattern.split("/").filter(Boolean);
  const b = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (a.length !== b.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(":")) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

export function matchRoute(pathname: string): { key: RouteKey; lang: Lang; params: Record<string, string> } | null {
  const clean = pathname === "" ? "/" : pathname;
  for (const key of Object.keys(routes) as RouteKey[]) {
    for (const lang of LANGS) {
      const params = matchPattern(routes[key][lang], clean);
      if (params) return { key, lang, params };
    }
  }
  return null;
}

/** Path of the same page in the other language (used by the language switch + hreflang). */
export function alternatePath(pathname: string, target: Lang): string {
  const m = matchRoute(pathname);
  if (!m) return pathFor("home", target);
  if (m.key === "destination") {
    const id = destinationIdFromSlug(m.params.slug);
    return id ? destinationPath(id, target) : pathFor("destinations", target);
  }
  return pathFor(m.key, target, m.params);
}

/** Legacy URLs from the previous (Lovable) site → new URLs. */
export const legacyRedirects: Record<string, string> = {
  "/group-tours": "/groepsreizen",
  "/individual-tours": "/individuele-reizen",
  "/tailor-made": "/op-maat",
  "/destinations": "/bestemmingen",
  "/experience": "/de-ervaring",
  "/faq": "/veelgestelde-vragen",
};
export const legacyTripPrefix = "/tours/";
