import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

test("all eight moods match every canonical color in DESIGN.md, including Rosewood corrections", async () => {
  const { moods } = await import("../packages/catalog/src/tokens");
  const design = readFileSync(new URL("../DESIGN.md", import.meta.url), "utf8");
  const blocks = [
    ...design.matchAll(
      /## (Teal|Graphite|Slate|Forest|Beige|Sky Night|Lavender|Rosewood)\n\n```css\n([\s\S]*?)```/g,
    ),
  ];
  expect(blocks).toHaveLength(8);
  expect(Object.keys(moods)).toHaveLength(8);
  for (const [, name, css] of blocks) {
    const id = name!.toLowerCase().replace(" ", "-");
    const expected = Object.fromEntries(
      [...css!.matchAll(/(--[\w-]+):\s*(#[0-9A-F]{6})/g)].map((m) => [
        m[1],
        m[2],
      ]),
    );
    expect(
      moods[id as keyof typeof moods].tokens as Record<string, string>,
    ).toEqual(expected);
  }
});
