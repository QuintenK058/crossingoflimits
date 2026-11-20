import type { ComponentType } from "react";

/**
 * Minimal preloadable lazy component. Unlike React.lazy, once the module is
 * loaded it renders synchronously – required for prerender + hydration without
 * a Suspense flash.
 */
export type LazyPage = ComponentType & { preload: () => Promise<unknown> };

export function lazyPage(loader: () => Promise<{ default: ComponentType }>): LazyPage {
  let Loaded: ComponentType | null = null;
  let promise: Promise<unknown> | null = null;
  const preload = () =>
    (promise ??= loader().then((m) => {
      Loaded = m.default;
    }));
  const Lazy = () => {
    if (Loaded) return <Loaded />;
    throw preload();
  };
  const page = Lazy as unknown as LazyPage;
  page.preload = preload;
  return page;
}
