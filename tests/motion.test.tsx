import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("purposeful motion replay changes visible state with an explicit reduced-motion stylesheet", async () => {
  const { MotionDemo } = await import("../apps/web/src/components/MotionDemo");
  const ui = render(createElement(MotionDemo));
  fireEvent.click(ui.getByRole("button", { name: "Replay transition" }));
  expect(ui.getByRole("status").textContent).toContain("Transition replayed");
  expect(ui.container.querySelector('[data-replay="1"]')).toBeTruthy();
  const css = await Bun.file("apps/web/src/styles/global.css").text();
  expect(css).toContain("prefers-reduced-motion: reduce");
  expect(/animation-duration:\s*0?\.01ms\s*!important/.test(css)).toBe(true);
});
