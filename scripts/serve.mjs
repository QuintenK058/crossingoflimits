/**
 * Tiny static server for the prerendered build (used for tests, screenshots and
 * Lighthouse). Mimics a typical static host: clean URLs, gzip, long-lived
 * caching for hashed assets and 404.html for unknown paths.
 * Usage: node scripts/serve.mjs [port]
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import path from "node:path";

const DIST = path.resolve(import.meta.dirname, "..", "dist");
const PORT = Number(process.argv[2] ?? 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".mp4": "video/mp4",
  ".webm": "video/webm", ".webmanifest": "application/manifest+json",
};
const COMPRESS = new Set([".html", ".js", ".css", ".json", ".xml", ".txt", ".svg", ".webmanifest"]);

async function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/";
  const candidates = [path.join(DIST, clean), path.join(DIST, clean, "index.html"), path.join(DIST, `${clean}.html`)];
  for (const c of candidates) {
    if (!c.startsWith(DIST)) continue;
    try {
      if ((await stat(c)).isFile()) return { file: c, status: 200 };
    } catch { /* next */ }
  }
  return { file: path.join(DIST, "404.html"), status: 404 };
}

createServer(async (req, res) => {
  try {
    const { file, status } = await resolve(req.url ?? "/");
    const ext = path.extname(file);
    let body = await readFile(file);
    const headers = { "Content-Type": TYPES[ext] ?? "application/octet-stream" };
    headers["Cache-Control"] = file.includes(`${path.sep}assets${path.sep}`)
      ? "public, max-age=31536000, immutable"
      : file.includes(`${path.sep}media${path.sep}`)
        ? "public, max-age=604800"
        : "public, max-age=0, must-revalidate";
    if (ext === ".mp4" || ext === ".webm") {
      headers["Accept-Ranges"] = "bytes";
      const range = req.headers.range;
      if (range) {
        const [s, e] = range.replace("bytes=", "").split("-");
        const start = Number(s);
        const end = e ? Number(e) : body.length - 1;
        res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${body.length}`, "Content-Length": end - start + 1 });
        return res.end(body.subarray(start, end + 1));
      }
    }
    if (COMPRESS.has(ext) && /gzip/.test(req.headers["accept-encoding"] ?? "")) {
      body = gzipSync(body);
      headers["Content-Encoding"] = "gzip";
    }
    headers["Content-Length"] = body.length;
    res.writeHead(status, headers);
    res.end(req.method === "HEAD" ? undefined : body);
  } catch (e) {
    res.writeHead(500).end(String(e));
  }
}).listen(PORT, () => console.log(`Serving dist on http://localhost:${PORT}`));
