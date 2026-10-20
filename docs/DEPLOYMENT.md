# Content release deployment and rollback

No deployment has been performed. This runbook prepares a release with **AI disabled**; it does not authorize public hosting, paid resources, spending API credit, or merging PRs.

## Build contract

- Node 24, npm with the committed lockfile: `npm ci`.
- Build: `npm run build`. On a Node host, run `npm run start -- --hostname 127.0.0.1 --port 3000` behind the host's TLS/reverse proxy. Managed Next.js platforms use their native build/output integration.
- No database, Redis, OpenAI key or NASA key is needed for the content application. Redis is used only by isolated admission tests until AI infrastructure is explicitly implemented and approved.
- `SITE_URL`: optional locally; set to the approved HTTPS origin for a release (no path, query, credentials or localhost). An invalid configured value fails the build.
- `ALLOW_INDEXING`: defaults off; set exactly `true` only for an approved public release. Keep previews false. **Rebuild** after changing either value: metadata/robots/sitemap are prerendered.
- Use a private/protected preview if deployment is approved for validation. Robots and noindex are crawler requests, not authentication.

## Review and release procedure

1. Review PRs in order #4, #5, #6, #7, #8, then the release-preparation PR. After an approved merge, retarget the next PR to main and rebase if needed (especially after squash merging). Re-run CI on the resulting head; a green stacked branch is not proof that a differently merged commit is green.
2. Record the exact candidate SHA, environment, owner and rollback SHA. Do not bundle unrelated features after the November 6 freeze.
3. Require TypeScript, unit/API tests, isolated Redis tests, build and browser tests. Inspect browser artifacts. Run `npm audit --omit=dev --audit-level=high` and investigate findings rather than blindly updating dependencies.
4. On the approved private preview, verify TLS, expected commit, root/object/journey routes, unknown-route 404, Atlas/scale URLs and NASA/news fallback behavior. Verify security headers survive the host's proxy.
5. GET `/api/health` must return `{"status":"ok","ai":"disabled"}` and no-store. GET and POST `/api/ai` must remain 503 even if old environment variables exist. Do not send paid test calls.
6. Verify robots, sitemap and metadata for the intended environment. The sitemap excludes API and My Cosmos routes and does not invent modification dates.
7. Complete manual screen-reader/zoom checks and mobile network/performance review. Suggested acceptance targets: no blocking accessibility failures; p75 LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 when real-user data becomes available. A synthetic lab score is not a field measurement.
8. Review privacy copy against the actual host's access-log retention and third-party policies; set a support/contact channel in the release record. No analytics SDK is currently installed.
9. Obtain explicit founder approval for the exact public deployment. Only then publish through the selected provider and repeat the production smoke checklist.

## Monitoring without paid dependencies

Use the host's included logs and metrics if available. Record route/status/duration and a non-sensitive request ID; do not log notes, full prompts, credentials, raw upstream bodies or precise visitor location. Monitor 5xx rate and response time separately from expected `/api/ai` 503. Alert on repeated content-route errors and sustained NASA/news fallback status. The liveness endpoint does not prove that external feeds are healthy.

No remote monitor or scheduled automation has been created. Choose a free monitor or manual checks after the production URL is approved. Verify log access and retention, and document who receives alerts. Load tests and real user performance collection remain unperformed.

## Rollback and incidents

Keep the last verified immutable deployment or candidate SHA. If a release breaks core routes, restore that deployment through the host's documented rollback mechanism, then verify health, AI 503, Atlas/scale links and note saves. Record the incident and failed SHA. The content release has no database migration; never clear user browser storage as a deployment fix.

AI remains hard-disabled. If a later approved release activates it, its emergency procedure must include disabling shared admission and the server switch, preserving the budget ledger and reviewing in-flight provider usage. Do not rotate or expose keys without explicit approval. See SECURITY_ARCHITECTURE.md for those separate activation gates.

## Release record (fill before launch)

- Candidate SHA / successful CI run:
- Approved host / project / owner / URL:
- Public deployment approval:
- Free-plan eligibility / quotas / cost controls:
- Previous good deployment / tested rollback:
- Manual accessibility / science / performance evidence:
- Log retention / monitor / alert recipient / support channel:
- Known limitations: AI offline; seasonal planner; browser-local journal; schematic visualizations.
