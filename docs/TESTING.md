# Testing CosmoLens

Use Node 24 LTS (supported minimum: 22.12). Install with `npm ci`.

```bash
npm audit --omit=dev --audit-level=high
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

Current continuation coverage: 90 unit/API tests, six isolated Redis integration tests and 124 desktop/mobile browser cases (including 14 axe-core WCAG scans). See `docs/observatory/COMPLETION_REPORT.md` for exact execution evidence. Node 24, Next 16.4.5 and Zod 4.6.7 are used. GitHub Actions provides the real Redis and full Chromium zoom run; neither is replaced by a mock claim.

The local environment uses an external headless Chromium 153 binary supplied with `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. It cannot run the full Chrome extension process needed for actual tab zoom. Therefore the 200% browser-zoom gate runs in CI and asserts `innerWidth === 720` and `devicePixelRatio === 2` for a 1440×900 window; CSS zoom and DPR-only emulation do not count.

## GitHub Actions

`.github/workflows/ci.yml` runs on pull requests (including stacked PRs) and pushes to main. It uses Node 24, a lockfile install and a Playwright-managed Chromium browser. It requires no repository secrets, has read-only repository permissions, cancels superseded runs and keeps browser evidence for 30 days. No deployment job exists. The entire browser suite is also the portable smoke gate (`npm run visual:smoke` or `node scripts/visual-smoke.mjs`).

The actual CI result must be inspected before marking a release ready. The existence of a workflow file alone is not passing evidence.

## Shared AI admission tests

`npm run test:redis` requires an **isolated local test Redis**, supplied as `TEST_REDIS_URL=redis://127.0.0.1:6379`. The test refuses a remote host and removes only its own random test namespace. GitHub Actions provisions an ephemeral Redis 7 service and runs this suite. Unit/API tests use injected fake generation only; public AI remains 503. No OpenAI key is needed or used. These tests verify the isolated protection foundation, not production authentication, provider pricing, or store durability.


## Repeatable continuation screenshots

With a local production server on port 3100:

```bash
export CAPTURE_ROUTES='/compare?left=europa&right=enceladus,/my-cosmos,/journeys/dark-matter-evidence,/journeys/life-of-a-star,/journeys/universe-expansion,/discoveries'
CAPTURE_OUTPUT=test-results/completion-after node scripts/capture-observatory.mjs after
CAPTURE_OUTPUT=test-results/completion-zoom node scripts/capture-zoom.mjs
```

The capture script checks overflow, image failures and runtime errors after each of 36 page/viewport combinations. Omit `CAPTURE_ROUTES` to capture Home/Lab/Atlas. A baseline before set must be captured from the actual base build; do not recreate it from the modified branch. Browser evidence uses deterministic unavailable feed fixtures and isolated, empty journal storage.
