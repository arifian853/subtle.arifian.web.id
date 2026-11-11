import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { catalog } from "../packages/catalog/src";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { JSDOM } from "jsdom";

test("ordered component hierarchy retains the 27 stable IDs and groups related button variants", async () => {
  const { componentHierarchy } = await import("../packages/catalog/src");
  const ids =
    "button icon-button input textarea select checkbox adaptive-header mood-switcher tabs command tonal-card mosaic-tile inspector context-capsule status progress toast skeleton empty dialog sheet metric chart data-table media ai-message ai-composer".split(
      " ",
    );
  for (const id of ids)
    expect(
      catalog.find((item) => item.id === id && item.kind === "component"),
    ).toBeTruthy();
  expect(componentHierarchy[0]?.families[0]?.ids).toEqual([
    "button",
    "icon-button",
  ]);
  for (const id of [...ids, "mood-picker", "scrollbar"]) {
    expect(
      componentHierarchy
        .flatMap((group) => group.families.flatMap((family) => family.ids))
        .filter((value) => value === id),
    ).toHaveLength(1);
  }
});

test("chart families share finite synthetic data and accessible tables", async () => {
  const { chartKinds, studioSeries } =
    await import("../apps/web/src/components/Charts");
  expect(chartKinds).toEqual(["area", "bar", "line", "pie", "composed"]);
  expect(studioSeries.length).toBeGreaterThanOrEqual(5);
  for (const row of studioSeries) {
    expect(Number.isFinite(row.studies)).toBe(true);
    expect(Number.isFinite(row.reviews)).toBe(true);
  }
  const { Charts } = await import("../apps/web/src/components/Charts");
  const document = new JSDOM(renderToStaticMarkup(createElement(Charts))).window
    .document;
  expect(document.querySelectorAll("table")).toHaveLength(5);
  for (const table of document.querySelectorAll("table")) {
    expect(table.querySelector("caption")?.textContent).toContain(
      "synthetic counts",
    );
    expect(table.querySelectorAll("tbody tr")).toHaveLength(
      studioSeries.length,
    );
    expect(table.textContent).toContain("Jun48");
  }
});

test("brief pages explain corners, motion provenance, composition and authorship", () => {
  const read = (path: string) => readFileSync(`apps/web/src/${path}`, "utf8");
  expect(read("pages/foundations/index.astro")).toContain(
    "outer radius = inner radius + inset",
  );
  expect(read("pages/foundations/index.astro")).toContain("superellipse");
  expect(read("pages/motion/index.astro")).toContain("2097581354837770703");
  expect(read("pages/motion/index.astro")).toContain("interrupt");
  expect(read("pages/patterns/index.astro")).toContain("Components to combine");
  expect(read("components/Homepage.tsx")).toContain("author and curator");
  expect(read("layouts/Layout.astro")).toContain("'Charts'");
});


test("radius credits use the supplied article and distinguish official SwiftUI geometry", () => {
  for (const page of ["about", "foundations"]) {
    const source = readFileSync(`apps/web/src/pages/${page}/index.astro`, "utf8");
    expect(source).toContain("Jitendra Kumar");
    expect(source).toContain("Getting Your Border Radius Right: A Simple Trick for Smooth Nested Containers");
    expect(source).toContain("https://medium.com/design-bootcamp/getting-your-border-radius-right-a-simple-trick-for-smooth-nested-containers-f6e0025e8c53");
    expect(source).toContain("R_outer = R_inner + padding");
    expect(source).toContain("https://developer.apple.com/documentation/swiftui/roundedcornerstyle/continuous");
    expect(source).toContain("https://developer.apple.com/documentation/swiftui/concentricrectangle");
    expect(source).not.toContain("Alexandra Basova");
    expect(source).not.toContain("1f86eed56dd3");
  }
});
