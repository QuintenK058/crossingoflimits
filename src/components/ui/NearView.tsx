import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders children only when the placeholder comes within `margin` of the
 * viewport. Stricter than native lazy loading (which starts thousands of pixels
 * early on slow connections) – used for heavy below-the-fold galleries.
 */
export function NearView({ children, className, margin = "400px" }: { children: ReactNode; className?: string; margin?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return (
    <div ref={ref} className={className}>
      {show ? children : null}
    </div>
  );
}
