import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("component explorer searches canonical families, filters category, and opens an interactive specimen", async () => {
  const { Explorer } = await import("../apps/web/src/components/Explorer");
  const ui = render(createElement(Explorer));
  fireEvent.change(ui.getByRole("searchbox", { name: "Find a component" }), {
    target: { value: "sheet" },
  });
  expect(ui.getByRole("link", { name: "Layered Sheet" })).toBeTruthy();
  fireEvent.click(ui.getByRole("link", { name: "Layered Sheet" }));
  await waitFor(() => expect(window.location.hash).toBe("#sheet"));
  expect(
    ui.getByRole("heading", { name: "Layered Sheet", level: 2 }),
  ).toBeTruthy();
  expect(ui.getByRole("button", { name: "Open inspector" })).toBeTruthy();
  fireEvent.change(ui.getByRole("searchbox"), { target: { value: "" } });
  fireEvent.click(ui.getByRole("combobox", { name: "Component category" }));
  const option = await ui.findByRole("option", { name: /^Data$/ });
  fireEvent.pointerDown(option, { pointerType: "mouse" });
  fireEvent.click(option);
  await waitFor(() =>
    expect(ui.getByRole("combobox").textContent).toContain("Data"),
  );
  expect(ui.getByRole("link", { name: "Data Table" })).toBeTruthy();
  expect(ui.queryByRole("link", { name: "Layered Sheet" })).toBeNull();
});

test("component family navigation is independently keyboard-focusable", async () => {
  const { Explorer } = await import("../apps/web/src/components/Explorer");
  const ui = render(createElement(Explorer));
  const navigation = ui.getByRole("navigation", { name: "Component families" });
  expect(navigation.getAttribute("tabindex")).toBe("0");
});
