import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("settings form validates inline, then saves synthetic values locally with visible feedback", async () => {
  const { SettingsForm } =
    await import("../apps/web/src/components/SettingsForm");
  const ui = render(createElement(SettingsForm));
  fireEvent.change(ui.getByLabelText("Workspace name"), {
    target: { value: " " },
  });
  fireEvent.submit(
    ui.getByRole("button", { name: "Save workspace" }).closest("form")!,
  );
  expect(ui.getByRole("alert").textContent).toContain("Enter a workspace name");
  fireEvent.change(ui.getByLabelText("Workspace name"), {
    target: { value: "Paper studio" },
  });
  fireEvent.change(ui.getByLabelText("Workspace type"), {
    target: { value: "personal" },
  });
  fireEvent.click(ui.getByLabelText("Weekly summary"));
  fireEvent.click(ui.getByRole("button", { name: "Save workspace" }));
  expect(ui.getByRole("status").textContent).toContain("Paper studio saved");
});
