## Synthetica — Consultant Research Desk Landing Page

Build a single-page landing for an expert research desk (think Directions on Microsoft's Expert Desk) in the chosen **Institutional Editorial** direction: oversized Playfair Display serif headlines, hard 4px slate borders, electric blue accents, bold block grid composition.

### Design tokens (copied verbatim from the chosen prototype)

Wire these into `src/styles.css` and replace existing tokens:
- `--background` → `#ffffff` (paper)
- `--foreground` → `#020617` (slate-brand)
- `--primary` → `#020617`
- `--accent` → `#2563eb` (electric blue)
- `--border` → slate-brand at 10%
- Fonts: Playfair Display 900 + italic 900 (display), Inter 400/600/800 (body). Load via Google Fonts in `__root.tsx` head links.
- Sharp corners everywhere — `--radius: 0`.

### Page structure (sections, in order)

1. **Nav** — 4px bottom border, oversized italic serif wordmark "SYNTHETICA", 3 uppercase nav links (Desk / Analysts / Archives), filled "Client Portal" button.
2. **Hero** — 2-column on desktop. Left: huge 7xl–9xl serif "BUILT / FOR / PRECISION." with "FOR" in italic blue, supporting paragraph, left-bordered. Right: stacked dark "Current Response Latency" card showing "4.2h" in giant italic serif, plus full-width blue "Request Briefing →" CTA below it.
3. **Three pillars grid** — 3 equal columns with hard borders. Each card: oversized italic "01/02/03", uppercase serif title (Written Briefings / Analyst Direct / Vendor Intelligence), copy, square image placeholder. Hover swaps card background to blue or slate. Use real generated images here (see image plan below).
4. **Analyst roster** — 5–6 named analysts with portraits, name in serif, coverage area in uppercase mono-feeling label. Hard-bordered grid.
5. **Sample inquiry strip** — 2–3 real-feeling case cards (e.g., "Oracle Java SE renewal," "Mixing EA + MCA on a single Azure tenant for Copilot," "SAP Rise hidden compute overheads") with assigned analyst and resolution date.
6. **Coverage areas** — 5-column bordered grid (Licensing / Roadmaps / Architecture / Negotiation / Risk) with short descriptors.
7. **Big quote block** — full-bleed blue background, 5xl–7xl italic serif pull quote, attribution.
8. **Stats strip** — 4 bold numbers (48h avg response, 15yr min experience, 2.4k briefings delivered, 1 client quote).
9. **Footer / final CTA** — dark slate panel with serif "Secure your intelligence desk." headline, two CTAs (Join the Desk / Case Studies), Expertise + Synthetica link columns, fine-print legal row.

### File changes

- `src/routes/__root.tsx` — update head() with real title/description/OG ("Synthetica — Expert Research Desk for Enterprise IT"), add Playfair Display + Inter Google Fonts `<link>` tags.
- `src/styles.css` — replace `:root` tokens with the editorial palette above; set `--radius: 0`; register `--font-serif` and `--font-sans` in `@theme inline`; set `body { font-family: var(--font-sans) }`.
- `src/routes/index.tsx` — replace placeholder with the full landing composed of section components.
- `src/components/landing/` — new folder with one component per section: `Nav.tsx`, `Hero.tsx`, `Pillars.tsx`, `Analysts.tsx`, `Inquiries.tsx`, `Coverage.tsx`, `PullQuote.tsx`, `Stats.tsx`, `FooterCTA.tsx`.

### Images

Generate 3 hero/section images + 6 analyst portraits with `imagegen` (fast tier) into `src/assets/`, import as ES6:
- Document mock for "Written Briefings" pillar
- High-contrast portrait for "Analyst Direct" pillar
- Abstract network viz for "Vendor Intelligence" pillar
- 6 analyst headshots (varied gender/ethnicity, neutral lighting, slight grayscale feel) for the roster

### What I'm NOT doing this turn

- No backend, no Lovable Cloud, no forms wiring. CTAs are non-functional buttons.
- No multi-page split — single index route only. If you later want Analysts/Pricing as their own routes, that's a follow-up.
- No motion library install — keep it to CSS hover transitions per the prototype.

Approve and I'll build it.