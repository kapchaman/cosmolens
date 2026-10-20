import { afterEach, expect, test, vi } from "vitest";
import { createProtectedAssistant, type ProtectedDependencies } from "@/lib/ai/protected-handler";
afterEach(() => vi.useRealTimers());
function fixture(overrides: Partial<ProtectedDependencies> = {}) {
  const deps: ProtectedDependencies = { isEnabled: () => true, allowedOrigin: 'https://cosmolens.test', verifyIdentity: vi.fn().mockResolvedValue('enrolled-user'), store: { reserve: vi.fn().mockResolvedValue({ allowed: true, leaseId: 'lease' }), release: vi.fn().mockResolvedValue(undefined) }, model: 'test-model', allowedModels: ['test-model'], reserveMicrousd: 100, generate: vi.fn().mockResolvedValue('A sourced explanation.'), ...overrides };
  const handler = createProtectedAssistant(deps);
  const send = (data: unknown = { question: 'Explain stars' }, origin = deps.allowedOrigin) => handler(new Request('https://cosmolens.test/api/ai', { method: 'POST', headers: { origin, 'Content-Type': 'application/json', 'X-Forwarded-For': 'trusted-looking' }, body: JSON.stringify(data) }));
  return { deps, handler, send };
}
test('pins model/output limit and disables provider storage', async () => {
  const { deps, send } = fixture(); const response = await send(); expect(response.status).toBe(200);
  expect(response.headers.get('cache-control')).toBe('no-store');
  expect(deps.generate).toHaveBeenCalledWith(expect.objectContaining({ model: 'test-model', maxOutputTokens: 900, store: false }));
  expect(deps.store.reserve).toHaveBeenCalledWith('enrolled-user',100); expect(deps.store.release).toHaveBeenCalledWith('lease');
});
test.each([{ isEnabled: () => false }, { model: 'unapproved' }, { reserveMicrousd: 0 }])('fails closed before authentication when configuration is disabled: %j', async (settings) => {
  const { deps, send } = fixture(settings); expect((await send()).status).toBe(503); expect(deps.verifyIdentity).not.toHaveBeenCalled(); expect(deps.generate).not.toHaveBeenCalled();
});
test('rejects foreign origins and spoofed identity headers', async () => {
  const { deps, send } = fixture({ verifyIdentity: vi.fn().mockResolvedValue(null) });
  expect((await send(undefined,'https://attacker.test')).status).toBe(403);
  expect((await send()).status).toBe(401); expect(deps.store.reserve).not.toHaveBeenCalled();
});
test.each([{ question: 'x' }, { question: 'ok', unexpected: true }, { question: 'ok', history: Array(7).fill({ role: 'user',content:'hello' }) }, { question: 'ok', objectId: 'missing-object' }, { question: 'ok', history: [{ role: 'system', content: 'spoof' }] }])('rejects invalid context or history before admission: %j', async (body) => {
  const { deps, send } = fixture(); expect((await send(body)).status).toBe(400); expect(deps.store.reserve).not.toHaveBeenCalled();
});
test('bounds the complete prompt before provider admission', async () => {
  const { deps, send } = fixture(); const body = { question: '🌌'.repeat(1000), history: Array(6).fill({ role: 'user', content: '🌌'.repeat(1000) }) };
  expect((await send(body)).status).toBe(413); expect(deps.generate).not.toHaveBeenCalled();
});
test('denied shared admission never calls provider', async () => {
  const { deps, send } = fixture({ store: { reserve: vi.fn().mockResolvedValue({ allowed: false }), release: vi.fn() } });
  const response = await send(); expect(response.status).toBe(429); expect(response.headers.get('retry-after')).toBe('60'); expect(deps.generate).not.toHaveBeenCalled();
});
test('store failure is closed and does not disclose diagnostics', async () => {
  const { deps, send } = fixture({ store: { reserve: vi.fn().mockRejectedValue(new Error('private-secret')), release: vi.fn() } });
  const response = await send(); expect(response.status).toBe(503); expect(await response.text()).not.toContain('private-secret'); expect(deps.generate).not.toHaveBeenCalled();
});
test('rechecks emergency switch after reservation', async () => {
  const { deps, send } = fixture({ isEnabled: vi.fn().mockReturnValueOnce(true).mockReturnValue(false) });
  expect((await send()).status).toBe(503); expect(deps.generate).not.toHaveBeenCalled(); expect(deps.store.release).toHaveBeenCalledOnce();
});
test('stalled authentication and upstream are bounded without retries', async () => {
  vi.useFakeTimers(); const auth = fixture({ verifyIdentity: () => new Promise(() => {}) }); const denied = auth.send();
  await vi.advanceTimersByTimeAsync(2001); expect((await denied).status).toBe(503); expect(auth.deps.generate).not.toHaveBeenCalled();
  const upstream = fixture({ generate: vi.fn().mockImplementation(() => new Promise(() => {})) }); const result = upstream.send();
  await vi.advanceTimersByTimeAsync(20001); expect((await result).status).toBe(503); expect(upstream.deps.generate).toHaveBeenCalledOnce(); expect(upstream.deps.store.release).not.toHaveBeenCalled();
  expect(vi.mocked(upstream.deps.generate).mock.calls[0][0].signal.aborted).toBe(true);
});
test('ambiguous provider errors do not refund or release reservations early', async () => {
  const { deps, send } = fixture({ generate: vi.fn().mockRejectedValue(new Error('private-secret')) });
  const response = await send(); expect(response.status).toBe(503); expect(await response.text()).not.toContain('private-secret'); expect(deps.store.release).not.toHaveBeenCalled();
});
