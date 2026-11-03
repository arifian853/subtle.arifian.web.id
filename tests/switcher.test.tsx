import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("accessible mood radios persist a selection and update the document without replacing its layout", async () => {
  const { MoodSwitcher } =
    await import("../apps/web/src/components/MoodSwitcher");
  const ui = render(createElement(MoodSwitcher));
  expect(ui.getAllByRole("radio")).toHaveLength(8);
  const sky = ui.getByRole("radio", { name: "Sky Night" });
  fireEvent.click(sky);
  expect(document.documentElement.dataset.mood).toBe("sky-night");
  expect(localStorage.getItem("subtle:mood:v1")).toBe("sky-night");
  expect(
    document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
  ).toBe("#0B1220");
  expect((sky as HTMLInputElement).checked).toBe(true);
  expect(ui.getAllByRole("radio")).toHaveLength(8);
});
