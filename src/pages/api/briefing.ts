import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { handleBriefing } from "@/lib/server/briefing";

export const POST: APIRoute = ({ request, locals }) =>
  handleBriefing(request, env, locals.cfContext, locals.telemetry, locals.requestId);
