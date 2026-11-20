/**
 * Lightweight client-side spam protection:
 * - honeypot field (bots fill every input)
 * - minimum time on the form (bots submit instantly)
 * - rate limit per browser (max 3 submissions per 10 minutes)
 * Server-side protection: see supabase/migrations (RLS + rate-limit trigger).
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX = 3;
const MIN_FILL_MS = 3000;

function read(key: string): number[] {
  try {
    return (JSON.parse(localStorage.getItem(key) ?? "[]") as number[]).filter((n) => Date.now() - n < WINDOW_MS);
  } catch {
    return [];
  }
}

export function isRateLimited(key: string) {
  return read(key).length >= MAX;
}

export function recordSubmit(key: string) {
  try {
    localStorage.setItem(key, JSON.stringify([...read(key), Date.now()]));
  } catch {
    /* ignore */
  }
}

/** Returns true when the submission looks automated. */
export function looksLikeBot(honeypot: string | undefined, startedAt: number) {
  return Boolean(honeypot && honeypot.trim()) || Date.now() - startedAt < MIN_FILL_MS;
}
