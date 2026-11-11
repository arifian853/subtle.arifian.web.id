import "./dom";
import { afterEach, expect, test, mock } from "bun:test";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);

test("custom Select labels its popup, selects a value, submits it, and dismisses with Escape", async () => {
  const { Select } = await import("../apps/web/src/components/ui/select");
  const change = mock(() => {});
  const ui = render(
    createElement(
      "form",
      {},
      createElement(Select, {
        label: "Collection",
        name: "collection",
        defaultValue: "team",
        onValueChange: change,
        options: [
          { value: "team", label: "Team studio" },
          { value: "personal", label: "Personal collection" },
        ],
      }),
    ),
  );
  const trigger = ui.getByRole("combobox", { name: "Collection" });
  expect(trigger.tagName).toBe("BUTTON");
  fireEvent.click(trigger);
  const option = await ui.findByRole("option", { name: "Personal collection" });
  fireEvent.pointerDown(option, { pointerType: "mouse" });
  fireEvent.click(option);
  await waitFor(() =>
    expect(trigger.textContent).toContain("Personal collection"),
  );
  expect(change).toHaveBeenCalledWith("personal");
  expect(new FormData(trigger.closest("form")!).get("collection")).toBe(
    "personal",
  );
  fireEvent.click(trigger);
  await ui.findByRole("listbox");
  fireEvent.keyDown(document.activeElement!, { key: "Escape" });
  await waitFor(() => expect(ui.queryByRole("listbox")).toBeNull());
});

test("MoodPicker can be controlled independently and keeps exactly eight choices", async () => {
  const { MoodPicker } = await import("../apps/web/src/components/MoodPicker");
  const onValueChange = mock(() => {});
  const ui = render(
    createElement(MoodPicker, {
      value: "beige",
      onValueChange,
      label: "Preview mood",
    }),
  );
  expect(ui.getByRole("group", { name: "Preview mood" })).toBeTruthy();
  expect(ui.getAllByRole("radio")).toHaveLength(8);
  fireEvent.click(ui.getByRole("radio", { name: "Forest" }));
  expect(onValueChange).toHaveBeenCalledWith("forest");
});

test("Scrollbar exposes a named keyboard focusable native scroll region", async () => {
  const { Scrollbar } = await import("../apps/web/src/components/ui/scrollbar");
  const ui = render(
    createElement(Scrollbar, { label: "Token board" }, "Scrollable values"),
  );
  expect(ui.getByRole("region", { name: "Token board" }).tabIndex).toBe(0);
});

test("mood boards copy semantic declarations and announce clipboard failures", async () => {
  const { MoodBoards } = await import("../apps/web/src/components/MoodBoards");
  const writeText = mock(async (_text: string) => {});
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  const ui = render(createElement(MoodBoards));
  expect(ui.getAllByRole("region")).toHaveLength(8);
  fireEvent.click(ui.getByRole("button", { name: "Copy Beige --primary" }));
  await waitFor(() =>
    expect(writeText).toHaveBeenCalledWith("--primary: #6B5040;"),
  );
  expect(ui.getByRole("status").textContent).toContain(
    "Copied Beige --primary",
  );
  writeText.mockImplementation(async () => {
    throw new Error("denied");
  });
  fireEvent.click(ui.getByRole("button", { name: "Copy Forest --primary" }));
  await waitFor(() =>
    expect(ui.getByRole("status").textContent).toContain("Copy failed"),
  );
  expect(ui.getByText("Coming soon")).toBeTruthy();
});

test("nested radius helper uses the inset and clamps square inner corners", async () => {
  const { nestedRadius } = await import("../apps/web/src/lib/shape");
  expect(nestedRadius(24, 8)).toBe(16);
  expect(nestedRadius(10, 16)).toBe(0);
  expect(() => nestedRadius(24, -1)).toThrow();
});

test("radius preview updates its inset and supports close and restore", async () => {
  const { RadiusDemo } = await import("../apps/web/src/components/RadiusDemo");
  const ui = render(createElement(RadiusDemo));
  fireEvent.change(ui.getByRole("slider"), { target: { value: "24" } });
  expect(ui.getByText(/Outer 24 px/).textContent).toContain("inner 0 px");
  fireEvent.click(ui.getByRole("button", { name: "Close corner preview" }));
  expect(ui.queryByRole("heading")).toBeNull();
  fireEvent.click(ui.getByRole("button", { name: "Restore preview" }));
  expect(
    ui.getByRole("heading", { name: "Space follows the corner." }),
  ).toBeTruthy();
});
