# CosmoLens release checklist — target November 13, 2026

Completed items below describe **review branches**, not merged main or a deployed service. Revalidate the actual approved release SHA after merges. No public deployment is authorized yet.

## Engineering implemented and tested

- [x] Previously merged Jupiter/Pleiades relationship corrections retained.
- [x] Public AI hard-disabled with generic 503; no key diagnostics or paid calls.
- [x] Malformed storage recovery and failed note-save feedback.
- [x] Journey-specific content, AI context reset and bounded history.
- [x] APOD validation, Atlas/scale deep links, date edge cases and Atom links.
- [x] Mobile navigation, modal focus/Escape/return, loading/error/empty states.
- [x] Portable desktop/mobile browser tests, unit/API tests and GitHub Actions.
- [x] Isolated streamed request limits and shared Redis admission/budget tests. This is not production AI integration.
- [x] Targeted scientific corrections and complete catalog reference integrity tests.
- [x] Deployment/rollback instructions, basic security headers, privacy disclosure, liveness and explicit indexing configuration prepared.

## Required before public content release

- [ ] Founder approves merges; stacked PRs are retargeted/rebased and resulting main passes every CI gate.
- [ ] Host, project owner, public URL, runtime compatibility, free-plan eligibility, quotas and rollback are confirmed.
- [ ] Exact release SHA has a successful install/typecheck/test/Redis/build/browser run; production dependency advisory check is reviewed.
- [ ] Private preview is approved and tested on the selected hosting platform; headers, caching, external feeds and 404s behave correctly.
- [ ] Screen-reader basics, keyboard, 200–400% zoom and narrow-screen use pass manual acceptance. No claim of WCAG certification.
- [ ] Remaining scientific/editorial review in docs/SCIENTIFIC_REVIEW.md is completed for release content.
- [ ] Mobile performance and slow-network behavior are measured; external media loading does not cause unacceptable layout shifts.
- [ ] Correct SITE_URL and ALLOW_INDEXING are set before the release build; robots/sitemap/metadata are verified.
- [ ] Actual hosting log retention, support/contact channel and monitoring owner are recorded; privacy text matches the deployment.
- [ ] Rollback to a known good deployment is tested without deleting personal browser data.
- [ ] Founder explicitly approves the concrete public deployment. Production smoke checks then pass.

## Separate gates for any future paid AI activation

- [ ] Trusted authenticated identity and controlled enrollment implemented on the actual host.
- [ ] Shared rate/concurrency/budget storage durability, no-eviction behavior and fail-closed outages verified across instances.
- [ ] Server-only provider key management, model allowlist, tokenizer/cost reservation, output cap, timeout and no-retry behavior verified.
- [ ] Provider enforced spend limits, alerts, safety margin and emergency switches verified in the actual account.
- [ ] Privacy/retention and abuse controls reviewed; no secret/prompt leakage in browser bundles or logs.
- [ ] Explicit permission obtained for any paid validation call and separately for public AI activation.

The founder's approximately $50 API credit is not an approved development budget. Content release can proceed with AI offline once its own gates pass.
