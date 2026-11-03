import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("hero live task can complete and reopen with progress and status feedback", async () => {
  const { HeroLive } = await import("../apps/web/src/components/HeroLive");
  const ui = render(createElement(HeroLive));
  fireEvent.click(ui.getByRole("button", { name: "Mark complete" }));
  expect(ui.getByRole("progressbar").getAttribute("value")).toBe("100");
  expect(ui.getByRole("status").textContent).toContain("Complete");
  fireEvent.click(ui.getByRole("button", { name: "Reopen task" }));
  expect(ui.getByRole("progressbar").getAttribute("value")).toBe("84");
});
