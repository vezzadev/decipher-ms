import type { APIRoute } from "astro";
import { sitePages } from "@/lib/pages";

// Prerendered: emitted as a static /llms.txt at build, served by the platform
// (bypassing the worker) like the file it replaces.
export const prerender = true;

const HEADER = `# decipher.ms

> Independent Microsoft advisory practice run by a former Microsoft Principal Engineer. Straight answers on M365, Azure, Dynamics, and Copilot — with no reseller incentives.

decipher.ms helps companies make better Microsoft decisions. Services include expert calls, written second opinions, and in-depth technical briefs on licensing and product strategy. Founded by Pedro Paulo Vezza Campos, former Tech Lead on the Microsoft 365 Substrate AI Platform.

## Pages`;

export const GET: APIRoute = () => {
  const lines = sitePages()
    .map((p) => `- [${p.title}](${p.path}): ${p.description}`)
    .join("\n");

  const body = `${HEADER}\n\n${lines}\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
