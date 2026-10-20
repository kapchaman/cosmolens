import { NextResponse } from "next/server";
import { htmlToPlainText } from "@/lib/integrations/text";
import type { ApodItem, ApodMediaType } from "@/types/integrations";

export const runtime = "nodejs";
export const revalidate = 3600;

const APOD_ENDPOINT = "https://science.nasa.gov/wp-json/wp/v2/apod-basic";

type NasaApodPayload = {
  date?: string;
  title?: string;
  permalink?: string;
  media_type?: string;
  explanation?: string;
  credit?: string;
  copyright?: string;
  alt?: string;
  url?: string;
  hdurl?: string;
};

const fallbackApod: ApodItem = {
  title: "Astronomy Picture of the Day",
  date: null,
  explanation:
    "NASA APOD could not be reached. CosmoLens keeps the exploration surface available and will reconnect to NASA data when the service responds.",
  mediaType: "fallback",
  sourceUrl: "https://science.nasa.gov/mission/apod/",
  status: "fallback",
  provider: "NASA APOD",
};

function normalizeMediaType(value?: string): ApodMediaType {
  if (value === "image" || value === "video") {
    return value;
  }

  return value ? "other" : "fallback";
}

function htmlToText(value?: string) {
  if (!value) {
    return undefined;
  }

  return htmlToPlainText(value).replace(/^Explanation:\s*/i, "");
}

function normalizeApod(payload: NasaApodPayload): ApodItem {
  const mediaType = normalizeMediaType(payload.media_type);

  return {
    title: payload.title || fallbackApod.title,
    date: payload.date || null,
    explanation: htmlToText(payload.explanation) || fallbackApod.explanation,
    mediaType,
    imageUrl: mediaType === "image" ? payload.hdurl || payload.url : undefined,
    sourceUrl: payload.permalink || payload.url || fallbackApod.sourceUrl,
    alt: payload.alt,
    credit: htmlToText(payload.credit),
    copyright: htmlToText(payload.copyright),
    status: "live",
    provider: "NASA APOD",
  };
}

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8_000);
  const apiKey = (process.env.NASA_API_KEY || "DEMO_KEY").trim() || "DEMO_KEY";
  const url = new URL(APOD_ENDPOINT);
  url.searchParams.set("api_key", apiKey);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate },
    });

    if (!response.ok) {
      return NextResponse.json(fallbackApod, {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
      });
    }

    const data = (await response.json()) as NasaApodPayload | NasaApodPayload[];
    const item = Array.isArray(data) ? data[0] : data;

    return NextResponse.json(normalizeApod(item || {}), {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
    });
  } catch {
    return NextResponse.json(fallbackApod, {
      status: 200,
      headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
    });
  } finally {
    clearTimeout(timeout);
  }
}
