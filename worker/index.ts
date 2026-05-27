import type { Env } from "./env";
import { handleBriefing } from "./briefing";
import { discoveryDocument, jwks } from "./oidc";
import { Telemetry } from "./telemetry";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);
    const tel = new Telemetry(env, ctx);
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
      tel.trackException(requestId, err, { route: url.pathname });
      response = new Response("Internal error", { status: 500 });
    }

    const durationMs = Date.now() - start;
    tel.trackRequest({
      id: requestId,
      name: `${request.method} ${url.pathname}`,
      url: request.url,
      durationMs,
      responseCode: String(response.status),
      success: !errored && response.status < 400,
      properties: tel.drainRequestProperties(),
    });
    tel.flush();
    return response;
  },
} satisfies ExportedHandler<Env>;
