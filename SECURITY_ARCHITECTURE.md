# CosmoLens AI security architecture

Reviewed 2026-10-20. Public AI is deliberately disabled. GET and POST `/api/ai` return a generic HTTP 503 with `Cache-Control: no-store`. No environment flag or API key enables the route. No OpenAI request is made by the application or tests.

## Implemented, isolated foundation

`src/lib/ai/protected-handler.ts` is a candidate server handler with injected dependencies, **not imported by the public route**. It has no authentication or live OpenAI adapter.

- Default-off configuration, exact origin check, model allowlist and a second emergency switch check immediately before generation.
- Requires a verified enrolled account from a server authentication adapter. Forwarded IP headers, body IDs, arbitrary cookies and freely issued anonymous sessions are not identities. Origin checking supplements authentication; it does not replace it.
- Strict schemas, known catalog IDs, 2,000-character questions, six bounded history entries. Rejects oversized declared bodies and counts actual streamed bytes before JSON parsing: 64 KiB, fatal UTF-8 decoding, five-second body deadline, no compression.
- Complete text prompt bounded to 16,000 UTF-8 bytes including a 1,024-byte framing allowance; output capped at 900 tokens. The actual provider adapter must verify the tokenizer/framing bound for the pinned model before activation.
- Authentication and store operations have two-second deadlines. Generation has a 20-second deadline and abort signal, no automatic retries, generic errors and `store: false`.
- Shared Redis Lua admission atomically checks per-account and global one-minute counters, concurrency and a lifetime budget. All keys share a Redis Cluster hash slot. Missing budget, disabled state, exhausted budget, unavailable store or unexpected response fail closed. Raw account IDs are hashed in Redis keys.
- Every admitted request debits an explicitly configured conservative maximum cost in integer micro-USD **before** generation. No automatic refund, even on failure or timeout: ambiguous requests may still be billed. A 45-second concurrency lease remains after ambiguous failures. Successful responses release concurrency only.
- The public route and UI continue their offline fallback. No secrets, key fingerprints, model diagnostics or raw upstream errors are exposed.

## Required operating contract

Provision the Redis state hash `{<namespace>}:state` through a private operator path with `enabled=0` and an explicitly approved `remaining_microusd`. No automatic budget refill, environment-derived default allowance, client-accessible reset or self-provisioning is implemented. The founder's roughly $50 balance is **not** permission to allocate or spend it.

Use one namespace for the entire OpenAI project across instances/deployments. Namespace changes must not reset accounting. Configure authentication, TLS, persistence, backups and a no-eviction policy on the selected store. Restoring an old budget snapshot can restore spent allowance; reconcile provider usage before resuming. Store failure must never fall back to process-local counters. In-flight work can complete after a kill switch; the switch blocks subsequent admission, not already billed work.

Configure the reservation from a reviewed model price and maximum input/output usage, including reasoning tokens where applicable. Reservations are intentionally conservative and may exhaust the allowance early. Validate provider cancellation, timeouts and any SDK retry behavior; disable retries. Do not accept client-provided model, price, limit or budget.

OpenAI's current documentation describes organization/project **enforced spend limits** separately from alerts. Limits can overshoot slightly because accounting is not instantaneous. Configure and verify enforced project limits and alerts in the actual account, with a safety margin; neither this application ledger nor a provider limit proves an exact monetary ceiling.

## Verification and activation gates

Unit/API tests cover malformed and streamed bodies, request deadlines, spoofed identities, unknown IDs, history limits, context size, model allowlist, kill switch, store outages and upstream timeouts/errors. The CI Redis service tests independent clients racing for one budget, identity/global/concurrency limits, shared shutdown, missing state and non-refundable reservations. No paid calls are used.

Before any activation, all of these remain required:

1. Select hosting and a shared persistent store within an approved budget; verify timeout and failure behavior on that platform.
2. Implement server-verified authentication and controlled enrollment, session security/CSRF, account abuse controls and deletion/privacy disclosures.
3. Implement a server-only provider adapter and secret storage; confirm tokenizer and conservative cost calculations for an approved pinned model. Never use `NEXT_PUBLIC_` for secrets.
4. Verify real store durability/failover and provider enforced spend settings. Test multi-instance behavior and monitoring in a private environment.
5. Obtain explicit permission for any paid validation call and, separately, public AI activation. The public route must remain hard-disabled until then.

## Sources

- [Redis atomic scripting](https://redis.io/docs/latest/develop/programmability/eval-intro/)
- [OpenAI API authentication](https://developers.openai.com/api/reference/overview)
- [OpenAI spend limits and enforcement caveat](https://developers.openai.com/api/docs/guides/spend-limits)
- [OpenAI token counting](https://developers.openai.com/api/docs/guides/token-counting)
