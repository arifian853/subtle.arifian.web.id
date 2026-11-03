import { expect, test } from "bun:test";
import { JSDOM } from "jsdom";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { MoodGallery } from "../apps/web/src/components/Homepage";
import { moods, moodOrder } from "../packages/catalog/src/tokens";
test("each real mood specimen links to its published token details", () => {
  const document = new JSDOM(renderToStaticMarkup(createElement(MoodGallery)))
    .window.document;
  expect(document.querySelectorAll(".mood-mini a")).toHaveLength(8);
  for (const id of moodOrder) {
    const link = document.querySelector(
      `a[aria-label="Explore ${moods[id].name} mood"]`,
    );
    expect(link?.getAttribute("href")).toBe(`/moods/#${id}`);
  }
});
