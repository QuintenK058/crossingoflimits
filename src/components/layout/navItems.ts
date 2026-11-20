import type { Dict } from "@/i18n/nl";
import { pathFor, type Lang, type RouteKey } from "@/lib/routes";

export const navKeys: { key: RouteKey; label: (t: Dict) => string }[] = [
  { key: "groupTours", label: (t) => t.nav.groupTours },
  { key: "individualTours", label: (t) => t.nav.individualTours },
  { key: "tailorMade", label: (t) => t.nav.tailorMade },
  { key: "destinations", label: (t) => t.nav.destinations },
  { key: "experience", label: (t) => t.nav.experience },
  { key: "faq", label: (t) => t.nav.faq },
  { key: "contact", label: (t) => t.nav.contact },
];

export const navItems = (t: Dict, lang: Lang) => navKeys.map((n) => ({ href: pathFor(n.key, lang), label: n.label(t) }));
