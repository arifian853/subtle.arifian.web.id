import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("dialog and responsive inspector sheet expose names, trap focus and restore their triggers on close", async () => {
  const { OverlayDemo } =
    await import("../apps/web/src/components/OverlayDemo");
  const ui = render(createElement(OverlayDemo));
  for (const [trigger, title] of [
    ["Open dialog", "A moment to consider"],
    ["Open inspector", "Surface inspector"],
  ]) {
    const button = ui.getByRole("button", { name: trigger });
    button.focus();
    fireEvent.click(button);
    const dialog = await ui.findByRole("dialog", { name: title });
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.click(ui.getByRole("button", { name: "Close panel" }));
    await waitFor(() => expect(ui.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(button));
  }
});
