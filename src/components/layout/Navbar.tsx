import { useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { ButtonLink } from "@/components/ui/button";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { LocalLink } from "@/components/ui/LocalLink";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { navItems } from "./navItems";

// Loaded on first open – keeps Radix Dialog out of the initial bundle.
const MobileMenu = lazy(() => import("./MobileMenu").then((m) => ({ default: m.MobileMenu })));

/**
 * Transparent over the hero, solid + blur after scrolling.
 * Hides when scrolling down, re-appears when scrolling up.
 */
export function Navbar() {
  const { t, lang } = useI18n();
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuLoaded, setMenuLoaded] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    if (menuOpen) return;
    if (y > 160 && y > prev + 4) setHidden(true);
    else if (y < prev - 4 || y < 160) setHidden(false);
  });

  const items = navItems(t, lang);
  const planPath = pathFor("plan", lang);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-out motion-reduce:transition-none",
        hidden && !menuOpen ? "-translate-y-full" : "translate-y-0",
        scrolled
          ? "bg-background/85 shadow-[0_1px_0_hsl(var(--border))] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
          : "bg-transparent",
      )}
    >
      <div className="container relative flex h-[var(--nav-h)] items-center justify-between gap-6">
        <LocalLink to={pathFor("home", lang)} aria-label={t.nav.logoLabel} className="h-12 shrink-0 md:h-14">
          <Logo priority />
        </LocalLink>

        <nav aria-label={t.nav.main} className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "relative rounded-full px-3 py-2 text-[13px] font-medium text-foreground/80 transition-colors [font-stretch:105%] hover:text-foreground",
                      "after:absolute after:inset-x-3 after:bottom-1 after:h-[2px] after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100",
                      (isActive || pathname.startsWith(item.href + "/")) && "text-foreground after:scale-x-100",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitch className="hidden sm:flex" />
          <ButtonLink to={planPath} size="sm" variant="accent" className="hidden md:inline-flex">
            {t.common.planCta}
          </ButtonLink>
          <button
            type="button"
            onClick={() => {
              setMenuLoaded(true);
              setMenuOpen(true);
            }}
            onPointerEnter={() => setMenuLoaded(true)}
            className="grid size-11 place-items-center rounded-full bg-foreground text-background transition-colors hover:bg-primary hover:text-[hsl(var(--ink))] xl:hidden"
            aria-label={t.nav.openMenu}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>
      {menuLoaded && (
        <Suspense fallback={null}>
          <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
        </Suspense>
      )}
    </header>
  );
}
