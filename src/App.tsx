import { AnimatePresence, domAnimation, LazyMotion, m, MotionConfig } from "framer-motion";
import { Suspense, useCallback, useEffect, useRef } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { I18nProvider, useI18n } from "@/i18n";
import { langFromPath, LANGS, legacyRedirects, routes, type RouteKey } from "@/lib/routes";
import { pages } from "@/pages/registry";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { getLenis, scrollToTop, SmoothScroll } from "@/components/layout/SmoothScroll";
import { isHydrated, markHydrated, prefersReducedMotion } from "@/lib/motion";

function LegacyTripRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/reizen/${slug ?? ""}`} replace />;
}

function SiteRoutes({ location }: { location: ReturnType<typeof useLocation> }) {
  return (
    <Routes location={location}>
      {(Object.keys(routes) as RouteKey[]).flatMap((key) =>
        LANGS.map((lang) => {
          const Page = pages[key];
          return <Route key={`${key}-${lang}`} path={routes[key][lang]} element={<Page />} />;
        }),
      )}
      {Object.entries(legacyRedirects).map(([from, to]) => (
        <Route key={from} path={from} element={<Navigate to={to} replace />} />
      ))}
      <Route path="/tours/:slug" element={<LegacyTripRedirect />} />
      <Route path="*" element={<pages.notFound />} />
    </Routes>
  );
}

function SkipLink() {
  const { t } = useI18n();
  return (
    <a
      href="#main"
      className="sr-only-focusable fixed left-4 top-4 z-[100] rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground"
    >
      {t.common.skipToContent}
    </a>
  );
}

function SiteShell() {
  const location = useLocation();
  // Read (not subscribed): during hydration this must match the server render (true).
  const ok = isHydrated() ? !prefersReducedMotion() : true;
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  const afterNavigate = useCallback(() => {
    const lenis = getLenis();
    if (location.hash) {
      const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (el) {
        if (lenis) lenis.scrollTo(el, { offset: -90, immediate: true });
        else el.scrollIntoView();
        return;
      }
    }
    scrollToTop();
    mainRef.current?.focus({ preventScroll: true });
  }, [location.hash]);

  useEffect(() => {
    markHydrated();
  }, []);

  // Hash links on first load
  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (location.hash) window.setTimeout(afterNavigate, 50);
    }
  }, [afterNavigate, location.hash]);

  // Reduced motion: no exit animation → scroll immediately
  const prevPath = useRef(location.pathname);
  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;
    if (!ok) afterNavigate();
  }, [location.pathname, ok, afterNavigate]);

  return (
    <>
      <SkipLink />
      <Navbar />
      <AnimatePresence mode="wait" initial={false} onExitComplete={ok ? afterNavigate : undefined}>
        <m.main
          key={location.pathname}
          ref={mainRef}
          id="main"
          tabIndex={-1}
          className="outline-none"
          initial={ok ? { opacity: 0, y: 16 } : false}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
          exit={ok ? { opacity: 0, y: -10, transition: { duration: 0.22, ease: "easeIn" } } : undefined}
        >
          <Suspense fallback={<div className="min-h-[100svh]" aria-busy="true" />}>
            <SiteRoutes location={location} />
          </Suspense>
        </m.main>
      </AnimatePresence>
      <Footer />
      <CookieBanner />
    </>
  );
}

function AdminShell() {
  const { pathname } = useLocation();
  const Page = pathname.startsWith("/admin") ? pages.admin : pages.auth;
  return (
    <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
      <Page />
    </Suspense>
  );
}

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname === "/admin" || pathname === "/auth" || pathname.startsWith("/admin/");
  const lang = langFromPath(pathname);
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <I18nProvider lang={lang}>
          {isAdmin ? (
            <AdminShell />
          ) : (
            <>
              <SmoothScroll />
              <SiteShell />
            </>
          )}
        </I18nProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
