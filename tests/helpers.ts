import type { Page, Request } from "@playwright/test";

/** Intercepts Supabase REST inserts so tests never write to the production database. */
export async function mockSupabase(page: Page, table: string, status = 201) {
  const requests: Request[] = [];
  await page.route(`**/rest/v1/${table}**`, async (route) => {
    requests.push(route.request());
    await route.fulfill({ status, contentType: "application/json", body: status < 300 ? "" : JSON.stringify({ message: "fail" }) });
  });
  return requests;
}

export async function hideCookieBanner(page: Page) {
  await page.addInitScript(() => localStorage.setItem("col-cookie-notice", "1"));
}

/** The forms reject submissions faster than 3 s (bot protection). */
export async function waitHuman(page: Page) {
  await page.waitForTimeout(3100);
}
