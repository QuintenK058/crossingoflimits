import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { I18nProvider, useI18n } from "@/i18n";
import { getSupabase } from "@/lib/supabase";
import { Seo } from "@/seo/Seo";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/form/fields";
import { Logo } from "@/components/layout/Logo";
import { LocalLink } from "@/components/ui/LocalLink";
import { useAdminLang } from "./useAdminLang";

function SignIn() {
  const { t } = useI18n();
  const a = t.admin;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = await getSupabase();
      const { error: err } = await supabase.auth.signInWithPassword({ email, password });
      if (err) throw err;
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error(err);
      setError(a.signInError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main id="main" className="grid min-h-screen place-items-center px-4 py-16">
      <Seo title={`${a.signInTitle} | Crossing of Limits`} description={a.signInLead} noindex alternates={false} />
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8">
        <div className="h-16 w-fit">
          <Logo />
        </div>
        <h1 className="mt-6 font-display text-4xl">{a.signInTitle}</h1>
        <p className="mt-2 text-sm text-foreground/75">{a.signInLead}</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field id="admin-email" label={a.email}>
            <Input id="admin-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field id="admin-password" label={a.password}>
            <Input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" /> {a.wait}
              </>
            ) : (
              a.signIn
            )}
          </Button>
        </form>
        <LocalLink to="/" className="mt-6 inline-block text-sm text-foreground/70 underline underline-offset-4 hover:text-primary">
          {a.backToSite}
        </LocalLink>
      </div>
    </main>
  );
}

export default function AuthPage() {
  const [lang] = useAdminLang();
  return (
    <I18nProvider lang={lang}>
      <SignIn />
    </I18nProvider>
  );
}
