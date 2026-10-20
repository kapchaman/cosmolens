# Development audit and plan — 2026-10-20

Baseline: `main` at `cdd964461b50b7841b253bfcbc0cc1bdfc2d0a89`.
PRs #1 (release/security docs), #2 (relationships) and #3 (AI containment) are merged. Do not redo the Jupiter/Pleiades relationship correction or enable AI to “fix” its intentional 503.

## Architecture and observed gaps

- Next.js 16.3.8 App Router; React 19; TypeScript strict; Tailwind 4; Zod. Node runtime. No confirmed deployment or hosting configuration.
- Nine page families: home/scale, atlas, object details (33 records), compare, journeys (3), discoveries, lab, observe and My Cosmos. Three API routes: AI, APOD, news.
- Scientific content is local TypeScript: objects, sources, scale nodes, journeys, observation targets and hypothetical scenarios. Domain helpers join source and relationship IDs.
- Interactive clients receive curated content from server pages. My Cosmos uses device-local browser storage; there is no account, database or cross-device sync.
- APOD/news adapters have timeouts and cache/fallback behavior. APOD accepted arbitrary JSON as live; Atom chose the first link regardless of relation.
- The AI route is hard-disabled before any upstream operation. Old process-local rate-limit code is unused and not production protection. README and the old security observation section describe the pre-containment route and need correction.
- Existing visual script hard-codes Windows Edge and localhost. No unit/API suite or CI existed at the baseline.
- Mobile navigation is absent below `lg`. Search has no focus containment/return or Escape behavior. Several fixed grid tracks and form inputs need narrow-width review.
- All ten Phase B issues are present in the baseline: storage shapes/writes, journey reuse, AI context/history, APOD classification, Atlas/scale links, date handling and Atom links.

## Acceptance criteria and review sequence

| Increment | Acceptance criteria | Estimated founder review/manual work |
| --- | --- | --- |
| B — reliability | Malformed data cannot crash UI; failed writes preserve drafts; correct journey copy; context changes clear/abort AI; bounded history; only validated APOD is live; links restore selected state; invalid dates show an explicit empty state; Atom uses safe alternate links. Unit/API and browser regressions pass. | 3–5 h |
| C — UX | Mobile routes reachable, visible keyboard focus, search modal containment/Escape/return, no horizontal overflow at narrow widths, usable empty/loading/error states. Preserve current colors/identity. | 4–6 h |
| D — automation | Portable Chromium desktop/mobile regression and smoke tests against a production build; CI runs install, typecheck, unit/API tests, build and browser tests without secrets or live AI. | 2–4 h |
| E — AI security | Strict/streamed request bounds, fail-closed trusted identity/shared atomic admission/budget/concurrency boundaries, emergency kill switch and mocked failure/race tests. Public route remains 503 until host-specific controls are provisioned and separately verified. | 6–10 h plus external prerequisites |
| F — science | Audit high-impact claims and source bindings; correct misleading measurements/model labels; add source/reference integrity tests and explicitly list unverified claims. | 5–8 h |
| G — release | Confirm host/URL/terms, document env/rollback, SEO/monitoring/privacy and release evidence. Preview/production checks and public deployment require founder approval. | 4–6 h |

Work is sequential in small development branches/PRs; dependent work may use stacked PRs so it does not need a premature merge. Each PR names its base and validation evidence. No concurrent edits to the same files in different branches.

## Milestone: 2026-11-13

With roughly 10–20 hours/week, aim to freeze the content-first release by November 6, reserving the final week for review, mobile checks and deployment verification. October 21–27: reliability and navigation. October 28–November 3: CI, science review and deployment decision. November 4–6: feature freeze and release candidate. November 7–13: approved preview/live checks and fixes only. These are planning targets, not scheduled automation.

AI is not required for the first public release. A zero-budget content release with AI disabled is preferable if shared infrastructure and trusted authentication cannot be validated in time. Approximately $50 of API credit is not a development testing budget: only fake providers are allowed without explicit founder approval.

## Remaining gates

- Hosting identity, live URL, production branch and rollback are still unknown.
- Real screen-reader and low-end-device checks, production monitoring and performance need deployment-specific evidence.
- Source presence is not factual verification; review quantitative claims against the actual sources.
- localStorage remains local and is not a backup; concurrent multi-tab writes are not transactional.
- No merge, public deployment, paid service, key rotation/disclosure or OpenAI spending is authorized.

## Progress at the end of the implementation pass

- PR #4: all ten reliability regressions fixed and covered.
- PR #5: CI and portable browser verification.
- PR #6: mobile/keyboard improvements, browser regressions and screenshot review.
- PR #7: isolated AI protection foundation; real Redis race tests pass; public route stays disabled.
- PR #8: sourced scientific corrections and catalog integrity; remaining editorial scope is explicit.
- Release-preparation branch: indexing, privacy, headers, health and current deployment/runbook documentation.

PRs are stacked and no changes have been merged to main. The critical remaining work for November 13 is review/merge, host identification, manual accessibility/science checks and an approved deployment rehearsal. Full authenticated AI integration is a separate project gate and should not consume the content release's remaining time unless its prerequisites become available.
