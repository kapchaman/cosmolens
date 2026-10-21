import type { MetadataRoute } from "next";
import { getAllObjects, getJourneys } from "@/lib/astronomy/catalog";
import { getSiteUrl, isIndexingEnabled } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getSiteUrl();
  if (!origin || !isIndexingEnabled()) return [];
  const paths = ['/', '/atlas', '/compare', '/journeys', '/discoveries', '/lab', '/observe', '/privacy', ...getAllObjects().map(o=>`/objects/${o.id}`), ...getJourneys().map(j=>`/journeys/${j.id}`)];
  // Do not fabricate lastModified dates from the build time.
  return paths.map(path=>({ url:new URL(path,origin).href }));
}
