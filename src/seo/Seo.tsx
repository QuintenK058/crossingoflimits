import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";
import { alternatePath, LANGS } from "@/lib/routes";
import { site } from "@/lib/site";
import { useHead, type HeadData } from "./head";

interface SeoProps {
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  /** Set false for pages without a translated counterpart (e.g. 404) */
  alternates?: boolean;
  jsonLd?: object[];
  preload?: HeadData["preload"];
  type?: HeadData["type"];
}

export const absoluteUrl = (path: string) => `${site.url}${path === "/" ? "/" : path}`;

export function Seo({ title, description, image, imageAlt, noindex, alternates = true, jsonLd, preload, type }: SeoProps) {
  const { lang } = useI18n();
  const { pathname } = useLocation();
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  useHead({
    title,
    description,
    lang,
    canonical: noindex ? undefined : absoluteUrl(clean),
    alternates:
      alternates && !noindex
        ? [
            ...LANGS.map((l) => ({ hreflang: l, href: absoluteUrl(alternatePath(clean, l)) })),
            { hreflang: "x-default", href: absoluteUrl(alternatePath(clean, "nl")) },
          ]
        : [],
    image: image ?? `${site.url}/og-image.jpg`,
    imageAlt: imageAlt ?? "Crossing of Limits – motorreizen door Spanje en Marokko",
    noindex,
    jsonLd,
    preload,
    type,
  });
  return null;
}
