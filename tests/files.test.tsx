import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("file pattern filters synthetic document metadata and offers a useful empty state", async () => {
  const { FileCollection } =
    await import("../apps/web/src/components/FileCollection");
  const ui = render(createElement(FileCollection));
  fireEvent.change(ui.getByRole("searchbox", { name: "Find a studio file" }), {
    target: { value: "notes" },
  });
  expect(ui.getByRole("button", { name: /Studio notes/ })).toBeTruthy();
  fireEvent.click(ui.getByRole("button", { name: /Studio notes/ }));
  expect(ui.getByRole("status").textContent).toContain(
    "A synthetic note about everyday objects.",
  );
  fireEvent.change(ui.getByRole("searchbox"), {
    target: { value: "unknown-file" },
  });
  expect(ui.getByRole("heading", { name: "No files match" })).toBeTruthy();
});
