import { forwardRef } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { preloadPath } from "@/pages/registry";

/** Router link that preloads the target page chunk on hover / focus / touch. */
export const LocalLink = forwardRef<HTMLAnchorElement, LinkProps>(function LocalLink(
  { to, onMouseEnter, onFocus, onTouchStart, ...rest },
  ref,
) {
  const path = typeof to === "string" ? to.split("?")[0].split("#")[0] : (to.pathname ?? "");
  const preload = () => {
    void preloadPath(path);
  };
  return (
    <Link
      ref={ref}
      to={to}
      onMouseEnter={(e) => {
        preload();
        onMouseEnter?.(e);
      }}
      onFocus={(e) => {
        preload();
        onFocus?.(e);
      }}
      onTouchStart={(e) => {
        preload();
        onTouchStart?.(e);
      }}
      {...rest}
    />
  );
});
