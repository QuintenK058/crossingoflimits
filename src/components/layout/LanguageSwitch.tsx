import { useLocation } from "react-router-dom";
import { useI18n } from "@/i18n";
import { alternatePath, LANGS } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { LocalLink } from "@/components/ui/LocalLink";

export function rememberLang(lang: string) {
  try {
    localStorage.setItem("col-lang", lang);
  } catch {
    /* storage unavailable */
  }
}

/** NL / EN toggle – links to the same page in the other language. */
export function LanguageSwitch({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { lang, t } = useI18n();
  const { pathname, search } = useLocation();
  return (
    <nav aria-label={t.nav.language} className={cn("flex items-center gap-1 text-xs font-semibold", className)}>
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <LocalLink
            key={l}
            to={alternatePath(pathname, l) + (pathname.endsWith("/plan") ? search : "")}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              rememberLang(l);
              onNavigate?.();
            }}
            className={cn(
              "grid h-8 min-w-9 place-items-center rounded-full px-2 uppercase tracking-wider transition-colors",
              active ? "bg-foreground text-background" : "text-current hover:bg-foreground/10",
            )}
          >
            {l}
            {!active && <span className="sr-only"> – {t.nav.switchTo}</span>}
          </LocalLink>
        );
      })}
    </nav>
  );
}
