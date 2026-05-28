// Single source of truth for the site's public, indexable pages. Both the
// sitemap (sitemap.xml.ts) and the LLM index (llms.txt.ts) generate from this,
// so adding a page — or a new sample to samples.ts — updates both automatically.

import { samples } from "./samples";

export interface SitePage {
  /** Absolute path from the site root, e.g. "/work". */
  path: string;
  /** Human title, used in llms.txt. */
  title: string;
  /** One-line description, used in llms.txt. */
  description: string;
  /** Sitemap hint for how often the page changes. */
  changefreq: "weekly" | "monthly";
  /** Sitemap relative priority, "0.0".."1.0". */
  priority: string;
}

// Hand-maintained, non-sample pages. Sample pages are appended from the
// registry below so published briefs never need a manual entry here.
const staticPages: SitePage[] = [
  {
    path: "/",
    title: "Home",
    description: "Overview of services, pricing, approach, and how to request a briefing.",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/about",
    title: "About",
    description:
      "Background on founder Pedro Paulo Vezza Campos, his Microsoft career, and areas of expertise.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/work",
    title: "Sample Work",
    description:
      "Published sample deliverables, grouped by engagement type, that you can read before commissioning your own.",
    changefreq: "weekly",
    priority: "0.8",
  },
];

export function sitePages(): SitePage[] {
  const samplePages: SitePage[] = samples.map((s) => ({
    path: s.href,
    title: s.title,
    description: s.summary,
    changefreq: "monthly",
    priority: "0.7",
  }));
  return [...staticPages, ...samplePages];
}
