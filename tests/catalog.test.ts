import { expect, test } from "bun:test";
test("public catalog has unique canonical families, searchable categories and bounded read-only retrieval", async () => {
  const { catalog, listCatalog, getCatalogItem } =
    await import("../packages/catalog/src");
  expect(new Set(catalog.map((item) => item.id)).size).toBe(catalog.length);
  for (const kind of ["component", "pattern", "foundation", "mood"])
    expect(catalog.some((item) => item.kind === kind)).toBe(true);
  expect(
    listCatalog({ query: "button" }).items.some((item) => item.id === "button"),
  ).toBe(true);
  expect(
    listCatalog({ category: "Forms" }).items.every(
      (item) => item.category === "Forms",
    ),
  ).toBe(true);
  expect(listCatalog({ limit: 1000 }).items.length).toBeLessThanOrEqual(12);
  expect(listCatalog({ query: "unlikely-zebra-thing" }).total).toBe(0);
  expect(getCatalogItem("button")?.title).toBe("Button");
  expect(getCatalogItem("../../.env")).toBeUndefined();
  expect(JSON.stringify(catalog)).not.toMatch(
    /sourcePath|\/home\/|credentials|api_key/i,
  );
});
