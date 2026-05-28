// Registry of published sample deliverables. Each engagement type (the four
// service tiers on the home page) can accumulate multiple samples over time.
// The home page cards and the /work showcase both read from here, so adding a
// new sample is a single entry — no page edits.

export type EngagementKey = "expert-call" | "second-opinion" | "technical-brief" | "workshop";

export interface EngagementType {
  key: EngagementKey;
  n: string;
  name: string;
}

// Mirrors the four service tiers (n = "01".."04") on the home page.
export const engagementTypes: EngagementType[] = [
  { key: "expert-call", n: "01", name: "Expert Call" },
  { key: "second-opinion", n: "02", name: "Second Opinion" },
  { key: "technical-brief", n: "03", name: "Technical Brief" },
  { key: "workshop", n: "04", name: "Workshop" },
];

export interface Sample {
  slug: string;
  title: string;
  summary: string;
  href: string;
  engagement: EngagementKey;
  /** ISO date, used for sorting (newest first) and display. */
  date: string;
  /** Short label for the deliverable shape, e.g. "Technical brief". */
  format: string;
}

export const samples: Sample[] = [
  {
    slug: "advanced-dataverse-and-dynamics-365-security-model",
    title: "Advanced Dataverse & Dynamics 365 Security Model",
    summary:
      "A layer-by-layer walkthrough of the Dataverse security model — business units, access levels, Append vs Append To, owner and access teams, hierarchy security, and the sharing patterns that quietly wreck performance.",
    href: "/briefs/advanced-dataverse-and-dynamics-365-security-model",
    engagement: "technical-brief",
    date: "2026-05-28",
    format: "Technical brief",
  },
];

export function samplesFor(key: EngagementKey): Sample[] {
  return samples
    .filter((s) => s.engagement === key)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function sampleCountFor(key: EngagementKey): number {
  return samples.filter((s) => s.engagement === key).length;
}
