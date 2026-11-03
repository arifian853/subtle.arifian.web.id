import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
import { componentCategories } from "../packages/catalog/src";
test("built public routes have unique metadata, semantic content, navigation and discoverable sitemap entries", () => {
  const build = Bun.spawnSync(["bun", "run", "build"], {
    env: {
      ...process.env,
      ASTRO_TELEMETRY_DISABLED: "1",
      XDG_CACHE_HOME: `${process.cwd()}/.cache`,
    },
  });
  expect(build.exitCode).toBe(0);
  const titles = new Set<string>();
  const sitemap = readFileSync("apps/web/dist/sitemap.xml", "utf8");
  for (const route of [
    "",
    "foundations",
    "components",
    "patterns",
    "motion",
    "moods",
    "about",
  ]) {
    const path = `apps/web/dist/${route ? `${route}/` : ""}index.html`;
    expect(existsSync(path)).toBe(true);
    const document = new JSDOM(readFileSync(path, "utf8")).window.document;
    expect(document.querySelectorAll("h1").length).toBe(1);
    expect(
      document.querySelector("main")?.textContent?.trim().length,
    ).toBeGreaterThan(200);
    expect(
      document.querySelector('nav[aria-label="Main navigation"]'),
    ).toBeTruthy();
    const canonical = `https://subtle.arifian.web.id/${route ? `${route}/` : ""}`;
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe(canonical);
    expect(sitemap).toContain(`<loc>${canonical}</loc>`);
    titles.add(document.title);
  }
  expect(titles.size).toBe(7);
}, 30000);
test("every component category has a usable static route, unique canonical metadata and a filtered explorer", () => {
  for (const category of componentCategories) {
    const slug = category.toLowerCase();
    const file = `apps/web/dist/components/${slug}/index.html`;
    expect(existsSync(file)).toBe(true);
    const document = new JSDOM(readFileSync(file, "utf8")).window.document;
    expect(document.title).toContain(`${category} components`);
    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe(`https://subtle.arifian.web.id/components/${slug}/`);
    expect(
      document.querySelector('select[name="category"] option[selected]')
        ?.textContent,
    ).toBe(category);
  }
});

test("motion token table scroll region is named and keyboard-focusable", () => {
  const document = new JSDOM(
    readFileSync("apps/web/dist/motion/index.html", "utf8"),
  ).window.document;
  const region = document.querySelector(".motion-reference .table-scroll");
  expect(region?.getAttribute("role")).toBe("region");
  expect(region?.getAttribute("tabindex")).toBe("0");
  expect(region?.getAttribute("aria-label")).toBe(
    "Motion token table, scroll horizontally",
  );
});
