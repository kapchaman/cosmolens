import { htmlToPlainText, truncateText } from "@/lib/integrations/text";
import type { AstronomyNewsItem, NewsSourceId } from "@/types/integrations";

type FeedSource = {
  id: NewsSourceId;
  name: string;
  url: string;
};

const astronomyKeywords = [
  "astronom",
  "astrophys",
  "black hole",
  "cosmic",
  "cosmos",
  "exoplanet",
  "galax",
  "hubble",
  "james webb",
  "jwst",
  "jpl",
  "milky way",
  "moon",
  "nebula",
  "planet",
  "solar system",
  "space",
  "star",
  "supernova",
  "telescope",
  "universe",
  "webb",
];

function readTag(xml: string, tag: string) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return htmlToPlainText(match?.[1]);
}

function readLink(xml: string) {
  const atomLink = xml.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];

  if (atomLink) {
    return htmlToPlainText(atomLink);
  }

  return readTag(xml, "link");
}

function extractBlocks(xml: string) {
  const rssItems = [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)].map((match) => match[1]);
  const atomEntries = [...xml.matchAll(/<entry\b[^>]*>([\s\S]*?)<\/entry>/gi)].map((match) => match[1]);

  return [...rssItems, ...atomEntries];
}

function isAstronomyRelated(item: AstronomyNewsItem) {
  const haystack = `${item.title} ${item.summary}`.toLowerCase();
  return astronomyKeywords.some((keyword) => haystack.includes(keyword));
}

function parseDate(value: string) {
  if (!value) {
    return null;
  }

  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? null : new Date(timestamp).toISOString();
}

export function parseFeedItems(xml: string, source: FeedSource): AstronomyNewsItem[] {
  return extractBlocks(xml)
    .map((block, index) => {
      const title = readTag(block, "title");
      const summary = readTag(block, "description") || readTag(block, "summary") || readTag(block, "content:encoded");
      const url = readLink(block);
      const publishedAt = parseDate(readTag(block, "pubDate") || readTag(block, "updated") || readTag(block, "published"));
      const id = readTag(block, "guid") || url || `${source.id}-${index}`;

      return {
        id: `${source.id}-${id}`,
        title,
        summary: truncateText(summary || "Official source item. Open the source for full context.", 260),
        url,
        publishedAt,
        source: {
          id: source.id,
          name: source.name,
          type: "official-feed" as const,
        },
      };
    })
    .filter((item) => item.title && item.url)
    .filter((item) => source.id === "jpl" || isAstronomyRelated(item));
}
