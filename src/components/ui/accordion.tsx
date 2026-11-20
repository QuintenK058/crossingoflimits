import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from "react";
import { cn } from "@/lib/utils";

/** shadcn/ui accordion (Radix) – fully keyboard accessible. */
export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b border-current/15", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & { headingLevel?: "h2" | "h3" | "h4" }
>(({ className, children, headingLevel = "h3", ...props }, ref) => {
  const Heading = headingLevel;
  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="m-0 font-sans normal-case tracking-normal">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            "group flex w-full items-center justify-between gap-6 py-5 text-left text-base font-semibold leading-snug transition-colors hover:text-primary md:text-lg [&[data-state=open]>span>svg]:rotate-45",
            className,
          )}
          {...props}
        >
          {children}
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-current/25 transition-colors group-hover:border-primary"
          >
            <Plus className="size-4 transition-transform duration-300 ease-out" />
          </span>
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-base data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-6 pr-12 leading-relaxed opacity-85", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";
