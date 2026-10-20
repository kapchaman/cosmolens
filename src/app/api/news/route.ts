import { NextResponse } from "next/server";
import { parseFeedItems } from "@/lib/integrations/rss";
import type { AstronomyNewsItem, AstronomyNewsResponse, NewsSourceId } from "@/types/integrations";

export const runtime = "nodejs";
export const revalidate = 1800;

const sources: Array<{ id: NewsSourceId; name: string; url: string }> = [
  { id: "nasa", name: "NASA", url: "https://www.nasa.gov/feed/" },
  { id: "jpl", name: "NASA JPL", url: "https://www.jpl.nasa.gov/feeds/news/" },
  { id: "esa", name: "ESA Space Science", url: "https://www.esa.int/rssfeed/Our_Activities/Space_Science" },
];

function uniqueItems(items: AstronomyNewsItem[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.url.toLowerCase();
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function fetchSource(source: (typeof sources)[number]) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml",
        "User-Agent": "CosmoLens/0.1 (+https://localhost; astronomy exploration project)",
      },
      next: { revalidate },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    return { items: parseFeedItems(xml, source), error: null };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Feed request failed";
    return { items: [], error: { source: source.id, message } };
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET() {
  const results = await Promise.all(sources.map(fetchSource));
  const errors = results.flatMap((result) => (result.error ? [result.error] : []));
  const items = uniqueItems(results.flatMap((result) => result.items))
    .sort((a, b) => {
      const left = a.publishedAt ? Date.parse(a.publishedAt) : 0;
      const right = b.publishedAt ? Date.parse(b.publishedAt) : 0;
      return right - left;
    })
    .slice(0, 8);

  const body: AstronomyNewsResponse = {
    status: items.length ? "live" : "fallback",
    updatedAt: new Date().toISOString(),
    items,
    errors,
  };

  return NextResponse.json(body, {
    headers: { "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=86400" },
  });
}
