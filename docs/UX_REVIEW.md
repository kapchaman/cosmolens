# UX review — 2026-10-20

Acceptance: all major destinations reachable at 390 px; search usable without a pointer; focus visible; empty/error/loading states actionable; no page-level horizontal overflow in the production browser suite; current visual identity retained.

## Implemented

- Responsive navigation includes all eight primary destinations, including Discoveries. Mobile controls expose expanded state, current route and Escape/close behavior.
- Search uses a native modal dialog: background inertness, keyboard focus containment, initial input focus, Escape, focus return, an accessible input name and live result count.
- Skip-to-content link and target spacing below the sticky header.
- Narrow-width grid children can shrink; filters scroll without shrinking controls; long scientific names wrap. Touch controls have a 44 px minimum height. Disabled buttons are visibly disabled and do not animate on hover.
- Route loading/retry boundary, client fetch retry, Atlas result count, selected-state semantics for lab/visualization controls. Existing reduced-motion support remains in place.
- 12 representative route smoke cases at desktop/mobile sizes save screenshots and check page errors, headings and overflow. Keyboard, search, skip link and mobile navigation have behavioral regressions.

## Verification boundary

TypeScript, 42 unit/API tests, production build and 48 desktop/mobile browser scenarios passed in GitHub Actions. Screenshots were reviewed; this found and corrected the primary link contrast, mobile heading size, desktop navigation visibility and Atlas filter layout. Screen-reader output, contrast across every visual region, 200–400% zoom, low-end-device performance and actual external-media failures still need manual acceptance. This is not a WCAG conformance certification.
