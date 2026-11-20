import { lazyPage, type LazyPage } from "@/lib/lazy";
import { legacyRedirects, legacyTripPrefix, matchRoute, type RouteKey } from "@/lib/routes";

/** Every page is its own chunk. */
export const pages: Record<RouteKey, LazyPage> & { notFound: LazyPage; admin: LazyPage; auth: LazyPage } = {
  home: lazyPage(() => import("./Home")),
  groupTours: lazyPage(() => import("./GroupTours")),
  individualTours: lazyPage(() => import("./IndividualTours")),
  tailorMade: lazyPage(() => import("./TailorMade")),
  destinations: lazyPage(() => import("./Destinations")),
  destination: lazyPage(() => import("./DestinationDetail")),
  trip: lazyPage(() => import("./TripDetail")),
  experience: lazyPage(() => import("./Experience")),
  faq: lazyPage(() => import("./Faq")),
  plan: lazyPage(() => import("./Plan")),
  contact: lazyPage(() => import("./Contact")),
  guarantee: lazyPage(() => import("./Guarantee")),
  terms: lazyPage(() => import("./Terms")),
  privacy: lazyPage(() => import("./Privacy")),
  cookies: lazyPage(() => import("./Cookies")),
  notFound: lazyPage(() => import("./NotFound")),
  admin: lazyPage(() => import("@/admin/AdminPage")),
  auth: lazyPage(() => import("@/admin/AuthPage")),
};

export function isLegacyPath(pathname: string) {
  return pathname in legacyRedirects || pathname.startsWith(legacyTripPrefix);
}

export function pageForPath(pathname: string): LazyPage | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (clean === "/admin") return pages.admin;
  if (clean === "/auth") return pages.auth;
  if (isLegacyPath(clean)) return null;
  const m = matchRoute(clean);
  return m ? pages[m.key] : pages.notFound;
}

export function preloadPath(pathname: string): Promise<unknown> {
  const p = pageForPath(pathname);
  return p ? p.preload() : Promise.resolve();
}
