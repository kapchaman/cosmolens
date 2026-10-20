# CosmoLens AI security architecture — proposal

## Verified implementation observations
- `src/app/api/ai/route.ts` is a public Node runtime route using a server-side `OPENAI_API_KEY`.
- The limiter key is taken from the first client-supplied `x-forwarded-for` value, with fallback to `local`.
- `src/lib/ai/rate-limit.ts` stores counters in a process-local Map (12 requests per 60 seconds by default); counters are not shared between instances and entries are not purged.
- The route parses `request.json()` before Zod validation, with no application-level raw body size cap.
- A public GET response reveals key fingerprint, key-like status, and model identifier.
- The upstream request sets `max_output_tokens: 900`, a 20-second abort, and `store: false`; these do not constitute a financial cap.
- `.env.example` contains placeholders only; actual runtime secrets and billing settings were not inspected.

## Threat model
Anonymous callers can invoke a paid upstream model. Threats include automated requests, header spoofing, distributed clients, excessive payloads, concurrency races, accidental billing, service exhaustion and disclosure of diagnostic metadata.

## Required controls before public paid AI
1. **Default-off AI:** use `AI_PUBLIC_ENABLED=false` until protections and deployment are verified. A server-side emergency kill switch must be checked before upstream calls. Disable the route if prerequisites are absent.
2. **Trusted identity:** do not use raw `x-forwarded-for`. Determine trusted client IP only through documented, validated hosting-proxy semantics; otherwise require a server-issued, abuse-resistant session or authenticated identity. Neither IP nor anonymous session is sufficient alone against distributed abuse.
3. **Distributed throttling:** atomic counters with TTL in shared persistent infrastructure. Separate per-identity, per-session, and global limits; fail closed if limiter is unavailable. Avoid permanent in-memory maps.
4. **Bound request processing:** reject excessive Content-Length when provided, but also cap actual streamed bytes before JSON parsing; return 413. Strict schema validation, field length limits and short context/history windows.
5. **Global spend guard:** reserve conservative estimated cost or tokens atomically before sending a request, bound concurrency, reconcile actual usage when available, and stop at a configured project budget. Account for in-flight requests, retries and estimation errors. **Application-side accounting alone is not a guaranteed hard monetary ceiling.** Configure available provider-side project budgets/alerts/limits and monitor usage separately; verify actual enforcement semantics.
6. **Upstream safety:** enforce model allowlist, request timeout, output token cap, retries with tight limits, and generic client errors. Never log secrets, raw sensitive prompts or full upstream error bodies.
7. **Remove diagnostics:** public GET should not reveal key fingerprints or configuration; prefer a minimal generic health endpoint, if necessary.
8. **Security validation:** automated tests for spoofed headers, missing limiter, oversized/chunked bodies, malformed requests, budget exhaustion, concurrent requests and upstream failures.
9. **Privacy:** avoid collecting personal data by default; disclose AI processing to users and define retention/deletion behavior.

## Deployment decision
Until a hosting provider and shared storage are confirmed, a safe zero-cost release is **public static/content features with paid AI disabled**. Do not silently downgrade to the current process-local limiter.

## Remaining unknowns
Actual proxy trust chain, provider concurrency semantics, available atomic store, production key settings, OpenAI account spending protections, traffic expectations and costs. These require deployment-specific verification before enabling AI.
