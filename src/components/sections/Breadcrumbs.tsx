import { ChevronRight } from "lucide-react";
import { useI18n } from "@/i18n";
import { LocalLink } from "@/components/ui/LocalLink";
import { cn } from "@/lib/utils";

export interface Crumb {
  name: string;
  path: string;
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t.common.breadcrumb} className={cn("text-xs text-foreground/75", className)}>
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-1.5">
              {last ? (
                <span aria-current="page" className="text-foreground">
                  {c.name}
                </span>
              ) : (
                <>
                  <LocalLink to={c.path} className="hover:text-primary">
                    {c.name}
                  </LocalLink>
                  <ChevronRight className="size-3 opacity-60" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
