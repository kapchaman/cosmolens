import { expect, test } from "vitest";
import { normalizeApodResponse } from "@/lib/integrations/apod";
import { parseFeedItems } from "@/lib/integrations/rss";
const apod = { title: "A nebula", date: "2026-10-20", explanation: "<p>Explanation: Stars &amp; dust</p>", media_type: "image", url: "https://science.nasa.gov/article/", hdurl: "https://assets.science.nasa.gov/nebula.jpg" };
test.each([{}, null, [], { error: "upstream error" }, { ...apod, title: 12 }, { ...apod, date: "2026-02-30" }, { ...apod, hdurl: "javascript:alert(1)" }, { ...apod, hdurl: undefined }])("never labels malformed APOD live: %j", (data) => {
  expect(normalizeApodResponse(data).status).toBe("fallback");
});
test("normalizes current NASA shape and picks the latest valid entry", () => {
  const item = normalizeApodResponse([{ ...apod, date: "2026-10-19" }, {}, apod]);
  expect(item.status).toBe("live"); expect(item.date).toBe("2026-10-20");
  expect(item.imageUrl).toBe(apod.hdurl); expect(item.sourceUrl).toBe(apod.url);
  expect(item.explanation).toBe("Stars & dust");
});
test("video/iframe entries keep a source link without treating the page as an image", () => {
  expect(normalizeApodResponse({ ...apod, media_type: "iframe", hdurl: "" })).toMatchObject({ status: "live", mediaType: "video", imageUrl: undefined });
});
const source = { id: "nasa" as const, name: "NASA", url: "https://www.nasa.gov/feed/" };
function entry(links: string) { return `<feed><entry><title>Galaxy discovery</title><summary>Stars in space</summary>${links}</entry></feed>`; }
test("Atom selects alternate HTML despite self/enclosure links and attribute order", () => {
  const items = parseFeedItems(entry(`<link href="https://www.nasa.gov/self" rel="self"/><link rel="enclosure" href="https://www.nasa.gov/file.mp4"/><link type='text/html' href='/article/?x=1&amp;y=2' rel='alternate'/>`), source);
  expect(items[0].url).toBe("https://www.nasa.gov/article/?x=1&y=2");
});
test("Atom allows an omitted rel and rejects unsafe links and self-only entries", () => {
  expect(parseFeedItems(entry(`<link href='https://www.nasa.gov/article'/>`), source)).toHaveLength(1);
  expect(parseFeedItems(entry(`<link href='javascript:alert(1)'/>`), source)).toEqual([]);
  expect(parseFeedItems(entry(`<link href='https://www.nasa.gov/self' rel='self'/>`), source)).toEqual([]);
});
test("RSS text links and invalid dates are handled", () => {
  const [item] = parseFeedItems(`<rss><item><title>Star</title><link>https://www.nasa.gov/article</link><pubDate>not a date</pubDate></item></rss>`, source);
  expect(item.url).toBe("https://www.nasa.gov/article"); expect(item.publishedAt).toBeNull();
});

test('news descriptions exclude navigation chrome and preserve paragraph boundaries',()=>{
  const rss=(description:string)=>`<rss><item><title>Galaxy discovery</title><link>https://www.nasa.gov/article</link><description><![CDATA[${description}]]></description></item></rss>`;
  expect(parseFeedItems(rss('<p>Stars.</p><p>New results.</p>'),source)[0].summary).toBe('Stars. New results.');
  expect(parseFeedItems(rss('Explore This Section Overview Technology Programs'),source)[0].summary).toBe('Official source item. Open the source for full context.');
  expect(parseFeedItems(rss('APOD Science APOD Submissions Index Search Calendar RSS'),source)[0].summary).not.toContain('Submissions');
  expect(parseFeedItems(rss('<div>2 min read</div><p>Preparations for a mission.</p>'),source)[0].summary).toBe('Preparations for a mission.');
});
