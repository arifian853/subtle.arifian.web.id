import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import { pages } from "../apps/web/src/lib/seo";
import { componentCategories } from "../packages/catalog/src";
const root = "apps/web/dist";
async function walk(path: string): Promise<string[]> {
  return (
    await Promise.all(
      (await readdir(path, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? walk(join(path, entry.name))
          : [join(path, entry.name)],
      ),
    )
  ).flat();
}
const files = (await walk(root)).sort();
const hashes: string[] = [];
let size = 0;
const violations: string[] = [];
for (const file of files) {
  const relative = file.slice(root.length + 1);
  if (
    /(^|\/)(\.env[^/]*|\.git|node_modules|\.qa|\.cache|AGENTS\.md|DESIGN\.md|IMPLEMENTATIONPLAN\.md|ImplementationStatus\.md)|\.(map|test\.[^.]+|ts|tsx|astro)$/.test(
      relative,
    )
  )
    violations.push(`Out-of-scope artifact: ${relative}`);
  const bytes = await readFile(file);
  size += bytes.byteLength;
  hashes.push(
    `${createHash("sha256").update(bytes).digest("hex")}  ${relative}`,
  );
  if (/\.(js|css|html|txt|xml|json)$/.test(file)) {
    const content = bytes.toString("utf8");
    if (
      /\/home\/arifian|\/tmp\/|BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|(?:sk-proj-|ghp_|github_pat_)[A-Za-z0-9_]{12,}/.test(
        content,
      )
    )
      violations.push(`Private path or credential marker: ${relative}`);
  }
  if (file.endsWith(".html")) {
    const document = new JSDOM(bytes.toString("utf8")).window.document;
    if (document.querySelectorAll("h1").length !== 1)
      violations.push(`Expected one h1: ${relative}`);
    for (const element of document.querySelectorAll(
      '[src], link[rel="stylesheet"], link[as="font"]',
    )) {
      const source =
        element.getAttribute("src") ?? element.getAttribute("href") ?? "";
      if (/^https?:\/\//.test(source))
        violations.push(`External runtime asset: ${relative}: ${source}`);
      if (source.startsWith("/")) {
        const asset = Bun.file(`${root}${source}`);
        if (!(await asset.exists()))
          violations.push(`Missing runtime asset: ${source}`);
      }
    }
    if (document.querySelector('meta[property="og:image"]'))
      violations.push(`Unapproved social artwork: ${relative}`);
    const html = bytes.toString("utf8");
    if (
      html.indexOf("localStorage.getItem('subtle:mood:v1')") >
      html.indexOf("<body")
    )
      violations.push(`Mood application after body: ${relative}`);
  }
}
for (const path of [
  ...Object.keys(pages),
  ...componentCategories.map(
    (category) => `/components/${category.toLowerCase()}/`,
  ),
]) {
  if (!(await Bun.file(`${root}${path}index.html`).exists()))
    violations.push(`Missing route: ${path}`);
}
for (const [path, expected] of Object.entries({
  "DESIGN.md":
    "2b6246bd7c2df1d36c6a7680f429f075b9f9b544b00116595d9b8c385e7445ca",
  "IMPLEMENTATIONPLAN.md":
    "fad7fa65702cba59d5b2c1ee6555eb79b2e9b25bf3c84e29ac8bad977adb3173",
}))
  if (
    createHash("sha256")
      .update(await readFile(path))
      .digest("hex") !== expected
  )
    violations.push(`Canonical document changed: ${path}`);
await Bun.write(".qa/artifact-sha256.txt", `${hashes.join("\n")}\n`);
const report = {
  files: files.length,
  bytes: size,
  pages: files.filter((file) => file.endsWith(".html")).length,
  treeSha256: createHash("sha256").update(hashes.join("\n")).digest("hex"),
  violations,
};
await Bun.write(".qa/artifact-audit.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (violations.length) process.exit(1);
