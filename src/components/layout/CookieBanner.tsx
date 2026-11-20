import { useEffect, useState, type CSSProperties } from "react";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { LocalLink } from "@/components/ui/LocalLink";

export const COOKIE_KEY = "col-cookie-notice";

/**
 * Simple, informational cookie notice (the site only uses functional storage).
 * It is part of the prerendered HTML so it paints immediately (no late layout or
 * LCP change). An inline script in index.html hides it before first paint when
 * it was already dismissed (html.cookie-ok).
 */
export function CookieBanner() {
  const { t, lang } = useI18n();
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem(COOKIE_KEY) === "1") setShow(false);
    } catch {
      /* storage unavailable: keep showing */
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem(COOKIE_KEY, "1");
    } catch {
      /* ignore */
    }
    document.documentElement.classList.add("cookie-ok");
    setShow(false);
  };

  return (
    <section
      id="cookie-banner"
      aria-label={t.cookie.label}
      className="intro-up fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur md:inset-x-auto md:bottom-6 md:right-6"
      style={{ "--d": "0.6s" } as CSSProperties}
    >
      <p className="text-xs leading-relaxed text-foreground/85">{t.cookie.text}</p>
      <div className="mt-3 flex items-center gap-4">
        <Button size="sm" onClick={accept}>
          {t.cookie.accept}
        </Button>
        <LocalLink to={pathFor("cookies", lang)} className="text-xs underline underline-offset-4 hover:text-primary">
          {t.cookie.more}
        </LocalLink>
      </div>
    </section>
  );
}
