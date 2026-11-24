import { brand } from "@/content/media.generated";
import { cn } from "@/lib/utils";

/** The existing Crossing of Limits badge logo (rider at sunset). */
export function Logo({ className, size = 160, priority, sizes }: { className?: string; size?: 160 | 320 | 640; priority?: boolean; sizes?: string }) {
  const h = Math.round((brand.logo.height / brand.logo.width) * size);
  return (
    <picture className={cn("block h-full", className)}>
      <source
        type="image/webp"
        srcSet={`${brand.logo.src}-160.webp 160w, ${brand.logo.src}-240.webp 240w, ${brand.logo.src}-320.webp 320w, ${brand.logo.src}-640.webp 640w`}
        sizes={sizes ?? (size === 160 ? "(min-width: 768px) 68px, 57px" : `${size}px`)}
      />
      <img
        src={`${brand.logo.src}-${size}.png`}
        alt=""
        width={size}
        height={h}
        className="h-full w-auto"
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
    </picture>
  );
}
