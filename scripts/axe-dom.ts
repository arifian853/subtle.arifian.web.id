import { JSDOM } from "jsdom";
import axe from "axe-core";
import { pages } from "../apps/web/src/lib/seo";
import { readFile, writeFile } from "node:fs/promises";
const results = [];
for (const path of Object.keys(pages)) {
  const html = await readFile(`apps/web/dist${path}index.html`, "utf8");
  const dom = new JSDOM(html, {
    runScripts: "outside-only",
    url: `https://subtle.test${path}`,
  });
  dom.window.eval(axe.source);
  const result = await (dom.window as unknown as { axe: typeof axe }).axe.run(
    dom.window.document,
    {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
      },
      rules: { "color-contrast": { enabled: false } },
    },
  );
  results.push({
    path,
    violations: result.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.map((node) => ({
        target: node.target,
        summary: node.failureSummary,
      })),
    })),
    incomplete: result.incomplete.map((item) => item.id),
  });
}
await writeFile(
  ".qa/axe-dom.json",
  JSON.stringify(
    {
      scope:
        "Static DOM only. No browser layout, hydration, or contrast verification.",
      results,
    },
    null,
    2,
  ),
);
for (const result of results)
  console.log(
    `${result.path}: ${result.violations.length} semantic axe violations`,
  );
if (results.some((result) => result.violations.length)) process.exit(1);
