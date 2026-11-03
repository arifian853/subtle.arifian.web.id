import { expect, test } from "bun:test";
import { moods } from "../packages/catalog/src/tokens";

test("pre-paint mood bootstrap validates storage, applies dark scheme/theme color, and survives blocked storage", async () => {
  const { moodBootScript } = await import("../apps/web/src/lib/mood");
  for (const saved of ["sky-night", "rosewood", "bad", null]) {
    const root = {
      dataset: {} as Record<string, string>,
      style: {} as Record<string, string>,
    };
    const meta = { content: "" };
    const document = { documentElement: root, querySelector: () => meta };
    new Function("document", "localStorage", moodBootScript)(document, {
      getItem: () => saved,
    });
    const expected =
      saved === "sky-night" || saved === "rosewood" ? saved : "beige";
    expect(root.dataset.mood).toBe(expected);
    expect(root.style.colorScheme).toBe(
      moods[expected].dark ? "dark" : "light",
    );
    expect(meta.content).toBe(moods[expected].tokens["--bg-main"]);
  }
  const root = { dataset: {}, style: {} };
  expect(() =>
    new Function("document", "localStorage", moodBootScript)(
      { documentElement: root, querySelector: () => null },
      {
        getItem: () => {
          throw Error("blocked");
        },
      },
    ),
  ).not.toThrow();
  expect(root.dataset).toEqual({ mood: "beige" });
});
