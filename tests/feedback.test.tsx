import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("feedback specimen shows an explicit loading state, then local content and a dismissible toast", async () => {
  const { FeedbackDemo } =
    await import("../apps/web/src/components/FeedbackDemo");
  const ui = render(createElement(FeedbackDemo));
  fireEvent.click(ui.getByRole("button", { name: "Preview loading" }));
  expect(
    ui.getByRole("status", { name: "Content state" }).textContent,
  ).toContain("Loading");
  fireEvent.click(ui.getByRole("button", { name: "Show content" }));
  expect(
    ui.getByRole("status", { name: "Content state" }).textContent,
  ).toContain("Ready");
  fireEvent.click(ui.getByRole("button", { name: "Show toast" }));
  expect(
    ui.getByText("A little feedback. Your local action is complete."),
  ).toBeTruthy();
  fireEvent.keyDown(document, { key: "F6" });
  fireEvent.click(
    await ui.findByRole("button", { name: "Dismiss notification" }),
  );
  expect(
    ui.queryByText("A little feedback. Your local action is complete."),
  ).toBeNull();
});
