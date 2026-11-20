import { brand } from "@/content/media.generated";
import { cn } from "@/lib/utils";

/** The existing Crossing of Limits badge logo (rider at sunset). */
export function Logo({ className, size = 160, priority }: { className?: string; size?: 160 | 320 | 640; priority?: boolean }) {
  const h = Math.round((brand.logo.height / brand.logo.width) * size);
  return (
    <picture className={cn("block h-full", className)}>
      <source type="image/webp" srcSet={size === 160 ? `${brand.logo.src}-160.webp 1x, ${brand.logo.src}-240.webp 1.5x, ${brand.logo.src}-320.webp 2x` : `${brand.logo.src}-${size}.webp 1x, ${brand.logo.src}-${Math.min(size * 2, 640)}.webp 2x`} />
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
