import type { Env } from "./env";
import { mintFederatedAssertion } from "./jwt";
import type { Telemetry } from "./telemetry";

interface BriefingPayload {
  name: string;
  email: string;
  company: string;
  role: string | null;
  topic: string;
  details: string;
}

async function getAccessToken(
  env: Env,
  tel: Telemetry,
  parentId: string,
): Promise<string> {
  const assertion = await mintFederatedAssertion(env);
  const url = `https://login.microsoftonline.com/${env.GRAPH_TENANT_ID}/oauth2/v2.0/token`;
  const body = new URLSearchParams({
    client_id: env.GRAPH_APP_ID,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
    client_assertion_type:
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
    client_assertion: assertion,
  });
  const spanId = tel.newSpanId();
  const start = Date.now();
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  tel.trackDependency({
    id: spanId,
    parentId,
    name: "Entra token",
    type: "HTTP",
    target: "login.microsoftonline.com",
    data: `POST /${env.GRAPH_TENANT_ID}/oauth2/v2.0/token`,
    durationMs: Date.now() - start,
    resultCode: String(res.status),
    success: res.ok,
  });
  if (!res.ok) {
    throw new Error(`Entra token: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildMessage(env: Env, data: BriefingPayload) {
  const subject = `New briefing request: ${data.topic}`;
  const lines = [
    `From: ${data.name} <${data.email}>`,
    `Company: ${data.company}`,
    `Role: ${data.role ?? "-"}`,
    ``,
    `Topic: ${data.topic}`,
    ``,
    `Details:`,
    data.details,
  ];
  const text = lines.join("\n");
  const html = `<pre style="font-family: ui-monospace, monospace; white-space: pre-wrap;">${escapeHtml(text)}</pre>`;
  return {
    message: {
      subject,
      body: { contentType: "HTML", content: html },
      toRecipients: [{ emailAddress: { address: env.GRAPH_TO } }],
      bccRecipients: [{ emailAddress: { address: env.GRAPH_BCC } }],
      replyTo: [
        { emailAddress: { address: data.email, name: data.name } },
      ],
    },
    saveToSentItems: true,
  };
}

export async function sendBriefingEmail(
  env: Env,
  data: BriefingPayload,
  tel: Telemetry,
  parentId: string,
): Promise<void> {
  const token = await getAccessToken(env, tel, parentId);
  const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(env.GRAPH_MAILBOX)}/sendMail`;
  const spanId = tel.newSpanId();
  const start = Date.now();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(buildMessage(env, data)),
  });
  tel.trackDependency({
    id: spanId,
    parentId,
    name: "Graph sendMail",
    type: "HTTP",
    target: "graph.microsoft.com",
    data: `POST /v1.0/users/${env.GRAPH_MAILBOX}/sendMail`,
    durationMs: Date.now() - start,
    resultCode: String(res.status),
    success: res.ok,
  });
  if (!res.ok) {
    throw new Error(`Graph sendMail: ${res.status} ${await res.text()}`);
  }
}
