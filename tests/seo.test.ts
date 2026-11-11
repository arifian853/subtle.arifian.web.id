import { expect, test } from "bun:test";

test("public routes have unique titles, descriptions and canonical URLs without invented social artwork", async () => {
  const { pages, seo } = await import("../apps/web/src/lib/seo");
  expect(Object.keys(pages)).toEqual([
    "/",
    "/foundations/",
    "/components/",
    "/charts/",
    "/patterns/",
    "/motion/",
    "/moods/",
    "/about/",
  ]);
  const titles = new Set<string>();
  for (const path of Object.keys(pages)) {
    const meta = seo(path as keyof typeof pages);
    expect(meta.canonical).toBe(`https://subtle.arifian.web.id${path}`);
    expect(meta.description.length).toBeGreaterThan(60);
    expect(meta.image).toBeUndefined();
    titles.add(meta.title);
  }
  expect(titles.size).toBe(8);
});
