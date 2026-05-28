import { SignJWT, importPKCS8 } from "jose";
import type { Env } from "./env";

const ALG = "RS256";

let cachedPrivateKey: CryptoKey | null = null;
let cachedPublicJwk: Record<string, string> | null = null;

async function privateKey(env: Env): Promise<CryptoKey> {
  if (cachedPrivateKey) return cachedPrivateKey;
  cachedPrivateKey = (await importPKCS8(env.OIDC_PRIVATE_KEY, ALG, {
    extractable: true,
  })) as CryptoKey;
  return cachedPrivateKey;
}

export async function publicJwk(env: Env): Promise<Record<string, string>> {
  if (cachedPublicJwk) return cachedPublicJwk;
  const priv = await privateKey(env);
  const pub = (await crypto.subtle.exportKey("jwk", priv)) as Record<string, unknown>;
  const { d, p, q, dp, dq, qi, key_ops, ext, ...publicOnly } = pub;
  cachedPublicJwk = {
    ...(publicOnly as Record<string, string>),
    kid: env.OIDC_KID,
    use: "sig",
    alg: ALG,
  };
  return cachedPublicJwk;
}

export async function mintFederatedAssertion(env: Env): Promise<string> {
  const key = await privateKey(env);
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({})
    .setProtectedHeader({ alg: ALG, kid: env.OIDC_KID, typ: "JWT" })
    .setIssuer(env.OIDC_ISSUER)
    .setSubject(env.OIDC_SUBJECT)
    .setAudience("api://AzureADTokenExchange")
    .setIssuedAt(now)
    .setExpirationTime(now + 300)
    .setJti(crypto.randomUUID())
    .sign(key);
}
