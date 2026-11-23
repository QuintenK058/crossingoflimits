import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  align = "left",
  as: Tag = "h2",
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
  align?: "left" | "center";
  as?: "h2" | "h3";
  id?: string;
}) {
  return (
    <div className={cn("grid-12 items-end", align === "center" && "text-center", className)}>
      <Reveal className={cn("col-span-4", lead ? "md:col-span-8" : "md:col-span-10", align === "center" && "md:col-span-12")}>
        {eyebrow && <p className="eyebrow mb-6">{eyebrow}</p>}
        <Tag id={id} className="heading-2 text-balance">
          {title}
        </Tag>
      </Reveal>
      {lead && (
        <Reveal delay={0.1} className="col-span-4 md:col-span-4 md:pb-1">
          <p className="lead text-pretty">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
