import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBrowser = typeof window !== "undefined";

/** Values in content files that still need to be filled in start with TODO_. */
export function isPlaceholder(value: unknown): boolean {
  return typeof value === "string" && value.startsWith("TODO_");
}

export function formatPrice(value: number, lang: "nl" | "en") {
  return new Intl.NumberFormat(lang === "nl" ? "nl-NL" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
