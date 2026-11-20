import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Lang } from "@/lib/routes";
import type { Localized } from "@/content/types";
import { nl, type Dict } from "./nl";
import { en } from "./en";

export const dictionaries: Record<Lang, Dict> = { nl, en };

/** Replace {placeholders} in a string. */
export function fmt(template: string, vars: Record<string, string | number> = {}) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

interface I18nValue {
  lang: Lang;
  t: Dict;
  fmt: typeof fmt;
  /** Pick the right language from a {nl, en} content object. */
  l: (value: Localized) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const value = useMemo<I18nValue>(
    () => ({ lang, t: dictionaries[lang], fmt, l: (v) => v[lang] }),
    [lang],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
