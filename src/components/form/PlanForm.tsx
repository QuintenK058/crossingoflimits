import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Map, Users, Wand2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { isRateLimited, looksLikeBot, recordSubmit } from "@/lib/antispam";
import { publishedTrips } from "@/content/trips";
import { useMotionOk } from "@/hooks/useMotionOk";
import { Button, ButtonLink } from "@/components/ui/button";
import { LocalLink } from "@/components/ui/LocalLink";
import { Checkbox, Field, Input, RadioCard, RadioPill, Select, Textarea, describedBy } from "./fields";
import { BIKE, CONTACT_PREF, EXPERIENCE, REGIONS, STEP_FIELDS, TRIP_FORMS, planDefaults, planSchema, type PlanValues } from "./planSchema";
import { submitPlan } from "./submitPlan";

const RATE_KEY = "col-plan-submits";
const ease = [0.22, 1, 0.36, 1] as const;

export interface PlanPrefill {
  reisvorm?: PlanValues["reisvorm"];
  reis?: string;
  land?: PlanValues["land"];
}

export function PlanForm({ prefill }: { prefill: PlanPrefill }) {
  const { t, l, lang, fmt } = useI18n();
  const ok = useMotionOk();
  const f = t.plan.fields;
  const schema = useMemo(() => planSchema(t), [t]);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef(Date.now());
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const form = useForm<PlanValues>({
    resolver: zodResolver(schema),
    defaultValues: { ...planDefaults, ...prefill },
    mode: "onTouched",
  });
  const { register, handleSubmit, trigger, watch, setValue, getValues, setError, formState, reset } = form;
  const errors = formState.errors as FieldErrors<PlanValues>;

  // Apply prefill from the URL (?reis=… / ?reisvorm=…) after hydration
  useEffect(() => {
    if (prefill.reisvorm) setValue("reisvorm", prefill.reisvorm);
    if (prefill.reis) setValue("reis", prefill.reis);
    if (prefill.land) setValue("land", prefill.land);
  }, [prefill.reisvorm, prefill.reis, prefill.land, setValue]);

  const land = watch("land");
  const reis = watch("reis");
  const motor = watch("motor");
  const reisvorm = watch("reisvorm");

  // Keep destination in sync with a chosen trip
  useEffect(() => {
    const trip = publishedTrips.find((x) => x.slug === reis);
    if (trip) setValue("land", trip.country === "spain" ? "Spain" : "Morocco");
  }, [reis, setValue]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    stepHeading.current?.focus();
  }, [step]);

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const steps = [t.plan.steps.form, t.plan.steps.trip, t.plan.steps.bike, t.plan.steps.contact];
  const total = steps.length;

  const next = async () => {
    const valid = await trigger(STEP_FIELDS[step], { shouldFocus: true });
    if (!valid) return;
    // Cross-field check (zod's superRefine only runs once the whole form is valid)
    if (step === 1) {
      const start = getValues("reis_start");
      const end = getValues("reis_eind");
      if (start && end && end < start) {
        setError("reis_eind", { message: t.plan.errors.endBeforeStart }, { shouldFocus: true });
        return;
      }
    }
    setDir(1);
    setStep((s) => Math.min(s + 1, total - 1));
  };
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = handleSubmit(
    async (values) => {
      setServerError("");
      if (looksLikeBot(values.website, startedAt.current)) {
        // Pretend success for bots, store nothing.
        setStatus("success");
        return;
      }
      if (isRateLimited(RATE_KEY)) {
        setServerError(t.plan.errors.rateLimited);
        return;
      }
      setStatus("submitting");
      try {
        await submitPlan(values, lang);
        recordSubmit(RATE_KEY);
        setStatus("success");
      } catch (e) {
        console.error(e);
        setServerError(t.plan.errors.submit);
        setStatus("error");
      }
    },
    (errs) => {
      // Jump back to the first step that has an error
      const idx = STEP_FIELDS.findIndex((fields) => fields.some((k) => k in errs));
      if (idx >= 0 && idx !== step) {
        setDir(-1);
        setStep(idx);
      }
    },
  );

  const restart = () => {
    reset({ ...planDefaults });
    startedAt.current = Date.now();
    setStep(0);
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 md:p-12" role="status">
        <svg viewBox="0 0 64 64" className="size-20 text-primary" aria-hidden="true">
          <m.circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="3" initial={(ok ? { pathLength: 0 } : false) as never} animate={{ pathLength: 1 } as never} transition={{ duration: 0.8, ease }} />
          <m.path
            d="M20 33 l8 8 l16 -18"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={(ok ? { pathLength: 0 } : false) as never}
            animate={{ pathLength: 1 } as never}
            transition={{ duration: 0.5, ease, delay: 0.6 }}
          />
        </svg>
        <m.div initial={ok ? { opacity: 0, y: 16 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.5 }}>
          <h2 ref={successRef} tabIndex={-1} className="heading-2 mt-6 outline-none">
            {t.plan.success.title}
          </h2>
          <p className="lead mt-4">{t.plan.success.text}</p>
          <h3 className="mt-8 font-display text-xl">{t.plan.success.next}</h3>
          <p className="mt-2 text-foreground/80">{t.plan.success.nextText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to={pathFor("home", lang)}>{t.plan.success.home}</ButtonLink>
            <Button variant="outline" onClick={restart}>
              {t.plan.success.again}
            </Button>
          </div>
        </m.div>
      </div>
    );
  }

  const err = (k: keyof PlanValues) => errors[k]?.message as string | undefined;
  const regionOptions = REGIONS[land] ?? [];
  const regionLabels = t.plan.regionOptions[land === "Spain" ? "spain" : "morocco"] as Record<string, string>;

  return (
    <form onSubmit={onSubmit} noValidate className="rounded-2xl border border-border bg-card p-6 md:p-10" aria-describedby="plan-progress-label">
      {/* Progress */}
      <div className="mb-8">
        <p id="plan-progress-label" className="text-sm font-semibold text-foreground/80" aria-live="polite">
          {fmt(t.plan.progress, { current: step + 1, total })} · <span className="text-foreground">{steps[step]}</span>
        </p>
        <div
          className="mt-3 heading-1.5 overflow-hidden rounded-full bg-secondary"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={total}
          aria-valuenow={step + 1}
          aria-label={fmt(t.plan.progress, { current: step + 1, total })}
        >
          <div className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out motion-reduce:transition-none" style={{ width: `${((step + 1) / total) * 100}%` }} />
        </div>
        <ol className="mt-4 hidden grid-cols-4 gap-2 text-xs md:grid">
          {steps.map((s, i) => (
            <li key={s} aria-current={i === step ? "step" : undefined} className={i <= step ? "text-foreground" : "text-foreground/55"}>
              <span className="font-display mr-1 text-primary">{i + 1}.</span> {s}
            </li>
          ))}
        </ol>
      </div>

      {/* Honeypot – hidden from people and assistive tech */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">{f.honeypot}</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <m.fieldset
          key={step}
          custom={dir}
          initial={ok ? { opacity: 0, x: dir * 32 } : false}
          animate={{ opacity: 1, x: 0 }}
          exit={ok ? { opacity: 0, x: dir * -32 } : undefined}
          transition={{ duration: 0.35, ease }}
          className="min-w-0 space-y-7"
        >
          <legend className="sr-only">{steps[step]}</legend>
          <h2 ref={stepHeading} tabIndex={-1} className="font-display text-3xl outline-none md:text-4xl">
            {steps[step]}
          </h2>

          {step === 0 && (
            <>
              <div role="radiogroup" aria-labelledby="reisvorm-label" aria-describedby={describedBy("reisvorm", err("reisvorm"), true)} className="space-y-3">
                <p id="reisvorm-label" className="text-sm font-semibold">
                  {f.tripForm} <span className="text-primary" aria-hidden="true">*</span>
                </p>
                <p id="reisvorm-hint" className="text-xs text-foreground/70">
                  {f.tripFormHint}
                </p>
                <div className="grid gap-3 md:grid-cols-3">
                  {TRIP_FORMS.map((v) => (
                    <RadioCard
                      key={v}
                      id={`reisvorm-${v}`}
                      value={v}
                      title={t.plan.tripFormOptions[v].title}
                      text={t.plan.tripFormOptions[v].text}
                      icon={v === "group" ? <Users className="size-5" /> : v === "individual" ? <Map className="size-5" /> : <Wand2 className="size-5" />}
                      aria-invalid={!!err("reisvorm")}
                      {...register("reisvorm")}
                    />
                  ))}
                </div>
                {err("reisvorm") && (
                  <p id="reisvorm-error" className="text-sm font-medium text-destructive" role="alert">
                    {err("reisvorm")}
                  </p>
                )}
              </div>
              {reisvorm !== "tailor-made" && (
                <Field id="reis" label={f.tour} error={err("reis")}>
                  <Select id="reis" {...register("reis")}>
                    <option value="">{f.tourNone}</option>
                    {(["spain", "morocco"] as const).map((c) => (
                      <optgroup key={c} label={t.common[c]}>
                        {publishedTrips
                          .filter((x) => x.country === c)
                          .map((x) => (
                            <option key={x.slug} value={x.slug}>
                              {l(x.name)}
                            </option>
                          ))}
                      </optgroup>
                    ))}
                  </Select>
                </Field>
              )}
            </>
          )}

          {step === 1 && (
            <>
              <div role="radiogroup" aria-labelledby="land-label" className="space-y-3">
                <p id="land-label" className="text-sm font-semibold">
                  {f.destination} <span className="text-primary" aria-hidden="true">*</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {(["Spain", "Morocco"] as const).map((c) => (
                    <RadioPill key={c} id={`land-${c}`} value={c} label={t.plan.destinationOptions[c === "Spain" ? "spain" : "morocco"]} {...register("land", { onChange: () => setValue("regio", "") })} />
                  ))}
                </div>
                {err("land") && (
                  <p className="text-sm font-medium text-destructive" role="alert">
                    {err("land")}
                  </p>
                )}
              </div>
              {!reis && (
                <Field id="regio" label={f.region}>
                  <Select id="regio" {...register("regio")}>
                    <option value="">{f.regionNone}</option>
                    {regionOptions.map((r) => (
                      <option key={r} value={r}>
                        {regionLabels[r]}
                      </option>
                    ))}
                  </Select>
                </Field>
              )}
              <Field id="reisperiode" label={f.period} error={err("reisperiode")}>
                <Input id="reisperiode" placeholder={f.periodPlaceholder} aria-invalid={!!err("reisperiode")} aria-describedby={describedBy("reisperiode", err("reisperiode"))} {...register("reisperiode")} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="reis_start" label={f.startDate} error={err("reis_start")} hint={f.datesHint}>
                  <Input id="reis_start" type="date" aria-describedby={describedBy("reis_start", err("reis_start"), true)} {...register("reis_start")} />
                </Field>
                <Field id="reis_eind" label={f.endDate} error={err("reis_eind")}>
                  <Input id="reis_eind" type="date" aria-invalid={!!err("reis_eind")} aria-describedby={describedBy("reis_eind", err("reis_eind"))} {...register("reis_eind")} />
                </Field>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="aantal_rijders" label={f.riders} required requiredLabel={f.required} error={err("aantal_rijders")}>
                  <Input id="aantal_rijders" type="number" inputMode="numeric" min={1} max={50} aria-invalid={!!err("aantal_rijders")} aria-describedby={describedBy("aantal_rijders", err("aantal_rijders"))} {...register("aantal_rijders")} />
                </Field>
                <Field id="aantal_duo" label={f.passengers} error={err("aantal_duo")}>
                  <Input id="aantal_duo" type="number" inputMode="numeric" min={0} max={50} aria-invalid={!!err("aantal_duo")} aria-describedby={describedBy("aantal_duo", err("aantal_duo"))} {...register("aantal_duo")} />
                </Field>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div role="radiogroup" aria-labelledby="motor-label" className="space-y-3">
                <p id="motor-label" className="text-sm font-semibold">
                  {f.bike}
                </p>
                <div className="flex flex-wrap gap-2">
                  {BIKE.map((b) => (
                    <RadioPill key={b} id={`motor-${b}`} value={b} label={{ own: f.bikeOwn, rent: f.bikeRent, undecided: f.bikeUndecided }[b]} {...register("motor")} />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {motor === "own" && <Checkbox id="transport_motor" label={f.transport} {...register("transport_motor")} />}
                <Checkbox id="accommodatie" label={f.accommodation} {...register("accommodatie")} />
              </div>
              <Field id="ervaring" label={f.experience} required requiredLabel={f.required} error={err("ervaring")}>
                <Select id="ervaring" defaultValue="" aria-invalid={!!err("ervaring")} aria-describedby={describedBy("ervaring", err("ervaring"))} {...register("ervaring")}>
                  <option value="" disabled>
                    —
                  </option>
                  {EXPERIENCE.map((x) => (
                    <option key={x} value={x}>
                      {f.experienceOptions[x]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field id="wensen" label={f.wishes} error={err("wensen")}>
                <Textarea id="wensen" rows={5} placeholder={f.wishesPlaceholder} aria-invalid={!!err("wensen")} aria-describedby={describedBy("wensen", err("wensen"))} {...register("wensen")} />
              </Field>
            </>
          )}

          {step === 3 && (
            <>
              <Field id="naam" label={f.name} required requiredLabel={f.required} error={err("naam")}>
                <Input id="naam" autoComplete="name" aria-invalid={!!err("naam")} aria-describedby={describedBy("naam", err("naam"))} {...register("naam")} />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="email" label={f.email} required requiredLabel={f.required} error={err("email")}>
                  <Input id="email" type="email" autoComplete="email" aria-invalid={!!err("email")} aria-describedby={describedBy("email", err("email"))} {...register("email")} />
                </Field>
                <Field id="telefoon" label={f.phone} required requiredLabel={f.required} error={err("telefoon")}>
                  <Input id="telefoon" type="tel" autoComplete="tel" aria-invalid={!!err("telefoon")} aria-describedby={describedBy("telefoon", err("telefoon"))} {...register("telefoon")} />
                </Field>
              </div>
              <div role="radiogroup" aria-labelledby="pref-label" className="space-y-3">
                <p id="pref-label" className="text-sm font-semibold">
                  {f.contactPref}
                </p>
                <div className="flex flex-wrap gap-2">
                  {CONTACT_PREF.map((c) => (
                    <RadioPill key={c} id={`pref-${c}`} value={c} label={f.contactPrefOptions[c]} {...register("contact_voorkeur")} />
                  ))}
                </div>
              </div>
              <div>
                <Checkbox
                  id="privacy"
                  aria-invalid={!!err("privacy")}
                  aria-describedby={describedBy("privacy", err("privacy"))}
                  label={
                    <>
                      {f.privacy}{" "}
                      <LocalLink to={pathFor("privacy", lang)} target="_blank" className="font-semibold text-primary underline underline-offset-4">
                        {f.privacyLink}
                      </LocalLink>
                      . <span className="text-primary" aria-hidden="true">*</span>
                    </>
                  }
                  {...register("privacy")}
                />
                {err("privacy") && (
                  <p id="privacy-error" className="mt-2 text-sm font-medium text-destructive" role="alert">
                    {err("privacy")}
                  </p>
                )}
              </div>
            </>
          )}
        </m.fieldset>
      </AnimatePresence>

      {serverError && (
        <p className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm" role="alert">
          {serverError}
        </p>
      )}

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={back}>
            <ArrowLeft aria-hidden="true" /> {t.plan.back}
          </Button>
        ) : (
          <span />
        )}
        {step < total - 1 ? (
          <Button type="button" onClick={next} size="lg">
            {t.plan.next} <ArrowRight aria-hidden="true" />
          </Button>
        ) : (
          <Button type="submit" size="lg" disabled={status === "submitting"}>
            {status === "submitting" ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" /> {t.plan.submitting}
              </>
            ) : (
              <>
                {t.plan.submit} <ArrowRight aria-hidden="true" />
              </>
            )}
          </Button>
        )}
      </div>
      {step === total - 1 && <p className="mt-4 text-right text-xs text-foreground/70">{t.plan.disclaimer}</p>}
    </form>
  );
}
