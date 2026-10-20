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

Local verification on 2026-10-21: 42 unit/API tests and production build passed. The 16 browser cases were collected, but Chromium installation returned a “Site Unavailable” HTML response instead of a ZIP. Browser execution remains a required gate until CI or an unrestricted development environment runs it.
