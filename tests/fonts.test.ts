import { expect, test } from "bun:test";
test("required font families are self-hosted WOFF2 assets with complete license notices", async () => {
  for (const family of ["lexend-deca", "inclusive-sans", "jetbrains-mono"]) {
    const font = Bun.file(`apps/web/public/fonts/${family}-latin.woff2`);
    expect(await font.exists()).toBe(true);
    expect((await font.text()).slice(0, 4)).toBe("wOF2");
  }
  const notices = await Bun.file("apps/web/public/licenses.txt").text();
  for (const name of [
    "Lexend",
    "Inclusive",
    "JetBrains",
    "SIL OPEN FONT LICENSE",
  ])
    expect(notices).toContain(name);
  const css = await Bun.file("apps/web/src/styles/global.css").text();
  expect(css.match(/@font-face/g)?.length).toBe(3);
  expect(css).not.toContain("fonts.googleapis.com");
});
