import type { D1Database } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  GRAPH_TENANT_ID: string;
  GRAPH_APP_ID: string;
  GRAPH_MAILBOX: string;
  GRAPH_TO: string;
  GRAPH_BCC: string;
  OIDC_ISSUER: string;
  OIDC_SUBJECT: string;
  OIDC_KID: string;
  OIDC_PRIVATE_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}
