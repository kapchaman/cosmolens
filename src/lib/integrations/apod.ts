import { z } from "zod";
import { parseCalendarDate } from "@/lib/astronomy/dates";
import { htmlToPlainText } from "@/lib/integrations/text";
import { safeHttpUrl } from "@/lib/integrations/url";
import type { ApodItem } from "@/types/integrations";

export const fallbackApod: ApodItem = {
  title: "Astronomy Picture of the Day", date: null,
  explanation: "NASA APOD is temporarily unavailable. Explore the atlas or open NASA’s archive while we reconnect.",
  mediaType: "fallback", sourceUrl: "https://science.nasa.gov/mission/apod/",
  status: "fallback", provider: "NASA APOD",
};
const payloadSchema = z.object({
  title: z.string().trim().min(1).max(1000),
  date: z.string().refine((date) => parseCalendarDate(date) !== null),
  explanation: z.string().trim().min(1).max(50000),
  media_type: z.enum(["image", "video", "iframe", "other"]),
  permalink: z.string().optional(), url: z.string().optional(), hdurl: z.string().optional(),
  alt: z.string().optional(), credit: z.string().optional(), copyright: z.string().optional(),
});

export function normalizeApod(input: unknown): ApodItem {
  const parsed = payloadSchema.safeParse(input);
  if (!parsed.success) return fallbackApod;
  const data = parsed.data;
  const title = htmlToPlainText(data.title);
  const explanation = htmlToPlainText(data.explanation).replace(/^Explanation:\s*/i, "").trim();
  const sourceUrl = safeHttpUrl(data.permalink) || safeHttpUrl(data.url);
  // NASA's September 2026 API uses `url` for the article, NOT the image.
  // See https://github.com/nasa/apod-api#docs. Do not inject basic_html.
  const imageUrl = data.media_type === "image" ? safeHttpUrl(data.hdurl) : undefined;
  if (!title || !explanation || !sourceUrl || (data.media_type === "image" && !imageUrl)) return fallbackApod;
  return {
    title, date: data.date, explanation, sourceUrl, imageUrl,
    mediaType: data.media_type === "iframe" ? "video" : data.media_type,
    alt: htmlToPlainText(data.alt), credit: htmlToPlainText(data.credit), copyright: htmlToPlainText(data.copyright),
    status: "live", provider: "NASA APOD",
  };
}

export function normalizeApodResponse(input: unknown): ApodItem {
  if (!Array.isArray(input)) return normalizeApod(input);
  // The public endpoint can return a collection; select the latest valid entry.
  return input.map(normalizeApod).filter((item) => item.status === "live")
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))[0] || fallbackApod;
}
