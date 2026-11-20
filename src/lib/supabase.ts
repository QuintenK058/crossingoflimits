import type { SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

let client: Promise<SupabaseClient> | null = null;

/** Supabase is only loaded on pages that need it (forms, admin). */
export function getSupabase(): Promise<SupabaseClient> {
  if (!url || !key) return Promise.reject(new Error("Supabase env vars missing (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY)"));
  client ??= import("@supabase/supabase-js").then(({ createClient }) =>
    createClient(url, key, { auth: { persistSession: true, autoRefreshToken: true } }),
  );
  return client;
}

/** true after running supabase/migrations/20261120_extend_aanvragen.sql */
export const aanvragenExtended = import.meta.env.VITE_AANVRAGEN_EXTENDED === "true";
export const notifyFunction = (import.meta.env.VITE_NOTIFY_FUNCTION as string | undefined) || "";
