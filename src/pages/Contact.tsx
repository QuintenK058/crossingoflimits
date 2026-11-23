import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Building2, Loader2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useI18n } from "@/i18n";
import { pathFor } from "@/lib/routes";
import { site } from "@/lib/site";
import { getSupabase } from "@/lib/supabase";
import { isRateLimited, looksLikeBot, recordSubmit } from "@/lib/antispam";
import { Seo } from "@/seo/Seo";
import { breadcrumbSchema, travelAgencySchema } from "@/seo/schema";
import { PageHero } from "@/components/sections/PageHero";
import { Field, Input, Textarea, describedBy } from "@/components/form/fields";
import { Button } from "@/components/ui/button";
import { LocalLink } from "@/components/ui/LocalLink";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";

const RATE_KEY = "col-contact-submits";

export default function Contact() {
  const { t, lang } = useI18n();
  const c = t.contact;
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, c.errorName).max(100, t.plan.errors.tooLong),
        email: z.string().trim().email(c.errorEmail).max(255, t.plan.errors.tooLong),
        message: z.string().trim().min(10, c.errorMessage).max(2000, t.plan.errors.tooLong),
        company: z.string().optional(),
      }),
    [c, t.plan.errors.tooLong],
  );
  type Values = z.infer<typeof schema>;
  const { register, handleSubmit, formState, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "", company: "" },
    mode: "onTouched",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const startedAt = useRef(Date.now());
  const errors = formState.errors;

  const onSubmit = handleSubmit(async ({ name, email, message, company }) => {
    setError("");
    if (looksLikeBot(company, startedAt.current)) {
      setStatus("sent");
      return;
    }
    if (isRateLimited(RATE_KEY)) {
      setError(t.plan.errors.rateLimited);
      return;
    }
    setStatus("sending");
    try {
      const supabase = await getSupabase();
      const { error: e } = await supabase.from("contact_messages").insert({ name, email, message });
      if (e) throw e;
      recordSubmit(RATE_KEY);
      setStatus("sent");
      reset();
    } catch (e) {
      console.error(e);
      setError(c.errorSubmit);
      setStatus("idle");
    }
  });

  const crumbs = [
    { name: t.common.home, path: pathFor("home", lang) },
    { name: t.nav.contact, path: pathFor("contact", lang) },
  ];
  const details = [
    { icon: Mail, label: c.email, value: site.email, href: `mailto:${site.email}` },
    { icon: Phone, label: c.phone, value: site.phoneDisplay, href: site.phoneHref },
    { icon: MessageCircle, label: c.whatsapp, value: c.whatsappCta, href: site.whatsappHref, external: true },
    { icon: MapPin, label: c.basedIn, value: c.basedInValue },
    { icon: Building2, label: c.kvk, value: site.kvk },
  ];

  return (
    <>
      <Seo title={t.meta.contact.title} description={t.meta.contact.description} jsonLd={[travelAgencySchema(lang), breadcrumbSchema(crumbs)]} />
      <PageHero eyebrow={c.eyebrow} title={c.title} lead={c.lead} image="photos/hero-coast" imageAlt={c.imageAlt} crumbs={crumbs} />

      <section className="pb-24 md:pb-32">
        <div className="container grid-12">
          <RevealGroup as="ul" className="col-span-4 space-y-4 md:col-span-5">
            {details.map((d) => (
              <RevealItem as="li" key={d.label}>
                {d.href ? (
                  <a
                    href={d.href}
                    {...(d.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-5 rounded-xl border border-border bg-card p-5 transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-primary/60"
                  >
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                      <d.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-eyebrow text-foreground/70">{d.label}</span>
                      <span className="mt-1 block text-lg font-semibold group-hover:text-primary">{d.value}</span>
                      {d.external && <span className="sr-only">{t.common.opensInNewTab}</span>}
                    </span>
                  </a>
                ) : (
                  <div className="flex items-center gap-5 rounded-xl border border-border p-5">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full border border-border">
                      <d.icon className="size-5 text-accent" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-eyebrow text-foreground/70">{d.label}</span>
                      <span className="mt-1 block text-lg">{d.value}</span>
                    </span>
                  </div>
                )}
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="col-span-4 md:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
              {status === "sent" ? (
                <div role="status">
                  <h2 className="heading-3">{c.sent}</h2>
                  <p className="mt-3 text-foreground/80">{c.sentText}</p>
                  <Button className="mt-6" variant="outline" onClick={() => setStatus("idle")}>
                    {c.again}
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-6">
                  <h2 className="heading-3">{c.formTitle}</h2>
                  <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                    <label htmlFor="company">{t.plan.fields.honeypot}</label>
                    <input id="company" tabIndex={-1} autoComplete="off" {...register("company")} />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="c-name" label={c.name} required requiredLabel={t.plan.fields.required} error={errors.name?.message}>
                      <Input id="c-name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={describedBy("c-name", errors.name?.message)} {...register("name")} />
                    </Field>
                    <Field id="c-email" label={c.emailField} required requiredLabel={t.plan.fields.required} error={errors.email?.message}>
                      <Input id="c-email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={describedBy("c-email", errors.email?.message)} {...register("email")} />
                    </Field>
                  </div>
                  <Field id="c-message" label={c.message} required requiredLabel={t.plan.fields.required} error={errors.message?.message}>
                    <Textarea id="c-message" rows={6} placeholder={c.messagePlaceholder} aria-invalid={!!errors.message} aria-describedby={describedBy("c-message", errors.message?.message)} {...register("message")} />
                  </Field>
                  {error && (
                    <p className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-foreground/75">
                      {c.planHint}{" "}
                      <LocalLink to={pathFor("plan", lang)} className="font-semibold text-accent underline underline-offset-4">
                        {c.planHintLink}
                      </LocalLink>
                      .
                    </p>
                    <Button type="submit" size="lg" disabled={status === "sending"}>
                      {status === "sending" ? (
                        <>
                          <Loader2 className="animate-spin" aria-hidden="true" /> {c.sending}
                        </>
                      ) : (
                        <>
                          {c.send} <ArrowRight aria-hidden="true" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
