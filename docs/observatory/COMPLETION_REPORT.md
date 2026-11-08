# Living Observatory — audit completion, 2026-11-08

This continuation closes the implementation work deferred after the Home/Lab/Atlas prototype. It is based on PR #10 head `4e09f7305133965e9b3ecc983b236d3103d71598`, not a replacement for that PR. Main is unchanged. Branch: `feat/observatory-completion-20261108`; review it against `feat/living-observatory-20261022` first.

## Delivered

- **Compare:** selectors immediately precede results; native three-column table works on mobile without a forced wide canvas. Original measurement labels, units, confidence, notes and scientific sources remain available. Explicit diameter grouping improves Europa/Enceladus comparison; radius/distance definitions remain separate and missing data stays unknown.
- **My Cosmos:** early Write a note action, composer-first mobile order, persistent labels, readable saved-object/log layouts. Soft removal and restoration survive reload. Original content and timestamps are retained. Permanent deletion needs confirmation. Read/write errors do not claim success or discard a draft. The privacy page matches these semantics.
- **Journeys:** early Start action, numbered step anchors, compact directory and specific observation/inference/limitation text for all nine steps. Generic diagram placeholders are gone. Lens geometry follows the point-lens equation; HR controls are keyboard-sized named buttons; expansion axes/units and synthetic scatter are explicit. Existing atlas/comparison/source deep links remain.
- **Shared states:** compact unavailable-AI notices everywhere; one dedicated Discoveries introduction; readable axes/legends outside SVG scaling. Paid AI remains disabled, with available behavior tested only through intercepted responses.
- **Scientific editorial maintenance:** clarified moonless-Earth tilt uncertainty and eclipse/visibility wording, added the model paper link, and made planner seasonality limitations prominent. See [scientific review](../SCIENTIFIC_REVIEW.md).
- **Dependency maintenance:** Next 16.3.8 → 16.4.5; Zod 3.25.76 → 4.6.7. Upgrade addresses npm's reported Next critical/high advisories and Zod collection-validation advisory. Reviewed the [Next advisory](https://github.com/vercel/next.js/security/advisories/GHSA-2464-fhr4-w9xw), [Zod advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) and [migration guide](https://zod.dev/v4/changelog). Lockfile retained; production audit is now a CI gate. No blanket `npm audit fix --force`.

See [A01–A19 traceability](AUDIT_TRACEABILITY.md) and [design-system extension](DESIGN_SYSTEM.md).

## Verification

Local production checks on Node 24.22.1 / headless Chromium 153:

| Gate | Result |
| --- | --- |
| TypeScript (`next typegen && tsc --noEmit`) | Passed |
| Unit/API tests | 90 passed |
| Production build | Passed; 52 generated pages |
| Full Playwright desktop/mobile suite | 124 passed |
| WCAG automated scans included above | 14 passed across seven routes / two layouts; zero violations |
| Production dependency audit | Zero reported vulnerabilities after update |
| Capture matrix | Six routes × six viewports × before/after, viewport and full-page screenshots |
| After-capture assertions | No document/main overflow, browser exceptions or broken images |

After the full browser run, the final HR-band alignment and unused offline markup cleanup received the focused completion/accessibility/reliability rerun. CI reruns the complete suite on the submitted head. No local success is claimed for Redis or real tab zoom: those run in GitHub Actions, with their final result and exact commit recorded in the PR checks.

CI additionally runs **six real Redis integration tests**, original Home/Lab/Atlas regressions and **actual Chrome 200% tab zoom** for all nine prototype/continuation routes. Zoom uses Chrome's tabs API and asserts a 720 CSS-pixel viewport / DPR 2 for a 1440×900 window, then operates controls. It is not CSS zoom or DPR-only emulation. Workflow artifacts retain screenshots, manifest and Playwright report for 30 days. The workflow has read-only repository permissions and no deployment step.

Screenshot viewports: **1440×900, 1024×768, 390×844, 360×800, 768×1024, 1280×900**. Feeds use deterministic fallback fixtures; journals start empty. The before build is the real PR #10 base, captured before code edits. See [review images](completion-review/README.md); the separate review archive includes the full matrix and offline HTML gallery. The original Home/Lab/Atlas before/after evidence remains in [the prototype review](review/README.md).

## Known limitations and remaining external gates

- All A01–A19 now have an implementation response, but automated axe checks are not independent screen-reader, low-end-device or scientific editorial sign-off. Chromium is covered; Safari/Firefox and physical-device acceptance remain manual gates.
- Point lens, HR, rotation curve and expansion demonstrations have explicit model boundaries. Planner ranges are editorial approximations, not ephemeris-validated windows. No numerical climate or full cluster lens model is claimed.
- My Cosmos remains localStorage only. Removed notes consume storage until permanently deleted. Browser-data clearing still removes the journal; writes across simultaneous tabs are not transactional. No cloud backup or account was added.
- Atlas image coverage remains the original five licensed/provenanced observations and explicit fallbacks for the other records. No new imagery or source records were fabricated.
- Host/project/owner, approved URL, terms, operational contacts, real field-performance metrics and rollback deployment are unknown. Release documentation names these outstanding facts rather than inventing them.
- This task stops at an unmerged PR. No public deployment, paid endpoint, OpenAI API usage or external purchase took place.
