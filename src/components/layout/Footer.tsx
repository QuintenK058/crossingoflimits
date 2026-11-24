import { Mail, MessageCircle, Phone } from "lucide-react";
import { useI18n } from "@/i18n";
import { destinationPath, pathFor } from "@/lib/routes";
import { site } from "@/lib/site";
import { LocalLink } from "@/components/ui/LocalLink";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { StoLogo } from "./StoBadge";

export function Footer() {
  const { t, lang } = useI18n();
  const tours = [
    { href: pathFor("groupTours", lang), label: t.nav.groupTours },
    { href: pathFor("individualTours", lang), label: t.nav.individualTours },
    { href: pathFor("tailorMade", lang), label: t.nav.tailorMade },
    { href: pathFor("destinations", lang), label: t.nav.destinations },
    { href: destinationPath("spain", lang), label: t.common.spain },
    { href: destinationPath("morocco", lang), label: t.common.morocco },
  ];
  const info = [
    { href: pathFor("experience", lang), label: t.nav.experience },
    { href: pathFor("faq", lang), label: t.faqPage.title },
    { href: pathFor("plan", lang), label: t.common.planCta },
    { href: pathFor("contact", lang), label: t.nav.contact },
    { href: pathFor("guarantee", lang), label: t.meta.guarantee.title.split(" | ")[0] },
    { href: pathFor("terms", lang), label: t.meta.terms.title.split(" | ")[0] },
    { href: pathFor("privacy", lang), label: t.meta.privacy.title.split(" | ")[0] },
    { href: pathFor("cookies", lang), label: t.meta.cookies.title.split(" | ")[0] },
  ];
  const year = new Date().getFullYear();

  return (
    <footer className="theme-dark relative overflow-hidden bg-background pt-20 text-sm text-foreground md:pt-28">
      <div className="container">
        <div className="grid-12">
          <div className="col-span-4 md:col-span-12 lg:col-span-4">
            <LocalLink to={pathFor("home", lang)} aria-label={t.nav.logoLabel} className="block h-24 w-fit">
              <Logo sizes="114px" />
            </LocalLink>
            <p className="mt-6 max-w-sm leading-relaxed text-foreground/75">{t.footer.about}</p>
            <p className="serif-accent mt-6 text-2xl text-accent">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.footer.tours} className="col-span-2 md:col-span-4 lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground [font-stretch:100%]">{t.footer.tours}</h2>
            <ul className="mt-5 space-y-3">
              {tours.map((l) => (
                <li key={l.href}>
                  <LocalLink to={l.href} className="link-underline text-foreground/80 hover:text-foreground">
                    {l.label}
                  </LocalLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={t.footer.info} className="col-span-2 md:col-span-4 lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground [font-stretch:100%]">{t.footer.info}</h2>
            <ul className="mt-5 space-y-3">
              {info.map((l) => (
                <li key={l.href}>
                  <LocalLink to={l.href} className="link-underline text-foreground/80 hover:text-foreground">
                    {l.label}
                  </LocalLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="col-span-4 md:col-span-4 lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground [font-stretch:100%]">{t.footer.contact}</h2>
            <ul className="mt-5 space-y-3 text-foreground/75">
              <li>
                <a href={`mailto:${site.email}`} className="link-underline hover:text-foreground">
                  <Mail className="size-4 text-accent" aria-hidden="true" /> {site.email}
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="link-underline hover:text-foreground">
                  <Phone className="size-4 text-accent" aria-hidden="true" /> {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-foreground">
                  <MessageCircle className="size-4 text-accent" aria-hidden="true" /> {t.footer.whatsapp}
                  <span className="sr-only">{t.common.opensInNewTab}</span>
                </a>
              </li>
              <li>
                {t.footer.kvk} {site.kvk}
              </li>
            </ul>
            {site.socials.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xs font-semibold uppercase tracking-eyebrow text-muted-foreground">{t.footer.social}</h2>
                <ul className="mt-3 flex gap-4">
                  {site.socials.map((s) => (
                    <li key={s.href}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline text-foreground/80 hover:text-foreground">
                        {s.label}
                        <span className="sr-only"> {t.common.opensInNewTab}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <a
              href={site.stoGarant.participants}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center gap-4 rounded-lg bg-sand p-3 pr-4 text-[hsl(var(--ink))] transition-transform duration-300 hover:-translate-y-0.5"
            >
              <span className="w-12">
                <StoLogo />
              </span>
              <span className="text-xs font-semibold leading-snug">
                {t.footer.stoTitle}
                <span className="sr-only"> {t.common.opensInNewTab}</span>
              </span>
            </a>
          </div>
        </div>

        <div
          aria-hidden="true"
          data-word="Crossing of Limits"
          className="font-display pointer-events-none mt-20 select-none whitespace-nowrap text-center text-[clamp(2rem,9.6vw,9.5rem)] leading-[0.85] tracking-[-0.06em] text-foreground/[0.09] [font-stretch:125%] before:content-[attr(data-word)]"
        />
        <div className="flex flex-col-reverse items-start justify-between gap-6 border-t border-border py-8 text-xs text-foreground/70 md:flex-row md:items-center">
          <p>
            © {year} {site.name}. {t.footer.rights} {t.footer.kvk} {site.kvk}.
          </p>
          <LanguageSwitch />
        </div>
      </div>
    </footer>
  );
}
