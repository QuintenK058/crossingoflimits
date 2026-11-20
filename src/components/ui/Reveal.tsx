import { m, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useMotionOk } from "@/hooks/useMotionOk";

const ease = [0.22, 1, 0.36, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

type Tag = "div" | "section" | "li" | "ul" | "ol" | "dl" | "article" | "header" | "p" | "span";

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: Tag;
  delay?: number;
  /** distance in px */
  y?: number;
  id?: string;
  "aria-labelledby"?: string;
}

/** Fade + slide up once when scrolled into view. Disabled for reduced motion. */
export function Reveal({ children, className, as = "div", delay = 0, y = 28, id, "aria-labelledby": labelledBy }: RevealProps) {
  const ok = useMotionOk();
  if (!ok) {
    const Tag = as;
    return (
      <Tag className={className} id={id} aria-labelledby={labelledBy}>
        {children}
      </Tag>
    );
  }
  const Comp = m[as];
  return (
    <Comp
      id={id}
      aria-labelledby={labelledBy}
      data-reveal=""
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </Comp>
  );
}

/** Parent that staggers its RevealItem children. */
export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.1,
}: {
  children: ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
}) {
  const ok = useMotionOk();
  if (!ok) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const Comp = m[as];
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </Comp>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: Tag }) {
  const ok = useMotionOk();
  if (!ok) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const Comp = m[as];
  return (
    <Comp data-reveal="" className={className} variants={item}>
      {children}
    </Comp>
  );
}
