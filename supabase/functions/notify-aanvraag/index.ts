// Supabase Edge Function (Deno): sends an e-mail notification for a new trip request.
// Deploy:  supabase functions deploy notify-aanvraag
// Secrets: supabase secrets set RESEND_API_KEY=... NOTIFY_TO=info@crossingoflimits.nl NOTIFY_FROM="Crossing of Limits <website@crossingoflimits.nl>"
// Enable on the website: VITE_NOTIFY_FUNCTION=notify-aanvraag
//
// The previous Lovable site sent this mail from a TanStack server function, which does not
// exist in a static Vite site – this function replaces it.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const esc = (v: unknown) =>
  String(v ?? "–").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const row = await req.json();
    const rows = Object.entries(row)
      .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td>${esc(v)}</td></tr>`)
      .join("");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: Deno.env.get("NOTIFY_FROM"),
        to: [Deno.env.get("NOTIFY_TO")],
        reply_to: row.email,
        subject: `Nieuwe aanvraag: ${row.naam} (${row.land}${row.regio ? ` / ${row.regio}` : ""})`,
        html: `<h2>Nieuwe reisaanvraag</h2><table>${rows}</table>`,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
