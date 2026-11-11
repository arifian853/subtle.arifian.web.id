import "./dom";
import { expect, test } from "bun:test";
import { act, createElement, isValidElement, type ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { ChartSpecimen, chartKinds } from "../apps/web/src/components/Charts";

// Inspect the actual series props before Recharts renders them; no SVG timing or screenshots.
function seriesProps(node: ReactNode): Record<string, unknown>[] {
  if (Array.isArray(node)) return node.flatMap(seriesProps);
  if (!isValidElement(node)) return [];
  const props = node.props as Record<string, unknown>;
  return [
    ...(props.dataKey === "studies" || props.dataKey === "reviews" ? [props] : []),
    ...seriesProps(props.children as ReactNode),
  ];
}
function Probe() {
  const series = chartKinds.flatMap((kind) => seriesProps(ChartSpecimen({ kind })));
  return createElement("output", {}, JSON.stringify(series.map((props) => ({
    active: props.isAnimationActive,
    duration: props.animationDuration,
    easing: props.animationEasing,
    begin: props.animationBegin,
  }))));
}

test("chart series enable a short entrance only after hydration checks motion and follow preference changes", async () => {
  const original = window.matchMedia;
  const listeners = new Set<() => void>();
  let reduced = false;
  Object.defineProperty(window, "matchMedia", { configurable: true, value: () => ({
    get matches() { return reduced; },
    addEventListener: (_event: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_event: string, listener: () => void) => listeners.delete(listener),
  }) });
  const container = document.createElement("div");
  document.body.append(container);
  let root: ReturnType<typeof hydrateRoot> | undefined;
  const read = () => JSON.parse(container.textContent!) as { active: boolean; duration: number; easing: string; begin: number }[];
  try {
    for (const initiallyReduced of [false, true]) {
      reduced = initiallyReduced;
      container.innerHTML = renderToString(createElement(Probe));
      expect(read()).toHaveLength(0);
      await act(async () => { root = hydrateRoot(container, createElement(Probe)); });
      expect(read()).toHaveLength(8);
      expect(read().every((series) => series.active === !reduced && series.duration === 220 && series.easing === "ease-out" && series.begin === 0)).toBe(true);
      await act(async () => { reduced = !reduced; listeners.forEach((listener) => listener()); });
      expect(read().every((series) => series.active === !reduced)).toBe(true);
      await act(async () => { root!.unmount(); });
      root = undefined;
      expect(listeners.size).toBe(0);
    }
  } finally {
    if (root) await act(async () => { root!.unmount(); });
    container.remove();
    Object.defineProperty(window, "matchMedia", { configurable: true, value: original });
  }
});
