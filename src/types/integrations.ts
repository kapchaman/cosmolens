export type ApodMediaType = "image" | "video" | "other" | "fallback";

export type ApodItem = {
  title: string;
  date: string | null;
  explanation: string;
  mediaType: ApodMediaType;
  imageUrl?: string;
  sourceUrl?: string;
  alt?: string;
  credit?: string;
  copyright?: string;
  status: "live" | "fallback";
  provider: "NASA APOD";
};

export type NewsSourceId = "nasa" | "jpl" | "esa";

export type AstronomyNewsItem = {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string | null;
  source: {
    id: NewsSourceId;
    name: string;
    type: "official-feed";
  };
};

export type AstronomyNewsResponse = {
  status: "live" | "fallback";
  updatedAt: string;
  items: AstronomyNewsItem[];
  errors: Array<{
    source: NewsSourceId;
    message: string;
  }>;
};
