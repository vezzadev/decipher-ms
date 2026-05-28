// Single source of truth for the four engagement-tier keys. Imported by the
// sample registry (samples.ts), the client briefing form (BriefingForm.astro),
// and the server-side validation (server/briefing.ts) so a renamed or added
// tier can't silently drift between the homepage links and the form/API.
//
// Keep this module data-only (no display strings, no sample data) so the client
// form bundle stays tiny and the server can import it without pulling in page code.

export const ENGAGEMENT_KEYS = [
  "expert-call",
  "second-opinion",
  "technical-brief",
  "workshop",
] as const;

export type EngagementKey = (typeof ENGAGEMENT_KEYS)[number];
