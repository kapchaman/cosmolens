import { expect, test, vi, afterEach } from "vitest";
import { readBoundedJson } from "@/lib/ai/body";
afterEach(() => vi.useRealTimers());
const request = (body: BodyInit, headers: Record<string, string> = {}) => new Request("https://test.invalid", { method: "POST", body, headers: { "Content-Type": "application/json", ...headers }, duplex: "half" } as RequestInit);
test("reads JSON and validates media type, encoding and declared size", async () => {
  expect(await readBoundedJson(request('{"hello":1}'))).toEqual({ hello: 1 });
  await expect(readBoundedJson(request('{}', { 'Content-Type': 'text/plain' }))).rejects.toMatchObject({ status: 415 });
  await expect(readBoundedJson(request('{}', { 'Content-Encoding': 'gzip' }))).rejects.toMatchObject({ status: 415 });
  await expect(readBoundedJson(request('{}', { 'Content-Length': '65537' }))).rejects.toMatchObject({ status: 413 });
  await expect(readBoundedJson(request('{}', { 'Content-Length': '-1' }))).rejects.toMatchObject({ status: 400 });
});
test("counts streamed UTF-8 bytes despite absent or dishonest length", async () => {
  for (const headers of [{}, { 'Content-Length': '1' }]) {
    const body = new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode('"🌌')); controller.enqueue(new TextEncoder().encode('🌌"')); controller.close(); } });
    await expect(readBoundedJson(request(body, headers as Record<string,string>), 8)).rejects.toMatchObject({ status: 413 });
  }
});
test("rejects malformed JSON and invalid UTF-8", async () => {
  await expect(readBoundedJson(request('{'))).rejects.toMatchObject({ status: 400 });
  await expect(readBoundedJson(request(new Uint8Array([255])))).rejects.toMatchObject({ status: 400 });
});
test("cancels a body that never finishes", async () => {
  vi.useFakeTimers(); const cancel = vi.fn();
  const assertion = expect(readBoundedJson(request(new ReadableStream({ cancel })))).rejects.toMatchObject({ status: 408 });
  await vi.advanceTimersByTimeAsync(5001); await assertion; expect(cancel).toHaveBeenCalledOnce();
});
