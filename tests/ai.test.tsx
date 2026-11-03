import "./dom";
import { afterEach, expect, spyOn, test } from "bun:test";
import { cleanup, fireEvent, render } from "@testing-library/react";
import { createElement } from "react";
afterEach(cleanup);
test("AI composer validates empty input then adds bounded local messages without network calls", async () => {
  const blockedFetch = Object.assign(
    () => {
      throw new Error("Unexpected demo network request");
    },
    { preconnect: globalThis.fetch.preconnect },
  );
  const network = spyOn(globalThis, "fetch").mockImplementation(blockedFetch);
  try {
    const { Conversation } =
      await import("../apps/web/src/components/Conversation");
    const ui = render(createElement(Conversation));
    fireEvent.click(ui.getByRole("button", { name: "Send message" }));
    expect(ui.getByRole("alert").textContent).toContain("Write a message");
    const input = ui.getByRole("textbox", {
      name: "Message",
    }) as HTMLTextAreaElement;
    expect(input.maxLength).toBe(500);
    fireEvent.change(input, { target: { value: "Help me choose a surface" } });
    fireEvent.click(ui.getByRole("button", { name: "Send message" }));
    expect(ui.getByRole("log").textContent).toContain(
      "Help me choose a surface",
    );
    expect(ui.getByRole("log").textContent).toContain(
      "Start with a tonal surface",
    );
    expect(input.value).toBe("");
    expect(network).not.toHaveBeenCalled();
  } finally {
    network.mockRestore();
  }
});
