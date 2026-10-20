import { afterEach, expect, test, vi } from "vitest";
import { GET as aiGet, POST as aiPost } from "@/app/api/ai/route";
import { GET as apodGet } from "@/app/api/nasa/apod/route";
import { GET as newsGet } from "@/app/api/news/route";
afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });
test("AI stays disabled despite env flags; it never calls any upstream", async () => {
  vi.stubEnv("AI_PUBLIC_ENABLED", "true"); vi.stubEnv("OPENAI_API_KEY", "test-not-a-secret");
  const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
  for (const response of [aiGet(), aiPost()]) {
    expect(response.status).toBe(503); expect(await response.text()).not.toContain("test-not-a-secret");
  }
  expect(fetch).not.toHaveBeenCalled();
});
test.each([{}, [], { error: "bad payload" }])("APOD malformed 200 responses are fallback with short caching: %j", async (body) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(body)));
  const response = await apodGet();
  expect((await response.json()).status).toBe("fallback"); expect(response.headers.get("cache-control")).toContain("s-maxage=600");
});
test("APOD network error degrades without leaking internals", async () => {
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("private upstream diagnostic")));
  const response = await apodGet(); expect(response.status).toBe(200); expect(await response.text()).not.toContain("private upstream");
});
test("APOD aborts a stalled upstream", async () => {
  vi.useFakeTimers();
  vi.stubGlobal("fetch", vi.fn((_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener("abort", () => reject(new Error("aborted"))))));
  const result = apodGet(); await vi.advanceTimersByTimeAsync(8001);
  expect((await (await result).json()).status).toBe("fallback");
});
test("news tolerates partial source failure", async () => {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => url.includes("jpl") ? new Response(`<rss><item><title>Galaxy discovery</title><link>https://www.jpl.nasa.gov/news/galaxy/</link></item></rss>`) : new Response("", { status: 503 })));
  const body = await (await newsGet()).json();
  expect(body.status).toBe("live"); expect(body.items).toHaveLength(1); expect(body.errors).toHaveLength(2);
});
