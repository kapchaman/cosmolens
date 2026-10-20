# CosmoLens deployment audit — 2026-10-20

## Evidence inspected
- `package.json`: Next.js 16.3.8, React 19, Node-based build/start scripts; `playwright-core` visual smoke script.
- `next.config.ts`: no hosting adapter; disables powered-by header; lucide import optimization.
- `README.md`: documents local development and environment configuration; no confirmed live deployment URL.
- `.env.example`: `OPENAI_API_KEY`, `OPENAI_MODEL`, `NASA_API_KEY` placeholders.
- `.gitignore`: ignores local environment files.
- Lookups for `vercel.json`, `netlify.toml`, `wrangler.toml`, and `.github/workflows/ci.yml` returned 404. This does not rule out dashboard-based deployments or differently named CI workflows.

## Conclusion
**Hosting provider and live deployment status: UNKNOWN.** A Next.js application and an existing GitHub repository are not proof of a deployed service. No provider dashboard or DNS inspection was performed. No secrets were read or disclosed.

## Manual verification
1. In GitHub repository settings, check Environments, Actions and Deployments.
2. In Vercel, Netlify and Cloudflare dashboards, search for the project and inspect linked repository, production URL, deployment history and environment names. Do not share secret values.
3. If a public URL exists, verify which commit is deployed, production logs, API routing, and TLS.
4. Check whether any domain DNS points to a deployment; do not infer ownership from a URL alone.
5. Confirm whether the intended site will be personal/non-commercial or commercial before choosing free hosting terms.

## Hosting options
| Option | Fit | Considerations |
| --- | --- | --- |
| Vercel | Natural Next.js workflow | Verify current free-plan commercial restrictions, function quotas, cost controls, and region limits in official documentation before use. |
| Cloudflare | Strong edge ecosystem | Confirm Next.js compatibility for Node runtime, filesystem assumptions, and OpenAI route behavior; may require an adapter and architectural changes. |
| Existing host | Potentially lowest migration effort | Cannot evaluate until identified. |
| Self-managed VPS | Maximum control | Hosting cost, patching, backups, observability and operational burden make it unsuitable for a zero-budget first release. |

**Conditional recommendation:** prefer an already functioning compatible host; otherwise evaluate Vercel first for ease of Next.js deployment, subject to verified terms and budget constraints. Do not create accounts or paid resources before approval.

## Current status
Repository-only review; no production dashboard access, runtime tests, deployment or API calls.
