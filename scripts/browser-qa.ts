import { chromium, type Page } from "playwright";
import axe from "axe-core";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";
import { moodOrder, moods } from "../packages/catalog/src/tokens";
import { pages } from "../apps/web/src/lib/seo";

// Intercept the exact built tree. This needs no HTTP listener or external network.
const root = resolve("apps/web/dist");
const origin = "https://subtle.test";

await mkdir(".qa/screenshots", { recursive: true });
// Respect the caller’s workspace-owned TMPDIR; never override it.
function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
const errors: string[] = [];
const results: object[] = [];
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.SUBTLE_CHROMIUM_PATH,
    args: ["--no-sandbox"],
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) {
      errors.push(`Unexpected network request: ${url.origin}`);
      await route.abort();
      return;
    }
    const relative = decodeURIComponent(url.pathname);
    const path = resolve(
      root,
      `.${relative.endsWith("/") ? `${relative}index.html` : relative}`,
    );
    if (!path.startsWith(`${root}/`)) {
      await route.fulfill({ status: 403, body: "Forbidden" });
      return;
    }
    const file = Bun.file(path);
    await route.fulfill(
      (await file.exists())
        ? {
            status: 200,
            contentType: file.type,
            body: Buffer.from(await file.arrayBuffer()),
          }
        : { status: 404, body: "Not found" },
    );
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  async function ready(exportName: string) {
    const island = page
      .locator(`astro-island[component-export="${exportName}"]`)
      .first();
    await island.scrollIntoViewIfNeeded();
    await page.waitForFunction(
      (name) =>
        !document
          .querySelector(`astro-island[component-export="${name}"]`)
          ?.hasAttribute("ssr"),
      exportName,
    );
  }
  async function audit(page: Page, label: string) {
    await page.evaluate(() => document.fonts.ready);
    check(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Horizontal page overflow: ${label}`,
    );
    await page.addScriptTag({ content: axe.source });
    const outcome = await page.evaluate(async () =>
      (window as unknown as { axe: typeof axe }).axe.run(document, {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
        },
      }),
    );
    results.push({
      label,
      violations: outcome.violations.map((item) => ({
        id: item.id,
        nodes: item.nodes.map((node) => node.target),
      })),
    });
    const violationDetails = outcome.violations
      .map(
        (item) =>
          `${item.id}: ${item.nodes
            .map(
              (node) =>
                `${node.target.join(" ")} — ${node.failureSummary?.replace(/\s+/g, " ").trim() ?? "no detail"}`,
            )
            .join("; ")}`,
      )
      .join(" | ");
    check(
      !outcome.violations.length,
      `axe violations: ${label}: ${violationDetails}`,
    );
  }
  const waitForColorTransitions = async () => {
    await page.waitForFunction(
      () =>
        !document.getAnimations().some((animation) => {
          const property = (
            animation as Animation & { transitionProperty?: string }
          ).transitionProperty;
          return (
            ["color", "background-color", "border-color"].includes(
              property ?? "",
            ) && animation.playState === "running"
          );
        }),
      undefined,
      { timeout: 1000 },
    );
  };
  await page.goto(`${origin}/`);
  await ready("MoodSwitcher");
  // Native radio keyboard behavior, persistence, pre-paint restoration, and live hero.
  await page.getByRole("radio", { name: "Beige", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  check(
    (await page.evaluate(() => document.documentElement.dataset.mood)) ===
      "forest",
    "Mood radio arrow navigation",
  );
  await page.reload();
  await ready("HeroLive");
  check(
    (await page.evaluate(() => document.documentElement.dataset.mood)) ===
      "forest",
    "Mood persistence",
  );
  await page
    .getByRole("button", { name: "Mark complete", exact: true })
    .click();
  check(
    (await page.locator('.hero-task [role="status"]').textContent()) ===
      "Complete. Collection progress 100%.",
    "Live hero completion",
  );
  await ready("ModeComparison");
  await page.getByRole("tab", { name: "Product", exact: true }).click();
  check(
    await page
      .getByRole("table", { name: "Synthetic studio projects" })
      .isVisible(),
    "Product mode",
  );
  await page.getByRole("tab", { name: "Editorial", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  check(
    (await page
      .getByRole("tab", { name: "Product", exact: true })
      .getAttribute("aria-selected")) === "true",
    "Tabs keyboard navigation",
  );
  await ready("OverlayDemo");
  const inspectorTrigger = page.getByRole("button", {
    name: "Open inspector",
    exact: true,
  });
  await inspectorTrigger.click();
  check(
    await page.getByRole("dialog", { name: "Surface inspector" }).isVisible(),
    "Inspector opens",
  );
  await page.keyboard.press("Tab");
  check(
    await page
      .getByRole("dialog")
      .evaluate((dialog) => dialog.contains(document.activeElement)),
    "Overlay contains focus",
  );
  await page.keyboard.press("Escape");
  // Base UI applies the sheet's exit transition before restoring trigger focus.
  await page
    .getByRole("dialog", { name: "Surface inspector" })
    .waitFor({ state: "detached" });
  check(
    await inspectorTrigger.evaluate(
      (element) => element === document.activeElement,
    ),
    "Focus restoration",
  );
  await ready("CommandDemo");
  await page.getByRole("button", { name: /Search the system/ }).click();
  const search = page.getByRole("searchbox", { name: "Search the system" });
  await search.fill("Layered Sheet");
  await search.press("ArrowDown");
  check(
    await page
      .getByRole("link", { name: /Layered Sheet/ })
      .evaluate((element) => element === document.activeElement),
    "Command arrow navigation",
  );
  await page.keyboard.press("Escape");
  await ready("Conversation");
  await page
    .getByRole("textbox", { name: "Message", exact: true })
    .fill("A synthetic note.");
  await page.getByRole("button", { name: "Send message" }).click();
  check(
    (await page.getByRole("log").textContent())?.includes("A synthetic note."),
    "Local composer",
  );
  // Owned Select keyboard flow and focus restoration in the actual explorer.
  await page.goto(`${origin}/components/`);
  await ready("Explorer");
  const categorySelect = page.getByRole("combobox", {
    name: "Component category",
  });
  await categorySelect.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("option", { name: "Data", exact: true }).click();
  check(
    (await categorySelect.textContent())?.includes("Data"),
    "Owned Select updates label",
  );
  check(
    await page
      .getByRole("link", { name: "Data Table", exact: true })
      .isVisible(),
    "Select filters grouped families",
  );
  check(
    (await page
      .getByRole("link", { name: "Layered Sheet", exact: true })
      .count()) === 0,
    "Select excludes unrelated families",
  );
  await categorySelect.click();
  await page.keyboard.press("Escape");
  check(
    await categorySelect.evaluate(
      (element) => element === document.activeElement,
    ),
    "Select Escape restores focus",
  );
  await page.goto(`${origin}/moods/`);
  await ready("MoodBoards");
  check(
    (await page.getByRole("region").count()) === 8,
    "Exactly eight token boards",
  );
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin,
  });
  await page
    .getByRole("button", { name: "Copy Beige --primary", exact: true })
    .click();
  check(
    (await page.evaluate(() => navigator.clipboard.readText())) ===
      "--primary: #6B5040;",
    "Board copies semantic declaration",
  );
  check(
    (await page.locator(".copy-status").textContent())?.includes(
      "Copied Beige --primary",
    ),
    "Board announces copy",
  );
  const boardMetrics = await page
    .getByRole("region", { name: "Beige token board" })
    .evaluate((element) => ({
      scroll: element.scrollHeight > element.clientHeight,
      tabIndex: (element as HTMLElement).tabIndex,
      overflow: getComputedStyle(element).overflowY,
    }));
  check(
    boardMetrics.scroll &&
      boardMetrics.tabIndex === 0 &&
      boardMetrics.overflow === "auto",
    "Token board uses bounded native scrolling",
  );
  await page.goto(`${origin}/foundations/`);
  await ready("RadiusDemo");
  await page.getByRole("button", { name: "Close corner preview" }).click();
  check(
    await page
      .getByRole("button", { name: "Restore preview" })
      .evaluate((element) => element === document.activeElement),
    "Close preview retains keyboard focus",
  );
  await page.getByRole("button", { name: "Restore preview" }).click();
  // Seven viewport widths against every primary route.
  for (const width of [320, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of Object.keys(pages)) {
      await page.goto(`${origin}${path}`);
      if (path === "/components/" && width >= 1024) {
        const metrics = await page
          .locator('nav[aria-label="Component families"]')
          .evaluate((element) => ({
            overflowY: getComputedStyle(element).overflowY,
            scrollHeight: element.scrollHeight,
            clientHeight: element.clientHeight,
            tabIndex: (element as HTMLElement).tabIndex,
          }));
        check(
          metrics.overflowY === "auto" &&
            metrics.scrollHeight > metrics.clientHeight &&
            metrics.tabIndex === 0,
          `Desktop component family list is bounded and keyboard-scrollable at ${width}px`,
        );
      }
      if (path === "/charts/") await ready("Charts");
      if (path === "/moods/") await ready("MoodBoards");
      await audit(page, `${path} @ ${width}`);
    }
    console.log(`Responsive/axe complete: ${width}px`);
  }
  // All moods at mobile and desktop: same geometry, real CSS, full-page captures.
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/`);
    await ready("MoodSwitcher");
    const geometry = await page.locator(".hero").boundingBox();
    for (const id of moodOrder) {
      await page
        .getByRole("radio", { name: moods[id].name, exact: true })
        .check();
      check(
        (await page.evaluate(() => document.documentElement.dataset.mood)) ===
          id,
        `${id} mood application`,
      );
      const current = await page.locator(".hero").boundingBox();
      check(
        current?.width === geometry?.width &&
          current?.height === geometry?.height,
        `${id} preserves layout`,
      );
      await waitForColorTransitions();
      await audit(page, `${id} @ ${width}`);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `.qa/screenshots/${id}-${width}.png`,
        fullPage: true,
      });
    }
  }
  // Chart views retain readable data and geometry across the same eight moods.
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/charts/`);
    await ready("Charts");
    for (const id of moodOrder) {
      await page
        .getByRole("radio", { name: moods[id].name, exact: true })
        .check();
      await waitForColorTransitions();
      await page.locator(".chart-study summary").first().click();
      check(
        await page
          .getByRole("table", { name: /Activity over time/ })
          .isVisible(),
        "Chart data alternative",
      );
      await page.locator(".chart-study summary").first().click();
      check(
        (await page.locator(".chart-plot .recharts-surface").count()) === 5,
        "All chart families render SVG",
      );
      await audit(page, `charts ${id} @ ${width}`);
      await page.screenshot({
        path: `.qa/screenshots/charts-${id}-${width}.png`,
        fullPage: true,
      });
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${origin}/motion/`);
  await ready("MotionDemo");
  await page.getByRole("button", { name: "Replay transition" }).click();
  check(
    (await page
      .locator(".motion-art span")
      .first()
      .evaluate((element) => getComputedStyle(element).animationName)) ===
      "none",
    "Reduced motion removes travel",
  );
  await audit(page, "Reduced motion");
  check(!errors.length, `Console/runtime errors: ${errors.join("; ")}`);
  await Bun.write(
    ".qa/browser-results.json",
    JSON.stringify(
      { state: "passed", results, errors, screenshots: 32 },
      null,
      2,
    ),
  );
  console.log(
    `Browser gate passed: ${results.length} axe/layout cases, 32 screenshots, no runtime errors.`,
  );
} catch (error) {
  await Bun.write(
    ".qa/browser-results.json",
    JSON.stringify(
      {
        state: "failed-or-blocked",
        error: String(error),
        completedCases: results.length,
        errors,
      },
      null,
      2,
    ),
  );
  throw error;
} finally {
  await browser?.close();
}
