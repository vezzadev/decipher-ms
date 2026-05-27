import type { Env } from "./env";
import { handleBriefing } from "./briefing";
import { discoveryDocument, jwks } from "./oidc";
import { Telemetry } from "./telemetry";

const STATIC_ASSET_EXT = /\.(?:js|css|map|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|otf)$/i;

function isStaticAssetPath(pathname: string): boolean {
  if (pathname.startsWith("/assets/")) return true;
  if (pathname === "/favicon.ico") return true;
  return STATIC_ASSET_EXT.test(pathname);
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const skipTelemetry = isStaticAssetPath(url.pathname);
    const tel = new Telemetry(env, ctx, url.hostname);
    const requestId = tel.newSpanId();
    const start = Date.now();

    let response: Response;
    let errored = false;
    try {
      if (url.pathname === "/api/briefing") {
        response = await handleBriefing(request, env, ctx, tel, requestId);
      } else if (url.pathname === "/.well-known/openid-configuration") {
        response = discoveryDocument(env);
      } else if (url.pathname === "/.well-known/jwks.json") {
        response = await jwks(env);
      } else {
        response = await env.ASSETS.fetch(request);
      }
    } catch (err) {
      errored = true;
      if (!skipTelemetry) {
        tel.trackException(requestId, err, { route: url.pathname });
      }
      response = new Response("Internal error", { status: 500 });
    }

    if (skipTelemetry) return response;

    const durationMs = Date.now() - start;
    tel.trackRequest({
      id: requestId,
      name: `${request.method} ${url.pathname}`,
      url: request.url,
      durationMs,
      responseCode: String(response.status),
      success: !errored && response.status < 400,
      properties: { environment: tel.environment, ...tel.drainRequestProperties() },
    });
    tel.flush();
    return response;
  },
} satisfies ExportedHandler<Env>;
