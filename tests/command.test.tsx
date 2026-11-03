import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("command keyboard navigation starts at the last result with ArrowUp and wraps in both directions", async () => {
  const { CommandDemo } =
    await import("../apps/web/src/components/CommandDemo");
  const ui = render(createElement(CommandDemo));
  fireEvent.click(ui.getByRole("button", { name: /Search the system/ }));
  const search = await ui.findByRole("searchbox", {
    name: "Search the system",
  });
  const results = ui.getAllByRole("link");
  fireEvent.keyDown(search, { key: "ArrowUp" });
  expect(document.activeElement).toBe(results.at(-1)!);
  fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
  expect(document.activeElement).toBe(results[0]!);
  fireEvent.keyDown(document.activeElement!, { key: "ArrowUp" });
  expect(document.activeElement).toBe(results.at(-1)!);
});
test("Soft Command Bar searches public catalog entries and moves keyboard focus to a result", async () => {
  const { CommandDemo } =
    await import("../apps/web/src/components/CommandDemo");
  const ui = render(createElement(CommandDemo));
  fireEvent.click(ui.getByRole("button", { name: /Search the system/ }));
  const search = await ui.findByRole("searchbox", {
    name: "Search the system",
  });
  fireEvent.change(search, { target: { value: "Layered Sheet" } });
  const result = ui.getByRole("link", { name: /Layered Sheet/ });
  expect(result.getAttribute("href")).toBe("/components/#sheet");
  fireEvent.keyDown(search, { key: "ArrowDown" });
  expect(document.activeElement).toBe(result);
  fireEvent.change(search, { target: { value: "no-such-component" } });
  expect(ui.getByRole("status").textContent).toContain("No matches");
});
