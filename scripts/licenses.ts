import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { readdir, readFile, realpath, writeFile } from "node:fs/promises";

const queue = [
  resolve("apps/web/package.json"),
  resolve("apps/api/package.json"),
];
const seen = new Set<string>();
const notices: string[] = [];
const unresolved: string[] = [];
while (queue.length) {
  const manifest = await realpath(queue.shift()!);
  const pkg = JSON.parse(await readFile(manifest, "utf8"));
  const key = `${pkg.name}@${pkg.version ?? "workspace"}`;
  if (seen.has(key)) continue;
  seen.add(key);
  const directory = dirname(manifest);
  if (!pkg.private) {
    const candidates = (await readdir(directory))
      .filter((name) => /^(licen[cs]e|copying|notice)(\.|$)/i.test(name))
      .sort();
    const texts: string[] = [];
    for (const candidate of candidates) {
      try {
        texts.push(await readFile(join(directory, candidate), "utf8"));
      } catch {
        /* Directory, not a license text. */
      }
    }
    notices.push(
      `${key}\nLicense: ${typeof pkg.license === "string" ? pkg.license : "See upstream notice"}\n${texts.join("\n") || `Upstream: ${typeof pkg.repository === "string" ? pkg.repository : (pkg.repository?.url ?? pkg.homepage ?? pkg.name)}`}`,
    );
  }
  const require = createRequire(manifest);
  for (const name of Object.keys(pkg.dependencies ?? {})) {
    if (name.startsWith("@subtle/")) continue;
    let entry: string | undefined;
    try {
      const candidate = require.resolve(`${name}/package.json`);
      if (JSON.parse(await readFile(candidate, "utf8")).name === name)
        entry = candidate;
      else throw new Error("Nested module manifest");
    } catch {
      try {
        let location = dirname(require.resolve(name));
        for (let level = 0; level < 12; level++) {
          try {
            const candidate = join(location, "package.json");
            if (JSON.parse(await readFile(candidate, "utf8")).name === name) {
              entry = candidate;
              break;
            }
          } catch {}
          location = dirname(location);
        }
      } catch {
        /* Some packages intentionally have no root entry point. */
      }
    }
    if (!entry) {
      let location = directory;
      for (let level = 0; level < 12; level++) {
        const candidate = join(location, "node_modules", name, "package.json");
        try {
          if (JSON.parse(await readFile(candidate, "utf8")).name === name) {
            entry = candidate;
            break;
          }
        } catch {}
        location = dirname(location);
      }
    }
    if (entry) queue.push(entry);
    else unresolved.push(`${pkg.name}: ${name}`);
  }
}
const fontNotices = await Promise.all(
  ["Inclusive-Sans", "JetBrains-Mono", "Lexend-Deca"].map((name) =>
    readFile(`apps/web/public/fonts/OFL-${name}.txt`, "utf8"),
  ),
);
await writeFile(
  "apps/web/public/licenses.txt",
  `Subtle dependency and font notices\n\nPublic runtime/build dependency notices are reproduced below. Original Subtle compositions and botanical vector study are authored for this site.\n\n${fontNotices.join("\n\n")}\n\n${notices.sort().join("\n\n==============================\n\n")}`,
);
console.log(
  `Recorded ${notices.length} dependency notices and 3 complete font licenses.`,
);
await writeFile(
  ".qa/license-inventory.json",
  JSON.stringify(
    { packages: seen.size, notices: notices.length, unresolved },
    null,
    2,
  ),
);
if (unresolved.length) {
  console.error("Unresolved dependency notices:", unresolved);
  process.exit(1);
}
