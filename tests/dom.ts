import { JSDOM } from "jsdom";
const dom = new JSDOM(
  '<!doctype html><html data-mood="beige"><head><meta name="theme-color" content="#FAF8F5"></head><body></body></html>',
  { url: "http://localhost:4321", pretendToBeVisual: true },
);
Object.assign(globalThis, {
  FormData: dom.window.FormData,
  Event: dom.window.Event,
  CustomEvent: dom.window.CustomEvent,
  window: dom.window,
  document: dom.window.document,
  navigator: dom.window.navigator,
  HTMLElement: dom.window.HTMLElement,
  Element: dom.window.Element,
  Node: dom.window.Node,
  MutationObserver: dom.window.MutationObserver,
  localStorage: dom.window.localStorage,
  getComputedStyle: dom.window.getComputedStyle,
  requestAnimationFrame: (fn: FrameRequestCallback) => setTimeout(fn, 0),
  cancelAnimationFrame: clearTimeout,
  IS_REACT_ACT_ENVIRONMENT: true,
});
Object.defineProperty(window, "matchMedia", {
  value: () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  }),
});
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
HTMLElement.prototype.scrollIntoView = () => {};
