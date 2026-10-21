# CosmoLens deployment audit — 2026-10-20

## Confirmed repository state

Next.js 16.3.8, React 19, a committed npm lockfile and Node build/start commands. GitHub Actions verifies a production build, unit/API tests, Redis concurrency tests and Chromium desktop/mobile scenarios. Basic HTTP security headers, explicit indexing configuration and a minimal liveness route are included in the release-preparation branch. No provider-specific deployment adapter or confirmed production URL is present.

**Hosting provider and live deployment status remain unknown.** A repository and successful Actions run are not evidence of a public deployment. No provider dashboard, DNS ownership, secret values or billing account was inspected. Earlier audit findings about absent CI and unsafe active AI describe the pre-fix baseline, not the proposed release stack.

## Hosting options checked against current official documentation

| Option | Fit for this project | Decision boundary |
| --- | --- | --- |
| Existing compatible Next.js host | Least migration work if it exists | Confirm owner, deployed commit, TLS, logs, quotas and rollback first. |
| Vercel Hobby | Straightforward Next.js operation for a personal non-commercial release | [Hobby terms](https://vercel.com/docs/plans/hobby) restrict use to personal/non-commercial projects. Product monetization may require a different plan; no paid upgrade is authorized. Quotas can pause features. |
| Cloudflare Workers | Potential option after a compatibility proof | [Current Next.js guidance](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/) recommends vinext, which is in beta. Its API compatibility and runtime behavior need testing for this exact app. Do not migrate the production toolchain merely to meet a date. |
| Static-only hosting | Free hosts may serve exported pages | Current API routes and dynamic comparison behavior make a static export an architectural change. It is not a drop-in deployment. |
| Self-managed server | Works with Node | Requires an existing machine plus patching, TLS, backups and monitoring. Not the default for a zero-budget solo project. |

Recommendation: first identify any existing host. Otherwise evaluate a personal content release on a compatible free Next.js service, subject to its terms and quotas. Keep paid AI disabled. Hosting/provider configuration remains a founder decision after a concrete private validation plan; no accounts/resources were created.

## Required discovery before deployment

1. Confirm existing GitHub Deployments/Environments and any connected provider dashboard. Record the production URL, owner, project and deployed commit without copying secret values.
2. Confirm personal/non-commercial eligibility or select another permitted service; identify quota-exhaustion behavior and prevent automatic paid upgrades.
3. Confirm the host can run the pinned Next.js/Node build, execute route handlers, reach public NASA/news feeds, and apply headers/cache semantics.
4. Record private preview access, deployment approval, rollback and log retention. `noindex` is not access control.
5. Use [the deployment runbook](docs/DEPLOYMENT.md) and [release gates](RELEASE_CHECKLIST.md) on the approved release commit.
