// Server/build configuration. Never infer a canonical host from request headers.
export function getSiteUrl(): URL | undefined {
  const value = process.env.SITE_URL;
  if (!value) return undefined;
  let url: URL;
  try { url = new URL(value); } catch { throw new Error("SITE_URL must be an absolute HTTPS origin"); }
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash || ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || url.hostname.endsWith('.local')) throw new Error("SITE_URL must be a public HTTPS origin without a path or credentials");
  return url;
}
export function isIndexingEnabled(): boolean {
  return Boolean(getSiteUrl()) && process.env.ALLOW_INDEXING === "true";
}
