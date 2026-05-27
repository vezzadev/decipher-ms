import type { Env } from "./env";
import { publicJwk } from "./jwt";

export function discoveryDocument(env: Env): Response {
  const body = {
    issuer: env.OIDC_ISSUER,
    jwks_uri: `${env.OIDC_ISSUER}/.well-known/jwks.json`,
    response_types_supported: ["id_token"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
  };
  return Response.json(body, {
    headers: { "cache-control": "public, max-age=3600" },
  });
}

export async function jwks(env: Env): Promise<Response> {
  const jwk = await publicJwk(env);
  return Response.json(
    { keys: [jwk] },
    { headers: { "cache-control": "public, max-age=3600" } },
  );
}
