import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("Editorial/Product tabs switch the density specimen with shared anatomy and accessible panels", async () => {
  const { ModeComparison } =
    await import("../apps/web/src/components/ModeComparison");
  const ui = render(createElement(ModeComparison));
  expect(ui.getByRole("tabpanel").textContent).toContain(
    "Make room for what matters.",
  );
  fireEvent.click(ui.getByRole("tab", { name: "Product" }));
  expect(ui.getByRole("tabpanel").textContent).toContain("Studio overview");
  expect(
    ui.getByRole("table", { name: "Synthetic studio projects" }),
  ).toBeTruthy();
  fireEvent.click(ui.getByRole("tab", { name: "Editorial" }));
  expect(ui.getByRole("tabpanel").textContent).toContain(
    "Make room for what matters.",
  );
});

test("product comparison table has a named keyboard-focusable scroll region", async () => {
  const { ModeComparison } =
    await import("../apps/web/src/components/ModeComparison");
  const ui = render(createElement(ModeComparison));
  fireEvent.click(ui.getByRole("tab", { name: "Product" }));
  const region = ui.getByRole("region", {
    name: "Synthetic studio projects table, scroll horizontally",
  });
  expect(region.getAttribute("tabindex")).toBe("0");
  expect(region.classList.contains("table-scroll")).toBe(true);
});
