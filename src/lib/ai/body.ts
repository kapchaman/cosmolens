import { AI_LIMITS } from "@/lib/ai/limits";
export class RequestError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function readBoundedJson(request: Request, maxBytes: number = AI_LIMITS.bodyBytes, timeoutMs = 5000): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new RequestError(415, "Use application/json.");
  if (request.headers.has("content-encoding") && request.headers.get("content-encoding") !== "identity") throw new RequestError(415, "Encoded bodies are unsupported.");
  const declared = request.headers.get("content-length");
  if (declared !== null && (!/^\d+$/.test(declared) || !Number.isSafeInteger(Number(declared)))) throw new RequestError(400, "Invalid body length.");
  if (declared !== null && Number(declared) > maxBytes) throw new RequestError(413, "Request is too large.");
  if (!request.body) throw new RequestError(400, "Missing request body.");
  const reader = request.body.getReader();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { reject(new RequestError(408, "Request body timed out.")); void reader.cancel().catch(() => {}); }, timeoutMs);
  });
  try {
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await Promise.race([reader.read(), deadline]);
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) { void reader.cancel().catch(() => {}); throw new RequestError(413, "Request is too large."); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    try { return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes)); }
    catch { throw new RequestError(400, "Invalid JSON body."); }
  } finally { clearTimeout(timer); reader.releaseLock(); }
}
