import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

test("homepage leads with an asymmetric live specimen and every planned narrative section", async () => {
  const { Homepage } = await import("../apps/web/src/components/Homepage");
  const html = renderToStaticMarkup(createElement(Homepage));
  expect(html).toContain("Interfaces with");
  expect(html).toContain("a softer side.");
  for (const id of [
    "moods",
    "principles",
    "mosaic",
    "modes",
    "signatures",
    "motion",
    "gallery",
    "closing",
  ]) {
    expect(html).toContain(`id="${id}"`);
  }
  expect(html).toContain("Quiet Expressiveness");
  expect(html).toContain("Editorial Composition");
  expect(html).toContain("Tonal Materiality");
  expect(html).toContain("Soft enough for stories.");
});
