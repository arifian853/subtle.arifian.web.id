import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("data specimen filters and sorts synthetic records, preserving a semantic table and empty state", async () => {
  const { DataDemo } = await import("../apps/web/src/components/DataDemo");
  const ui = render(createElement(DataDemo));
  fireEvent.click(ui.getByRole("button", { name: "Sort by progress" }));
  expect(ui.getAllByRole("row")[1]?.textContent).toContain("A slower morning");
  expect(
    ui
      .getByRole("columnheader", { name: /progress/i })
      .getAttribute("aria-sort"),
  ).toBe("ascending");
  fireEvent.change(
    ui.getByRole("searchbox", { name: "Filter studio projects" }),
    { target: { value: "objects" } },
  );
  expect(ui.getAllByRole("row")).toHaveLength(2);
  fireEvent.change(ui.getByRole("searchbox"), { target: { value: "unknown" } });
  expect(ui.getByRole("status").textContent).toContain("No projects");
});

test("synthetic project table scroll region has a name and keyboard focus", async () => {
  const { DataDemo } = await import("../apps/web/src/components/DataDemo");
  const ui = render(createElement(DataDemo));
  const region = ui.getByRole("region", {
    name: "Synthetic studio projects table, scroll horizontally",
  });
  expect(region.getAttribute("tabindex")).toBe("0");
  expect(region.classList.contains("table-scroll")).toBe(true);
});
