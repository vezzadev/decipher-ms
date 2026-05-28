import type { APIRoute } from "astro";
import { sitePages } from "@/lib/pages";

// Prerendered: emitted as a static /sitemap.xml at build, served by the
// platform (bypassing the worker) like the file it replaces.
export const prerender = true;

const FALLBACK_ORIGIN = "https://decipher.ms";

export const GET: APIRoute = ({ site }) => {
  const origin = (site ?? new URL(FALLBACK_ORIGIN)).origin;
  const urls = sitePages()
    .map(
      (p) => `  <url>
    <loc>${origin}${p.path}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
