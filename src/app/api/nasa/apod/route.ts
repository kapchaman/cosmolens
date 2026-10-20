import { NextResponse } from "next/server";
import { fallbackApod, normalizeApodResponse } from "@/lib/integrations/apod";

export const runtime = "nodejs";
export const revalidate = 3600;
const APOD_ENDPOINT = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  let item = fallbackApod;
  try {
    // This public NASA endpoint requires no API key.
    const response = await fetch(APOD_ENDPOINT, {
      signal: controller.signal, headers: { Accept: "application/json" }, next: { revalidate },
    });
    if (response.ok) item = normalizeApodResponse(await response.json());
  } catch {
    // Generic fallback: no upstream payloads or configuration escape to clients.
  } finally {
    clearTimeout(timeout);
  }
  return NextResponse.json(item, {
    headers: { "Cache-Control": item.status === "live"
      ? "public, s-maxage=3600, stale-while-revalidate=86400"
      : "public, s-maxage=600, stale-while-revalidate=3600" },
  });
}
