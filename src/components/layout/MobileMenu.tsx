import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "framer-motion";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { site } from "@/lib/site";
import { useMotionOk } from "@/hooks/useMotionOk";
import { LocalLink } from "@/components/ui/LocalLink";
import { ButtonLink } from "@/components/ui/button";
import { LanguageSwitch } from "./LanguageSwitch";
import { navItems } from "./navItems";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fullscreen overlay menu with staggered links. Radix handles focus trap + Esc. */
export function MobileMenu({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t, lang } = useI18n();
  const ok = useMotionOk();
  const close = () => onOpenChange(false);
  const items = [{ href: pathFor("home", lang), label: t.common.home }, ...navItems(t, lang)];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Content forceMount asChild aria-describedby={undefined}>
              <m.div
                id="mobile-menu"
                className="theme-dark grain fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-background text-foreground"
                initial={ok ? { y: "-100%" } : false}
                animate={{ y: "0%" }}
                exit={ok ? { y: "-100%", transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } } : undefined}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              >
                <Dialog.Title className="sr-only">{t.nav.menu}</Dialog.Title>
                <div className="container flex h-[var(--nav-h)] shrink-0 items-center justify-between">
                  <LanguageSwitch onNavigate={close} />
                  <Dialog.Close
                    className="grid size-11 place-items-center rounded-full border border-foreground/30 hover:bg-foreground hover:text-background"
                    aria-label={t.nav.closeMenu}
                  >
                    <X className="size-5" />
                  </Dialog.Close>
                </div>
                <nav aria-label={t.nav.main} className="container flex flex-1 flex-col justify-center py-8">
                  <m.ul
                    className="space-y-1"
                    initial={ok ? "hidden" : false}
                    animate="show"
                    variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } } }}
                  >
                    {items.map((item, i) => (
                      <li key={item.href} className="overflow-hidden">
                        <m.div
                          variants={{
                            hidden: { y: "110%" },
                            show: { y: "0%", transition: { duration: 0.7, ease } },
                          }}
                        >
                          <LocalLink
                            to={item.href}
                            onClick={close}
                            className="font-display group flex items-baseline gap-4 py-1 text-[clamp(2.2rem,9vw,4rem)] leading-[1.02] transition-colors hover:text-accent"
                          >
                            <span className="serif-accent text-base text-foreground/50">{String(i + 1).padStart(2, "0")}</span>
                            {item.label}
                          </LocalLink>
                        </m.div>
                      </li>
                    ))}
                  </m.ul>
                  <m.div
                    initial={ok ? { opacity: 0, y: 16 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5, ease }}
                    className="mt-10 space-y-6"
                  >
                    <ButtonLink to={pathFor("plan", lang)} size="lg" variant="accent" onClick={close}>
                      {t.common.planCta}
                    </ButtonLink>
                    <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-foreground/80">
                      <li>
                        <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-accent">
                          <Mail className="size-4" aria-hidden="true" /> {site.email}
                        </a>
                      </li>
                      <li>
                        <a href={site.phoneHref} className="inline-flex items-center gap-2 hover:text-accent">
                          <Phone className="size-4" aria-hidden="true" /> {site.phoneDisplay}
                        </a>
                      </li>
                      <li>
                        <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-accent">
                          <MessageCircle className="size-4" aria-hidden="true" /> {t.footer.whatsapp}
                          <span className="sr-only">{t.common.opensInNewTab}</span>
                        </a>
                      </li>
                    </ul>
                  </m.div>
                </nav>
              </m.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
