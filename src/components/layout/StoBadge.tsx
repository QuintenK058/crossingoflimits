import { brand } from "@/content/media.generated";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

export function StoLogo({ className, size = 96 }: { className?: string; size?: 96 | 192 }) {
  const { t } = useI18n();
  const h = Math.round((brand.sto.height / brand.sto.width) * size);
  return (
    <picture className={cn("block shrink-0", className)}>
      <source type="image/webp" srcSet={`${brand.sto.src}-${size}.webp 1x, ${brand.sto.src}-192.webp 2x`} />
      <img src={`${brand.sto.src}-${size}.png`} alt={t.common.stoLogoAlt} width={size} height={h} loading="lazy" decoding="async" className="h-auto w-full" />
    </picture>
  );
}

/** The mandatory STO Garant notice shown with every offer. */
export function StoNotice({ className }: { className?: string }) {
  const { t } = useI18n();
  return (
    <p className={cn("text-xs leading-relaxed opacity-75", className)}>
      {t.common.stoNotice} (
      <a href="https://www.sto-garant.nl/downloads" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
        www.sto-garant.nl/downloads<span className="sr-only"> {t.common.opensInNewTab}</span>
      </a>
      ).
    </p>
  );
}
