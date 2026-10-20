import { afterEach, expect, test, vi } from "vitest";
import { getSiteUrl, isIndexingEnabled } from "@/lib/site";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
afterEach(()=>vi.unstubAllEnvs());
test('indexing defaults off and previews publish no sitemap entries',()=>{
 vi.stubEnv('SITE_URL','');vi.stubEnv('ALLOW_INDEXING','true');expect(getSiteUrl()).toBeUndefined();expect(isIndexingEnabled()).toBe(false);expect(sitemap()).toEqual([]);expect(robots().rules).toEqual({userAgent:'*',disallow:'/'});
 vi.stubEnv('SITE_URL','https://cosmolens.example');vi.stubEnv('ALLOW_INDEXING','false');expect(isIndexingEnabled()).toBe(false);expect(sitemap()).toEqual([]);
});
test.each(['http://example.com','https://user:pass@example.com','https://example.com/path','https://example.com?token=x','https://localhost','https://cosmolens.local','bad'])('rejects unsafe metadata origin %s',(url)=>{vi.stubEnv('SITE_URL',url);expect(()=>getSiteUrl()).toThrow();});
test('approved indexing uses only configured origin and public catalog routes',()=>{
 vi.stubEnv('SITE_URL','https://cosmolens.example');vi.stubEnv('ALLOW_INDEXING','true');const entries=sitemap();expect(entries).toHaveLength(44);expect(new Set(entries.map(e=>e.url)).size).toBe(entries.length);expect(entries.every(e=>e.url.startsWith('https://cosmolens.example/'))).toBe(true);expect(entries.some(e=>e.url.includes('/my-cosmos'))).toBe(false);expect(robots().sitemap).toBe('https://cosmolens.example/sitemap.xml');
});
