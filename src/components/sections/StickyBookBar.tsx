import { AnimatePresence, m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";

/**
 * Mobile-only booking bar: slides in after the hero, hides again when the
 * footer comes into view. Fixed position → no layout shift.
 */
export function StickyBookBar({ label, price, to, cta }: { label: string; price: string; to: string; cta: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let footerVisible = false;
    const update = () => setShow(window.scrollY > window.innerHeight * 0.8 && !footerVisible);
    const footer = document.querySelector("footer");
    const io = new IntersectionObserver(([e]) => {
      footerVisible = e.isIntersecting;
      update();
    });
    if (footer) io.observe(footer);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          exit={{ y: "110%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:hidden"
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs leading-tight text-muted-foreground">
              {label}
              <span className="block font-display text-xl text-foreground">{price}</span>
            </p>
            <ButtonLink to={to} size="sm" variant="accent">
              {cta} <ArrowRight aria-hidden="true" />
            </ButtonLink>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
