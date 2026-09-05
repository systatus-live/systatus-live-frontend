// Roda após `ng build` e grava o sitemap.xml na pasta browser do dist.
// Uso: node scripts/generate-sitemap.mjs

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://systatus.live";
const today = new Date().toISOString().split("T")[0];

/** @type {{ loc: string; changefreq: string; priority: number }[]} */
const routes = [
  { loc: "/",                              changefreq: "weekly",  priority: 1.0 },
  { loc: "/contact",                       changefreq: "monthly", priority: 0.5 },
  { loc: "/agreements/terms-of-use",       changefreq: "yearly",  priority: 0.3 },
  { loc: "/agreements/privacy-policy",     changefreq: "yearly",  priority: 0.3 },
  { loc: "/auth/signin",                   changefreq: "monthly", priority: 0.4 },
  { loc: "/auth/signup",                   changefreq: "monthly", priority: 0.5 },
];

function buildXml(urls) {
  const entries = urls
    .map(
      ({ loc, changefreq, priority }) =>
        `  <url>\n` +
        `    <loc>${BASE_URL}${loc}</loc>\n` +
        `    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${changefreq}</changefreq>\n` +
        `    <priority>${priority.toFixed(1)}</priority>\n` +
        `  </url>`,
    )
    .join("\n");

  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries +
    `\n</urlset>\n`
  );
}

const outputPath = resolve("dist/systatus-live-frontend/browser/sitemap.xml");

try {
  writeFileSync(outputPath, buildXml(routes), "utf-8");
  console.log(`sitemap.xml gerado em ${outputPath}`);
} catch (err) {
  console.error(`Erro ao gravar sitemap.xml: ${err.message}`);
  process.exit(1);
}
