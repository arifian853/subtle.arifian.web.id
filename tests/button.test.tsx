import "./dom";
import { afterEach, expect, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("owned Button supports actions, disabled behavior and explicit variants", async () => {
  const { Button } = await import("../apps/web/src/components/ui/button");
  let clicks = 0;
  const ui = render(
    createElement(Button, {
      variant: "secondary",
      onClick: () => clicks++,
      children: "Save locally",
    }),
  );
  fireEvent.click(ui.getByRole("button", { name: "Save locally" }));
  expect(clicks).toBe(1);
  ui.rerender(
    createElement(Button, {
      disabled: true,
      onClick: () => clicks++,
      children: "Saving…",
    }),
  );
  fireEvent.click(ui.getByRole("button"));
  expect(clicks).toBe(1);
  expect((ui.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
});
