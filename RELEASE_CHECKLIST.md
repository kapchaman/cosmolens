# CosmoLens v1 release checklist

## P0 — must pass before public release
- [ ] Identify hosting provider, deployment URL, production branch, rollback mechanism and allowed commercial usage.
- [ ] Keep paid AI endpoint disabled until trusted identification, distributed rate limits, global budget guard, and kill switch are verified in deployed environment.
- [ ] Enforce streamed request body size cap, strict schema validation, token limits and safe upstream error handling.
- [ ] Remove public key fingerprint/model diagnostics and confirm no secrets appear in client bundles, logs or repository.
- [ ] Correct Mercury relationships (Europa and Ganymede belong to Jupiter); audit other scientific relations and sources.
- [ ] Verify environment variables are stored as server secrets, never `NEXT_PUBLIC_` values.
- [ ] Verify production build and typecheck on the actual release commit.
- [ ] Check mobile navigation and critical journeys manually on narrow screens.

## P1 — quality and reliability
- [ ] Validate and recover malformed `localStorage` records.
- [ ] Surface failed note saves; do not imply persistence after exceptions.
- [ ] Make journey conclusion and AI prompts specific to each journey.
- [ ] Reset or partition assistant history when comparison context changes.
- [ ] Ensure AI response length does not break subsequent history validation.
- [ ] Validate APOD payload before labeling it live.
- [ ] Restore URL query/deep-link state in Atlas and scale explorer.
- [ ] Fix keyboard focus trap, Escape close and focus return for search modal.
- [ ] Add portable browser tests, unit/API tests, and CI; avoid hard-coded browser executables.
- [ ] Review Atom alternate link selection and observation date edge cases.

## Release verification
- [ ] Confirm astronomical facts against cited primary/credible sources.
- [ ] Test accessibility with keyboard and screen reader basics.
- [ ] Test fallback behavior when NASA or OpenAI is unavailable.
- [ ] Confirm error monitoring, privacy notice and safe logging.
- [ ] Check performance on mobile and slow networks.
- [ ] Run smoke tests against preview and production URLs.
- [ ] Document release commit, known limitations, rollback and emergency AI-disable procedure.
- [ ] Have founder explicitly approve deployment and any cost-bearing resources.

## Suggested sequence
1. Infrastructure discovery and default-off paid AI.
2. Security and science correctness.
3. Reliability fixes and mobile accessibility.
4. Automated regression suite and CI.
5. Preview deployment, validation, then founder-approved public release.

No deployment, secret access, live API test or paid resource creation was performed for this documentation audit.
