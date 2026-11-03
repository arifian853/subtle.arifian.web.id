import { expect, test } from "bun:test";
import { moods } from "../packages/catalog/src/tokens";
function rgb(hex: string) {
  return hex
    .replace("#", "")
    .match(/../g)!
    .map((value) => parseInt(value, 16));
}
function mix(a: string, b: string, weight: number) {
  return rgb(a).map((value, i) => value * weight + rgb(b)[i]! * (1 - weight));
}
function luminance(color: number[]) {
  return color
    .map((value) => value / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    )
    .reduce(
      (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index]!,
      0,
    );
}
function contrast(a: number[], b: number[]) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
test("all eight moods meet AA for the actual body, derived muted, action, container, and semantic status pairs", () => {
  for (const [id, mood] of Object.entries(moods)) {
    const t: Record<string, string> = mood.tokens;
    const pairs: [string, number[], number[]][] = [
      ...[
        "--bg-main",
        "--bg-surface",
        "--bg-surface-variant",
        "--bg-surface-hover",
      ].flatMap((bg) => [
        [`body ${bg}`, rgb(t["--text-main"]!), rgb(t[bg]!)] as [
          string,
          number[],
          number[],
        ],
        [
          `muted ${bg}`,
          t["--text-subtle-readable"]
            ? rgb(t["--text-subtle-readable"])
            : mix(t["--text-muted"]!, t["--text-main"]!, 0.72),
          rgb(t[bg]!),
        ] as [string, number[], number[]],
      ]),
      ["primary", rgb(t["--bg-main"]!), rgb(t["--primary"]!)],
      ["primary hover", rgb(t["--bg-main"]!), rgb(t["--primary-hover"]!)],
      [
        "primary container",
        rgb(t["--on-primary-container"]!),
        rgb(t["--primary-container"]!),
      ],
      [
        "secondary container",
        rgb(t["--on-secondary-container"]!),
        rgb(t["--secondary-container"]!),
      ],
      [
        "available",
        rgb(t["--status-available-text-aa"] ?? t["--status-success-text"]!),
        rgb(t["--status-available-bg"]!),
      ],
      [
        "pending",
        mix(t["--status-pending-text"]!, t["--text-main"]!, 0.8),
        rgb(t["--status-pending-bg"]!),
      ],
      ["error", rgb(t["--status-error-text"]!), rgb(t["--status-error-bg"]!)],
    ];
    for (const [role, foreground, background] of pairs)
      expect(
        contrast(foreground, background),
        `${id} ${role}`,
      ).toBeGreaterThanOrEqual(4.5);
  }
});
test("Rosewood explicit correction tokens are connected to the rendered supporting text and status roles", async () => {
  const css = await Bun.file("apps/web/src/styles/global.css").text();
  expect(/--readable-muted:\s*var\(\s*--text-subtle-readable,/.test(css)).toBe(
    true,
  );
  expect(
    /var\(\s*--status-available-text-aa,\s*var\(--status-success-text\)\s*\)/.test(
      css,
    ),
  ).toBe(true);
});
test("form control boundaries and focus indicators meet the non-text contrast threshold in every mood", async () => {
  for (const [id, mood] of Object.entries(moods)) {
    expect(
      contrast(
        rgb(mood.tokens["--secondary"]),
        rgb(mood.tokens["--bg-surface"]),
      ),
      `${id} control boundary`,
    ).toBeGreaterThanOrEqual(3);
    expect(
      contrast(
        rgb(mood.tokens["--border-active"]),
        rgb(mood.tokens["--bg-main"]),
      ),
      `${id} focus`,
    ).toBeGreaterThanOrEqual(3);
  }
  const css = await Bun.file("apps/web/src/styles/global.css").text();
  expect(
    /\.input\s*\{[^}]*border:\s*1px solid var\(--secondary\)/s.test(css),
  ).toBe(true);
});
