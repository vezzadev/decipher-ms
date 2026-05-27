import type { Env } from "./env";
import { handleBriefing } from "./briefing";
import { discoveryDocument, jwks } from "./oidc";

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/briefing") {
      return handleBriefing(request, env, ctx);
    }
    if (url.pathname === "/.well-known/openid-configuration") {
      return discoveryDocument(env);
    }
    if (url.pathname === "/.well-known/jwks.json") {
      return jwks(env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
