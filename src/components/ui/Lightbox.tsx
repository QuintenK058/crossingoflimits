import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, m } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MediaKey } from "@/content/media.generated";
import { useI18n } from "@/i18n";
import { useMotionOk } from "@/hooks/useMotionOk";
import { cn } from "@/lib/utils";
import { Picture } from "./Picture";
import { NearView } from "./NearView";

export interface GalleryItem {
  image: MediaKey;
  alt: string;
  caption?: string;
  /** "contain" for maps/infographics */
  fit?: "cover" | "contain";
}

/** Grid of thumbnails + accessible lightbox (Esc, arrow keys, focus trap). */
export function Gallery({ items, className }: { items: GalleryItem[]; className?: string }) {
  const { t, fmt } = useI18n();
  const [index, setIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const ok = useMotionOk();
  const open = index !== null;
  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  const current = index !== null ? items[index] : null;

  return (
    <>
      <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4", className)}>
        {items.map((item, i) => (
          <li key={`${item.image}-${i}`} className={cn(i === 0 && "col-span-2 row-span-2")}>
            <button
              type="button"
              onClick={(e) => {
                lastTrigger.current = e.currentTarget;
                setIndex(i);
              }}
              className="group relative block aspect-[4/3] h-full w-full overflow-hidden rounded-lg bg-card"
              aria-label={fmt(t.trip.openImage, { alt: item.alt })}
            >
              <NearView className="h-full w-full">
              <Picture
                image={item.image}
                alt=""
                sizes={i === 0 ? "(min-width: 768px) 50vw, 90vw" : "(min-width: 768px) 25vw, 45vw"}
                className="h-full w-full"
                imgClassName={cn(
                  "transition-transform [transition-duration:900ms] ease-out group-hover:scale-105 motion-reduce:transition-none",
                  item.fit === "contain" && "object-contain bg-[#0e0c0b]",
                )}
              />
              </NearView>
              {item.caption && (
                <span className="absolute bottom-2 left-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium backdrop-blur">
                  {item.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm" />
          <Dialog.Content
            className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-4 outline-none md:p-10"
            aria-describedby={undefined}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              lastTrigger.current?.focus();
            }}
          >
            <Dialog.Title className="sr-only">{current?.alt}</Dialog.Title>
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <m.figure
                  key={index}
                  initial={ok ? { opacity: 0, scale: 0.98 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={ok ? { opacity: 0 } : undefined}
                  transition={{ duration: 0.3 }}
                  className="flex max-h-full w-full max-w-6xl flex-col items-center"
                >
                  <Picture
                    image={current.image}
                    alt={current.alt}
                    sizes="100vw"
                    className="max-h-[78vh] w-full"
                    imgClassName="max-h-[78vh] object-contain"
                  />
                  <figcaption className="mt-4 text-center text-sm text-foreground/80">
                    {current.caption ?? current.alt}{" "}
                    <span className="text-foreground/50">
                      ({(index ?? 0) + 1}/{items.length})
                    </span>
                  </figcaption>
                </m.figure>
              )}
            </AnimatePresence>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid size-12 place-items-center rounded-full border border-foreground/40 hover:bg-foreground hover:text-background"
                aria-label={t.common.previous}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid size-12 place-items-center rounded-full border border-foreground/40 hover:bg-foreground hover:text-background"
                aria-label={t.common.next}
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
            <Dialog.Close
              className="absolute right-4 top-4 grid size-12 place-items-center rounded-full border border-foreground/40 hover:bg-foreground hover:text-background"
              aria-label={t.common.close}
            >
              <X className="size-5" />
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
