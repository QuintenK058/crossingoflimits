import { Download, Filter, LogOut, Mail, Phone, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { I18nProvider, useI18n } from "@/i18n";
import { getSupabase } from "@/lib/supabase";
import { LANGS, type Lang } from "@/lib/routes";
import { cn } from "@/lib/utils";
import { Seo } from "@/seo/Seo";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/form/fields";
import { Logo } from "@/components/layout/Logo";
import { useAdminLang } from "./useAdminLang";

interface Aanvraag {
  id: string;
  created_at: string;
  naam: string;
  email: string;
  telefoon: string;
  land: string;
  regio: string | null;
  reisperiode: string | null;
  reis_start: string | null;
  reis_eind: string | null;
  taal: string;
  aantal_personen: number;
  eigen_motor: boolean;
  transport_motor: boolean;
  accommodatie: boolean;
  opmerkingen: string | null;
  // Present after the optional migration
  reisvorm?: string | null;
  reis_slug?: string | null;
  aantal_rijders?: number | null;
  aantal_duo?: number | null;
  rijervaring?: string | null;
  contact_voorkeur?: string | null;
}

interface Message {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
}

const CSV_FIELDS: (keyof Aanvraag)[] = [
  "created_at",
  "naam",
  "email",
  "telefoon",
  "land",
  "regio",
  "reis_start",
  "reis_eind",
  "reisperiode",
  "aantal_personen",
  "eigen_motor",
  "transport_motor",
  "accommodatie",
  "taal",
  "reisvorm",
  "reis_slug",
  "aantal_rijders",
  "aantal_duo",
  "rijervaring",
  "contact_voorkeur",
  "opmerkingen",
];

function Dashboard({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const { t, fmt } = useI18n();
  const a = t.admin;
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<"requests" | "messages">("requests");
  const [rows, setRows] = useState<Aanvraag[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [noAccess, setNoAccess] = useState(false);
  const [fLang, setFLang] = useState("all");
  const [fCountry, setFCountry] = useState("all");
  const [dateField, setDateField] = useState<"created_at" | "reis_start">("created_at");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const supabase = await getSupabase();
    const [r, m] = await Promise.all([
      supabase.from("aanvragen").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    if (r.error) {
      console.error(r.error);
      setNoAccess(true);
    } else {
      setRows((r.data ?? []) as Aanvraag[]);
      setNoAccess(false);
    }
    if (!m.error) setMessages((m.data ?? []) as Message[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        navigate("/auth", { replace: true });
        return;
      }
      setReady(true);
      void load();
    })().catch(() => navigate("/auth", { replace: true }));
  }, [navigate, load]);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (fLang !== "all" && r.taal !== fLang) return false;
        if (fCountry !== "all" && r.land !== fCountry) return false;
        const d = dateField === "created_at" ? r.created_at.slice(0, 10) : r.reis_start;
        if (from && (!d || d < from)) return false;
        if (to && (!d || d > to)) return false;
        if (q.trim()) {
          const hay = `${r.naam} ${r.email} ${r.opmerkingen ?? ""}`.toLowerCase();
          if (!hay.includes(q.trim().toLowerCase())) return false;
        }
        return true;
      }),
    [rows, fLang, fCountry, dateField, from, to, q],
  );

  const exportCsv = () => {
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [CSV_FIELDS.join(","), ...filtered.map((r) => CSV_FIELDS.map((k) => esc(r[k])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `aanvragen-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const replyHref = (r: Aanvraag) => {
    const subject = `Crossing of Limits – ${r.land}${r.regio ? ` / ${r.regio}` : ""}`;
    const body = [fmt(a.replyGreeting, { name: r.naam }), "", a.replyIntro, "", "", "Crossing of Limits"].join("\n");
    return `mailto:${r.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const signOut = async () => {
    const supabase = await getSupabase();
    await supabase.auth.signOut();
    navigate("/auth", { replace: true });
  };

  const fmtDate = (d: string) =>
    new Date(d).toLocaleString(lang === "nl" ? "nl-NL" : "en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  if (!ready) return <main id="main" className="min-h-screen" aria-busy="true" />;

  return (
    <main id="main" className="min-h-screen pb-20">
      <Seo title={`${a.dashboard} | Crossing of Limits`} description={a.signInLead} noindex alternates={false} />
      <header className="border-b border-border bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-4">
            <div className="h-12">
              <Logo />
            </div>
            <div>
              <h1 className="font-display text-2xl">{a.dashboard}</h1>
              <p className="text-xs text-foreground/70">{a.incoming}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex gap-1" role="group" aria-label={t.nav.language}>
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={cn("h-9 rounded-full px-3 text-xs font-semibold uppercase", lang === l ? "bg-foreground text-background" : "hover:bg-foreground/10")}
                >
                  {l}
                </button>
              ))}
            </div>
            <Button size="sm" variant="ghost" onClick={() => void load()}>
              <RefreshCw aria-hidden="true" /> {a.refresh}
            </Button>
            <Button size="sm" variant="outline" onClick={exportCsv}>
              <Download aria-hidden="true" /> {a.exportCsv}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => void signOut()}>
              <LogOut aria-hidden="true" /> {a.signOut}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mt-8">
        <div className="flex gap-2" role="tablist">
          {(["requests", "messages"] as const).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={cn("rounded-full px-4 py-2 text-sm", tab === k ? "bg-primary text-primary-foreground" : "border border-border text-foreground/80")}
            >
              {k === "requests" ? a.requests : a.messages} ({k === "requests" ? rows.length : messages.length})
            </button>
          ))}
        </div>

        {noAccess && (
          <p role="alert" className="mt-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm">
            {a.noAccess}
          </p>
        )}

        {tab === "requests" && (
          <>
            <section aria-label={a.filters} className="mt-6 grid gap-4 rounded-xl border border-border p-4 md:grid-cols-3 lg:grid-cols-6">
              <p className="flex items-center gap-2 text-sm font-semibold lg:col-span-6">
                <Filter className="size-4" aria-hidden="true" /> {a.filters}
              </p>
              <label className="space-y-1 text-xs">
                <span>{a.language}</span>
                <Select value={fLang} onChange={(e) => setFLang(e.target.value)}>
                  <option value="all">{a.allLanguages}</option>
                  <option value="nl">Nederlands</option>
                  <option value="en">English</option>
                </Select>
              </label>
              <label className="space-y-1 text-xs">
                <span>{a.country}</span>
                <Select value={fCountry} onChange={(e) => setFCountry(e.target.value)}>
                  <option value="all">{a.allCountries}</option>
                  <option value="Spain">{t.common.spain}</option>
                  <option value="Morocco">{t.common.morocco}</option>
                </Select>
              </label>
              <label className="space-y-1 text-xs">
                <span>{a.dateField}</span>
                <Select value={dateField} onChange={(e) => setDateField(e.target.value as "created_at" | "reis_start")}>
                  <option value="created_at">{a.requestDate}</option>
                  <option value="reis_start">{a.travelStart}</option>
                </Select>
              </label>
              <label className="space-y-1 text-xs">
                <span>{a.from}</span>
                <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label className="space-y-1 text-xs">
                <span>{a.to}</span>
                <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
              <label className="space-y-1 text-xs">
                <span>{a.search}</span>
                <Input type="search" placeholder={a.searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
              </label>
            </section>

            <p className="mt-6 text-sm text-foreground/70" aria-live="polite">
              {loading ? t.common.loading : fmt(a.showing, { shown: filtered.length, total: rows.length })}
            </p>

            <ul className="mt-4 space-y-4">
              {filtered.map((r) => (
                <li key={r.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-sans text-lg font-semibold normal-case">{r.naam}</h2>
                      <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/80">
                        <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 hover:text-accent">
                          <Mail className="size-3.5" aria-hidden="true" /> {r.email}
                        </a>
                        <a href={`tel:${r.telefoon}`} className="inline-flex items-center gap-1 hover:text-accent">
                          <Phone className="size-3.5" aria-hidden="true" /> {r.telefoon}
                        </a>
                      </p>
                    </div>
                    <div className="text-right text-xs text-foreground/70">
                      {a.received}: {fmtDate(r.created_at)}
                      <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 uppercase">{r.taal}</span>
                    </div>
                  </div>
                  <dl className="mt-4 flex flex-wrap gap-2 text-xs">
                    {[
                      `${r.land}${r.regio ? ` · ${r.regio}` : ""}`,
                      r.reisvorm,
                      `${r.aantal_personen} ${a.people}`,
                      r.eigen_motor ? a.ownBike : a.rentalBike,
                      r.transport_motor ? a.transport : null,
                      r.accommodatie ? a.accommodation : null,
                      r.reis_start ? `${r.reis_start}${r.reis_eind && r.reis_eind !== r.reis_start ? ` → ${r.reis_eind}` : ""}` : r.reisperiode || a.noDates,
                    ]
                      .filter(Boolean)
                      .map((x, i) => (
                        <dd key={i} className="rounded-full border border-border px-3 py-1">
                          {x}
                        </dd>
                      ))}
                  </dl>
                  {r.reisperiode && r.reis_start && <p className="mt-3 text-sm text-foreground/80">{r.reisperiode}</p>}
                  {r.opmerkingen && <p className="mt-3 whitespace-pre-line rounded-lg bg-background/60 p-3 text-sm text-foreground/85">{r.opmerkingen}</p>}
                  <a href={replyHref(r)} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
                    <Mail className="size-4" aria-hidden="true" /> {a.reply}
                  </a>
                </li>
              ))}
            </ul>
            {!loading && filtered.length === 0 && <p className="mt-8 text-foreground/70">{a.none}</p>}
          </>
        )}

        {tab === "messages" && (
          <ul className="mt-6 space-y-4">
            {messages.map((msg) => (
              <li key={msg.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap justify-between gap-2">
                  <h2 className="font-sans text-lg font-semibold normal-case">{msg.name}</h2>
                  <span className="text-xs text-foreground/70">{fmtDate(msg.created_at)}</span>
                </div>
                <a href={`mailto:${msg.email}`} className="text-sm text-accent hover:underline">
                  {msg.email}
                </a>
                <p className="mt-3 whitespace-pre-line text-sm text-foreground/85">{msg.message}</p>
              </li>
            ))}
            {!loading && messages.length === 0 && <p className="text-foreground/70">{a.noMessages}</p>}
          </ul>
        )}
      </div>
    </main>
  );
}

export default function AdminPage() {
  const [lang, setLang] = useAdminLang();
  return (
    <I18nProvider lang={lang}>
      <Dashboard lang={lang} setLang={setLang} />
    </I18nProvider>
  );
}
