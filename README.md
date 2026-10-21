# CosmoLens

An astronomy education platform built with Next.js 16, React 19, TypeScript, Tailwind CSS and Zod. Explore 33 curated objects, ten cosmic scales, comparisons, three guided journeys, conceptual visualizations, NASA imagery, observation guidance and a local personal journal.

**Public AI is intentionally offline:** GET/POST `/api/ai` return 503. Adding an API key does not enable it. The protection foundation is isolated from the public route and uses fake providers in tests. No OpenAI account or credits are required for development.

## Development

Use Node 24 (minimum supported: 22.12) and the committed npm lockfile.

```bash
npm ci
npm run dev
```

Environment variables are optional locally. `.env.example` documents `SITE_URL` and `ALLOW_INDEXING`; no keys are needed for the current NASA adapter. My Cosmos data stays in the current browser and is not a backup or cross-device account.

## Verification

```bash
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

Shared-admission tests additionally require an isolated local Redis:

```bash
TEST_REDIS_URL=redis://127.0.0.1:6379 npm run test:redis
```

GitHub Actions runs the complete suite, including an ephemeral Redis service and desktop/mobile Chromium. See [testing details](docs/TESTING.md). Browser tests mock public data feeds and do not call paid AI.

## Product boundaries

- Scientific observations, estimates and models have distinct labels; source presence alone is not proof of factual accuracy.
- Graphs and scale scenes are educational illustrations, not measured datasets or precision simulations.
- Observation Planner provides seasonal guidance and approximate lunar phase, not real-time ephemerides.
- External NASA/news failures have explicit fallbacks.
- No public deployment or paid resource is authorized by a successful build.

## Project documentation

- [Development plan and November 13 milestone](docs/DEVELOPMENT_PLAN.md)
- [Scientific review and remaining editorial work](docs/SCIENTIFIC_REVIEW.md)
- [UX review](docs/UX_REVIEW.md)
- [AI security architecture and activation gates](SECURITY_ARCHITECTURE.md)
- [Hosting audit](DEPLOYMENT_AUDIT.md)
- [Deployment and rollback runbook](docs/DEPLOYMENT.md)
- [Release checklist](RELEASE_CHECKLIST.md)

The review branches are intentionally stacked. Review in PR order and retarget/rebase each successor after an approved merge, especially if squash merging. Never merge or deploy automatically.
