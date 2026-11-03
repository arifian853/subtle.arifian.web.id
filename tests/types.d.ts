// Narrow local declarations for the jsdom APIs used by this test suite.
declare module "jsdom" {
  export class JSDOM {
    constructor(
      html?: string,
      options?: {
        url?: string;
        pretendToBeVisual?: boolean;
        runScripts?: "dangerously" | "outside-only";
      },
    );
    window: Window & typeof globalThis;
  }
}
