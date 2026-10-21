# Testing CosmoLens

Use Node 24 LTS (supported minimum: 22.12). Install with `npm ci`.

```bash
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Vitest covers pure domain logic and directly invokes API handlers with mocked fetch. Playwright starts the production build on `127.0.0.1:3100`, checks desktop/mobile Chromium, and mocks external NASA/news responses. The assistant test uses a local mocked route; no real OpenAI calls or credentials are required. Keep the actual AI route disabled.

`PLAYWRIGHT_BASE_URL` optionally targets an already-running preview. Never point mutation tests at an environment containing personal data. These tests only write isolated browser storage and mock AI. Screenshots/traces are saved on failure in ignored `test-results/`; the HTML report is in `playwright-report/`.

The browser package is pinned for reproducible downloads. If updating Playwright, update its matching browser installation and CI together. Browser download failures are environment failures, not passing tests.

`typecheck` first runs `next typegen` so a clean checkout does not require an earlier dev/build run.

Verification now covers 75 unit/API tests, six isolated Redis integration tests and 52 desktop/mobile browser cases. TypeScript and the production build also pass. GitHub Actions runs the complete suite; inspect the latest PR checks for evidence tied to the exact candidate commit.

In the development workspace, Chromium installation returned a “Site Unavailable” HTML response instead of a ZIP. Browser and real Redis execution were therefore verified in GitHub Actions, not claimed as local successes. CI browser screenshots were also inspected for the responsive layout review.

## GitHub Actions

`.github/workflows/ci.yml` runs on pull requests (including stacked PRs) and pushes to main. It uses Node 24, a lockfile install and a Playwright-managed Chromium browser. It requires no repository secrets, has read-only repository permissions, cancels superseded runs and keeps browser evidence for seven days. No deployment job exists. The entire browser suite is also the portable smoke gate (`npm run visual:smoke` or `node scripts/visual-smoke.mjs`).

The actual CI result must be inspected before marking a release ready. The existence of a workflow file alone is not passing evidence.

## Shared AI admission tests

`npm run test:redis` requires an **isolated local test Redis**, supplied as `TEST_REDIS_URL=redis://127.0.0.1:6379`. The test refuses a remote host and removes only its own random test namespace. GitHub Actions provisions an ephemeral Redis 7 service and runs this suite. Unit/API tests use injected fake generation only; public AI remains 503. No OpenAI key is needed or used. These tests verify the isolated protection foundation, not production authentication, provider pricing, or store durability.
