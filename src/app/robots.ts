import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexingEnabled } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  if (!isIndexingEnabled()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/my-cosmos"] }, sitemap: new URL("/sitemap.xml", getSiteUrl()).href };
}
