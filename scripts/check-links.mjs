/**
 * Crawls the built site starting from the sitemap + homepage and checks every
 * internal link, image (src/srcset), video, font and script for a 200 response.
 * External links are listed (not fetched) so you can spot typos.
 * Usage: node scripts/check-links.mjs [baseUrl]   (serve dist first)
 */
const BASE = process.argv[2] ?? "http://localhost:4173";
const SITE = "https://crossingoflimits.nl";

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text();
const queue = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(SITE, "") || "/");
queue.push("/", "/auth", "/admin");
const pages = new Set();
const assets = new Set();
const external = new Set();
const broken = [];
const refs = new Map();

const note = (url, from) => {
  if (!refs.has(url)) refs.set(url, from);
};

while (queue.length) {
  const path = queue.shift();
  if (pages.has(path)) continue;
  pages.add(path);
  const res = await fetch(BASE + path);
  if (res.status !== 200) {
    broken.push(`${res.status} ${path} (linked from ${refs.get(path) ?? "sitemap"})`);
    continue;
  }
  const html = await res.text();
  for (const [, href] of html.matchAll(/<a[^>]+href="([^"]+)"/g)) {
    if (href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("http")) {
      if (href.startsWith(SITE)) queue.push(href.replace(SITE, "") || "/");
      else external.add(href);
      continue;
    }
    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (id && !html.includes(`id="${id}"`)) broken.push(`missing anchor ${href} on ${path}`);
      continue;
    }
    const clean = href.split("#")[0].split("?")[0];
    note(clean, path);
    if (!pages.has(clean)) queue.push(clean);
  }
  const srcs = [
    ...[...html.matchAll(/(?:src|href)="(\/[^"]+\.(?:avif|webp|jpg|png|ico|mp4|webm|woff2|js|css|webmanifest|xml))"/g)].map((m) => m[1]),
    ...[...html.matchAll(/(?:srcset|imagesrcset)="([^"]+)"/gi)].flatMap((m) => m[1].split(",").map((s) => s.trim().split(" ")[0])),
  ];
  for (const s of srcs) if (s.startsWith("/")) {
    assets.add(s);
    note(s, path);
  }
}
// Hero video sources are added client-side
for (const v of ["hero-720.mp4", "hero-720.webm", "hero-1280.mp4", "hero-1280.webm"]) assets.add(`/media/video/${v}`);

for (const a of assets) {
  const res = await fetch(BASE + a, { method: "HEAD" });
  if (res.status !== 200) broken.push(`${res.status} asset ${a} (on ${refs.get(a)})`);
}

console.log(`Checked ${pages.size} pages and ${assets.size} assets.`);
console.log(`External links (not fetched): ${[...external].sort().join(", ")}`);
if (broken.length) {
  console.error(`✗ ${broken.length} problems:\n${broken.join("\n")}`);
  process.exit(1);
}
console.log("✓ no broken links");
