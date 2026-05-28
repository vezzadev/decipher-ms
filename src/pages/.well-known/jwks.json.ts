import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { jwks } from "@/lib/server/oidc";

export const GET: APIRoute = () => jwks(env);
