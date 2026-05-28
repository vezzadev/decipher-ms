import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";
import { discoveryDocument } from "@/lib/server/oidc";

export const GET: APIRoute = () => discoveryDocument(env);
