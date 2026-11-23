import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const inputClass =
  "block w-full rounded-lg border border-input bg-background/60 px-4 py-3 text-base text-foreground placeholder:text-foreground/45 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30";

interface FieldProps {
  id: string;
  label: ReactNode;
  error?: string;
  hint?: ReactNode;
  required?: boolean;
  requiredLabel?: string;
  children: ReactNode;
  className?: string;
}

/** Label + control + hint + error, wired with aria-describedby. */
export function Field({ id, label, error, hint, required, requiredLabel, children, className }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
        {required && (
          <span className="ml-1 text-accent" aria-hidden="true">
            *
          </span>
        )}
        {required && requiredLabel && <span className="sr-only"> ({requiredLabel})</span>}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-foreground/70">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export const describedBy = (id: string, error?: string, hint?: boolean) =>
  [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...p }, ref) {
  return <input ref={ref} className={cn(inputClass, className)} {...p} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea({ className, ...p }, ref) {
  return <textarea ref={ref} className={cn(inputClass, "min-h-32 resize-y", className)} {...p} />;
});

const SELECT_ARROW =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23F3EBDD' stroke-width='2' viewBox='0 0 24 24'><path d='m6 9 6 6 6-6'/></svg>\")";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select({ className, children, ...p }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        inputClass,
        "appearance-none bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10",
        className,
      )}
      style={{ backgroundImage: SELECT_ARROW, ...p.style }}
      {...p}
    >
      {children}
    </select>
  );
});

/** Visually a card, semantically a native radio input (keyboard + screen reader friendly). */
export const RadioCard = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { title: string; text?: string; icon?: ReactNode }
>(function RadioCard({ title, text, icon, className, id, ...p }, ref) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "relative flex cursor-pointer gap-4 rounded-xl border border-input bg-background/40 p-5 transition-colors hover:border-foreground/60 has-[:checked]:border-primary has-[:checked]:bg-primary/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary",
        className,
      )}
    >
      <input ref={ref} type="radio" id={id} className="peer sr-only" {...p} />
      {icon && <span className="text-accent">{icon}</span>}
      <span className="flex-1">
        <span className="block font-semibold">{title}</span>
        {text && <span className="mt-1 block text-sm text-foreground/75">{text}</span>}
      </span>
      <span
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 rounded-full border-2 border-foreground/50 transition peer-checked:border-[6px] peer-checked:border-primary"
      />
    </label>
  );
});

/** Pill-style radio for short choices. */
export const RadioPill = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: string }>(function RadioPill(
  { label, id, className, ...p },
  ref,
) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "inline-flex h-11 cursor-pointer items-center rounded-full border border-input px-5 text-sm font-medium transition-colors hover:border-foreground/60 has-[:checked]:border-primary has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background",
        className,
      )}
    >
      <input ref={ref} type="radio" id={id} className="sr-only" {...p} />
      {label}
    </label>
  );
});

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label: ReactNode }>(function Checkbox(
  { label, id, className, ...p },
  ref,
) {
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <input
        ref={ref}
        type="checkbox"
        id={id}
        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded border-input accent-[hsl(var(--primary))]"
        {...p}
      />
      <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed">
        {label}
      </label>
    </div>
  );
});
