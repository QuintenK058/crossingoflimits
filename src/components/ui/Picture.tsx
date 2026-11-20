import { media, type MediaKey } from "@/content/media.generated";
import { cn } from "@/lib/utils";

interface PictureProps {
  image: MediaKey;
  alt: string;
  /** sizes attribute, e.g. "(min-width: 768px) 50vw, 100vw" */
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  /** Override intrinsic aspect when the image is used with object-cover */
  width?: number;
  height?: number;
}

export function srcSet(image: MediaKey, ext: "avif" | "webp" | "jpg") {
  const m = media[image];
  return m.widths.map((w) => `${m.src}-${w}.${ext} ${w}w`).join(", ");
}

/** Responsive <picture> with AVIF → WebP → JPEG, fixed dimensions (no CLS) and lazy loading. */
export function Picture({ image, alt, sizes = "100vw", priority, className, imgClassName, width, height }: PictureProps) {
  const m = media[image];
  const fallback = `${m.src}-${m.widths[Math.min(1, m.widths.length - 1)]}.jpg`;
  return (
    <picture className={cn("block", className)}>
      <source type="image/avif" srcSet={srcSet(image, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(image, "webp")} sizes={sizes} />
      <img
        src={fallback}
        srcSet={srcSet(image, "jpg")}
        sizes={sizes}
        alt={alt}
        width={width ?? m.width}
        height={height ?? m.height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        {...(priority ? { fetchpriority: "high" } : {})}
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </picture>
  );
}
