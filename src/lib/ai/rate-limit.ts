import { createHash, randomUUID } from "node:crypto";

export type Admission = { allowed: true; leaseId: string } | { allowed: false };
export interface AdmissionStore {
  reserve(principal: string, reserveMicrousd: number): Promise<Admission>;
  release(leaseId: string): Promise<void>;
}
export type RedisEval = (script: string, options: { keys: string[]; arguments: string[] }) => Promise<unknown>;

// All keys share one Redis Cluster hash slot. Budget state has no TTL and must
// be explicitly provisioned; a missing/evicted state fails closed.
export const admissionScript = `
local enabled = redis.call('HGET', KEYS[1], 'enabled')
local remaining = tonumber(redis.call('HGET', KEYS[1], 'remaining_microusd'))
if enabled ~= '1' or not remaining or remaining < tonumber(ARGV[1]) then return 0 end
local clock = redis.call('TIME')
local now = tonumber(clock[1]) * 1000 + math.floor(tonumber(clock[2]) / 1000)
redis.call('ZREMRANGEBYSCORE', KEYS[4], '-inf', now)
if redis.call('ZCARD', KEYS[4]) >= tonumber(ARGV[4]) then return 0 end
if tonumber(redis.call('GET', KEYS[2]) or '0') >= tonumber(ARGV[2]) then return 0 end
if tonumber(redis.call('GET', KEYS[3]) or '0') >= tonumber(ARGV[3]) then return 0 end
redis.call('HINCRBY', KEYS[1], 'remaining_microusd', -tonumber(ARGV[1]))
if redis.call('INCR', KEYS[2]) == 1 then redis.call('PEXPIRE', KEYS[2], 60000) end
if redis.call('INCR', KEYS[3]) == 1 then redis.call('PEXPIRE', KEYS[3], 60000) end
redis.call('ZADD', KEYS[4], now + 45000, ARGV[5])
redis.call('PEXPIRE', KEYS[4], 60000)
return 1
`;
const releaseScript = "return redis.call('ZREM', KEYS[1], ARGV[1])";

export function createRedisAdmissionStore(evaluate: RedisEval, options: {
  namespace: string; perIdentityPerMinute: number; globalPerMinute: number; concurrent: number;
}): AdmissionStore {
  if (!/^[a-zA-Z0-9-]{1,80}$/.test(options.namespace)) throw new Error("Invalid admission namespace");
  for (const n of [options.perIdentityPerMinute, options.globalPerMinute, options.concurrent]) {
    if (!Number.isSafeInteger(n) || n < 1 || n > 10000) throw new Error("Invalid admission limits");
  }
  const prefix = `{${options.namespace}}`;
  return {
    async reserve(principal, reserveMicrousd) {
      if (!principal || principal.length > 300 || !Number.isSafeInteger(reserveMicrousd) || reserveMicrousd < 1 || reserveMicrousd > 1e9) throw new Error("Invalid reservation");
      const subject = createHash("sha256").update(principal).digest("hex");
      const leaseId = randomUUID();
      const result = await evaluate(admissionScript, {
        keys: [`${prefix}:state`, `${prefix}:identity:${subject}`, `${prefix}:global`, `${prefix}:leases`],
        arguments: [String(reserveMicrousd), String(options.perIdentityPerMinute), String(options.globalPerMinute), String(options.concurrent), leaseId],
      });
      if (result === 0) return { allowed: false };
      if (result !== 1) throw new Error("Invalid admission response");
      return { allowed: true, leaseId };
    },
    async release(leaseId) {
      await evaluate(releaseScript, { keys: [`${prefix}:leases`], arguments: [leaseId] });
      // No automatic refund. Failed/timed-out upstream work may still be billed.
    },
  };
}
