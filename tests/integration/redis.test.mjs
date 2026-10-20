import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { createClient } from 'redis';
import { createRedisAdmissionStore } from '../../src/lib/ai/rate-limit.ts';
const url = process.env.TEST_REDIS_URL;
if (!url || !['127.0.0.1', 'localhost', '[::1]'].includes(new URL(url).hostname)) throw new Error('Set TEST_REDIS_URL to an isolated local Redis test service.');
async function fixture(options = {}, budget = 1000) {
  const namespace = `test-${randomUUID()}`; const state = `{${namespace}}:state`;
  const clients = [createClient({ url }), createClient({ url })];
  for (const client of clients) { client.on('error', () => {}); await client.connect(); }
  await clients[0].hSet(state, { enabled: '1', remaining_microusd: String(budget) });
  const stores = clients.map(client => createRedisAdmissionStore((script,args) => client.eval(script,args), { namespace, perIdentityPerMinute:100, globalPerMinute:100, concurrent:100, ...options }));
  return { clients, stores, state, async close() { const keys = await clients[0].keys(`{${namespace}}:*`); if(keys.length) await clients[0].del(keys); await Promise.all(clients.map(c=>c.quit())); } };
}
test('multiple clients cannot overspend the global atomic budget', async () => {
  const f=await fixture({}, 500); try {
    const results=await Promise.all(Array.from({length:50},(_,i)=>f.stores[i%2].reserve(`user-${i}`,100)));
    assert.equal(results.filter(r=>r.allowed).length,5); assert.equal(await f.clients[0].hGet(f.state,'remaining_microusd'),'0');
  } finally {await f.close();}
});
for(const [name,options,expected,sameIdentity] of [['identity',{perIdentityPerMinute:2},2,true],['global',{globalPerMinute:3},3,false],['concurrency',{concurrent:1},1,false]]) {
  test(`shared ${name} limits hold under concurrency`, async()=>{
    const f=await fixture(options);try {
      const results=await Promise.all(Array.from({length:10},(_,i)=>f.stores[i%2].reserve(sameIdentity?'user':`user-${i}`,10)));
      assert.equal(results.filter(r=>r.allowed).length,expected);
    } finally {await f.close();}
  });
}
test('missing budget and shared kill switch fail closed', async()=>{
  const f=await fixture();try {
    await f.clients[0].hSet(f.state,'enabled','0');assert.equal((await f.stores[1].reserve('user',10)).allowed,false);
    await f.clients[0].del(f.state);assert.equal((await f.stores[0].reserve('user',10)).allowed,false);
  } finally {await f.close();}
});
test('releasing concurrency never refunds the budget', async()=>{
  const f=await fixture({concurrent:1},100);try {
    const first=await f.stores[0].reserve('user',40);assert.equal(first.allowed,true);await f.stores[1].release(first.leaseId);
    assert.equal((await f.stores[1].reserve('user',40)).allowed,true);assert.equal(await f.clients[0].hGet(f.state,'remaining_microusd'),'20');
  } finally {await f.close();}
});
