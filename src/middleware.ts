import { defineMiddleware } from "astro:middleware";
import { Telemetry } from "@/lib/server/telemetry";

// Server-side request telemetry, ported from the old worker entrypoint. Runs
// for every on-demand route (prerendered pages and static assets are served by
// the platform and never reach here). The Telemetry instance is stashed on
// locals so endpoints can attach spans/exceptions to the same request span; the
// per-request client config injection is gone — the browser RUM client now
// self-configures from public constants (see lib/telemetry.ts).
export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url, locals } = context;
  const ctx = locals.cfContext;
  if (!ctx) {
    // No Cloudflare execution context (e.g. a non-worker render context).
    return next();
  }

  const tel = new Telemetry(ctx, url.hostname);
  const requestId = tel.newSpanId();
  locals.telemetry = tel;
  locals.requestId = requestId;

  const start = Date.now();
  let response: Response;
  let errored = false;
  try {
    response = await next();
  } catch (err) {
    errored = true;
    tel.trackException(requestId, err, { route: url.pathname });
    response = new Response("Internal error", { status: 500 });
  }

  tel.trackRequest({
    id: requestId,
    name: `${request.method} ${url.pathname}`,
    url: request.url,
    durationMs: Date.now() - start,
    responseCode: String(response.status),
    success: !errored && response.status < 400,
    properties: { environment: tel.environment, ...tel.drainRequestProperties() },
  });
  tel.flush();
  return response;
});
