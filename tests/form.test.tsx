import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
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
  fireEvent.click(ui.getByRole("combobox", { name: "Workspace type" }));
  const personal = await ui.findByRole("option", {
    name: "Personal collection",
  });
  fireEvent.pointerDown(personal, { pointerType: "mouse" });
  fireEvent.click(personal);
  await waitFor(() =>
    expect(ui.getByRole("combobox").textContent).toContain(
      "Personal collection",
    ),
  );
  fireEvent.click(ui.getByLabelText("Weekly summary"));
  fireEvent.click(ui.getByRole("button", { name: "Save workspace" }));
  expect(ui.getByRole("status").textContent).toContain("Paper studio saved");
});
