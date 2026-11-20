import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { LinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LocalLink } from "./LocalLink";

/**
 * Buttons with a "fill" hover animation: a layer scales in from the left
 * (transform only – no layout shift).
 */
export const buttonVariants = cva(
  "group/btn relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full text-center font-semibold tracking-wide transition-colors duration-300 ease-out disabled:pointer-events-none disabled:opacity-60 before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:rounded-[inherit] before:transition-transform before:duration-500 before:ease-out hover:before:scale-x-100 focus-visible:before:scale-x-100 motion-reduce:before:transition-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 hover:[&_svg]:translate-x-0.5",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground before:bg-foreground",
        outline:
          "border border-foreground/60 text-foreground before:bg-foreground hover:text-background focus-visible:text-background",
        ghost: "text-foreground before:bg-foreground/10",
        dark: "bg-background text-foreground before:bg-primary hover:text-primary-foreground focus-visible:text-primary-foreground",
        sandOutline:
          "border border-sand-foreground/70 text-sand-foreground before:bg-sand-foreground hover:text-sand focus-visible:text-sand",
      },
      size: {
        sm: "min-h-10 px-4 py-2 text-sm",
        md: "min-h-12 px-6 py-3 text-sm",
        lg: "min-h-14 px-7 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonVariants>;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, Variants {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, asChild, ...props },
  ref,
) {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});

export function ButtonLink({
  className,
  variant,
  size,
  children,
  ...props
}: LinkProps & Variants & { children: ReactNode }) {
  return (
    <LocalLink className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {children}
    </LocalLink>
  );
}
