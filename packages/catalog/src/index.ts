export { moods, moodOrder, defaultMood, isMood, type MoodId } from "./tokens";
import { moods, moodOrder } from "./tokens";

export type CatalogKind = "component" | "pattern" | "foundation" | "mood";
export interface CatalogItem {
  id: string;
  title: string;
  kind: CatalogKind;
  category: string;
  description: string;
  usage: string;
  accessibility: string;
  states: readonly string[];
  href: string;
  provenance: string;
  tokens?: Record<string, string>;
}
type Entry = readonly [
  id: string,
  title: string,
  category: string,
  description: string,
  usage: string,
  accessibility: string,
  states?: readonly string[],
];
const components: Entry[] = [
  [
    "button",
    "Button",
    "Actions",
    "A clear action with a 10 px radius and a practical touch target.",
    "Choose primary for the next action, secondary for a supporting action, and ghost for a quiet action.",
    "Use a specific action label. Expose disabled and loading states with native semantics.",
    ["default", "hover", "focus", "disabled", "loading", "destructive"],
  ],
  [
    "icon-button",
    "Icon Button",
    "Actions",
    "A compact action with a 44 px target.",
    "Use for familiar supporting actions beside a labeled control.",
    "Always provide an accessible name. Decorative icons stay hidden from assistive technology.",
  ],
  [
    "input",
    "Text Field",
    "Forms",
    "A labeled single-line input with inline validation.",
    "Use for short values. Keep error messages beside the field.",
    "Associate the label and error. Focus the first invalid field after submission.",
  ],
  [
    "textarea",
    "Textarea",
    "Forms",
    "A multiline field for messages and notes.",
    "Set a useful initial height and bound example content.",
    "Keep the label visible and preserve native text editing and paste.",
  ],
  [
    "select",
    "Select",
    "Forms",
    "A labeled selection from a finite set of options.",
    "Use the owned Base UI Select for finite app choices; reserve a combobox for searchable sets.",
    "Base UI supplies arrow navigation, typeahead, selection, Escape dismissal, and trigger focus restoration.",
  ],
  [
    "checkbox",
    "Checkbox",
    "Forms",
    "An independent choice with a shared label and hit target.",
    "Use for optional preferences and independent selections.",
    "Use a native checkbox with a clickable label and a visible checked state.",
  ],
  [
    "adaptive-header",
    "Adaptive Header",
    "Navigation",
    "A spacious wordmark and compact navigation that reflows on mobile.",
    "Keep the primary destinations visible on desktop and group them in a mobile menu.",
    "Name each navigation landmark. Use aria-current for the current destination.",
  ],
  [
    "mood-switcher",
    "Mood Switcher",
    "Navigation",
    "Eight atmospheres applied to one component grammar.",
    "Choose a mood to update semantic tokens. Beige is the default.",
    "Native radios support Tab, arrow keys, and Space. Announce the selected mood.",
  ],
  [
    "tabs",
    "Tabs",
    "Navigation",
    "Related content in named, keyboard-operable panels.",
    "Use to compare Editorial and Product density without changing the underlying system.",
    "Base UI manages roving focus, arrow keys, tab selection, and panel association.",
  ],
  [
    "command",
    "Soft Command Bar",
    "Navigation",
    "A quiet entry point to search the public catalog.",
    "Type a component or pattern name and choose a result.",
    "The dialog has a title, labeled search, arrow navigation, Escape, and focus restoration.",
  ],
  [
    "tonal-card",
    "Tonal Card",
    "Surfaces",
    "A contained group separated through tone.",
    "Add a surface only when grouping or interaction requires it.",
    "Keep readable text contrast; preserve a meaningful heading and reading order.",
  ],
  [
    "mosaic-tile",
    "Soft Mosaic Tile",
    "Surfaces",
    "An unequal tile within a disciplined shared grid.",
    "Combine one dominant story with supporting controls, context, and data.",
    "Preserve DOM reading order when the grid becomes a single mobile flow.",
  ],
  [
    "inspector",
    "Floating Inspector",
    "Surfaces",
    "Contextual detail at a restrained floating elevation.",
    "Use for local properties and focused settings. Adapt to a bottom sheet on narrow screens.",
    "Keep the inspector titled. Modal presentations trap focus and restore the trigger.",
  ],
  [
    "context-capsule",
    "Context Capsule",
    "Surfaces",
    "A small rounded context label.",
    "Use for a meaningful context or category, with a concise label.",
    "Never communicate essential state through color alone.",
  ],
  [
    "status",
    "Status Badge",
    "Feedback",
    "A compact semantic status with a written label.",
    "Pair the semantic background and text tokens. Use Rosewood available-text-aa for availability.",
    "Status always includes words. Use corrected semantic foregrounds where contrast requires them.",
  ],
  [
    "progress",
    "Progress",
    "Feedback",
    "A determinate task state with a visible value.",
    "Pair progress with a label and percentage.",
    "Expose the value, minimum, maximum, and accessible name.",
  ],
  [
    "toast",
    "Toast",
    "Feedback",
    "A non-blocking confirmation of a local action.",
    "Use for a completed action; keep validation beside the relevant control.",
    "Announce confirmations politely. Do not move focus into the notification.",
  ],
  [
    "skeleton",
    "Skeleton",
    "Feedback",
    "A static placeholder while content is unavailable.",
    "Show the expected content shape without implying real data.",
    "Keep decorative skeletons hidden and announce loading once. Reduced motion removes shimmer.",
  ],
  [
    "empty",
    "Empty State",
    "Feedback",
    "A clear explanation and next step when a collection is empty.",
    "Name what is missing and offer the action that creates it.",
    "Use a heading and labeled action. Avoid color-only feedback.",
  ],
  [
    "dialog",
    "Dialog",
    "Overlays",
    "A focused decision on a foreground surface.",
    "Keep the task narrow and provide an explicit close action.",
    "Base UI provides modal focus management, Escape handling, and trigger restoration.",
  ],
  [
    "sheet",
    "Layered Sheet",
    "Overlays",
    "A contextual panel for a longer task.",
    "Use a side sheet on desktop and a bottom sheet on mobile.",
    "Use the same dialog semantics, visible title, and keyboard close behavior.",
  ],
  [
    "metric",
    "Metric",
    "Data",
    "A prominent value with explicit context.",
    "Pair the value with a label and a meaningful comparison.",
    "Include the unit and written context. Do not rely on color for trend direction.",
  ],
  [
    "chart",
    "Chart",
    "Data",
    "Responsive Recharts area, bar, line, pie, and composed views of synthetic studio activity.",
    "Keep plot colors within the mood and provide the underlying values.",
    "Name the chart and include its data in the accessible description.",
  ],
  [
    "data-table",
    "Data Table",
    "Data",
    "A semantic table with local sorting and filtering.",
    "Use for comparable records. Allow horizontal scrolling within the specimen.",
    "Use header cells, aria-sort, named sort actions, and an accessible table label.",
  ],
  [
    "media",
    "Media Surface",
    "Media",
    "An original botanical vector within a large tonal surface.",
    "Use a 32 px anchor shape and an explicit caption.",
    "Provide descriptive alternative text. Keep decorative marks hidden.",
  ],
  [
    "ai-message",
    "AI Message",
    "AI",
    "A synthetic conversation with explicit speaker labels.",
    "Keep assistant and human messages readable at product density.",
    "Name speakers and announce new replies politely. This specimen never contacts a model.",
  ],
  [
    "ai-composer",
    "AI Composer",
    "AI",
    "A local message field with a send action.",
    "Submit a bounded message to add it to the synthetic conversation.",
    "Label the text field, preserve multiline editing, and explain empty input.",
  ],
];
// Existing stable IDs remain retrievable even when a family contains variants.
components.push(
  [
    "mood-picker",
    "Mood Picker",
    "Forms",
    "A reusable eight-choice atmosphere control in compact Appearance-menu and full inline-radio variants.",
    "Use the compact dropdown in a header or the full inline picker when all mood choices should remain visible. The inline picker also supports controlled previews.",
    "Native radios provide grouped naming, arrow navigation, and an announced selection.",
  ],
  [
    "scrollbar",
    "Scrollbar",
    "Navigation",
    "A named scroll region with a mood-aware native scrollbar.",
    "Bound a long list, token board, or table while keeping page composition open.",
    "Keep Tab focus and browser arrow, Page Up/Down, touch, and wheel scrolling. Never capture scroll events.",
  ],
);
/** IA reference: https://ui.shadcn.com/docs/components (official alphabetical family order).
 * Categories organize tasks; Subtle extensions sit beside the nearest documented anatomy.
 * These references govern navigation only, never appearance.
 */
export const componentHierarchy = [
  {
    title: "Actions",
    families: [{ title: "Button", ids: ["button", "icon-button"] }],
  },
  {
    title: "Forms",
    families: [
      { title: "Checkbox", ids: ["checkbox"] },
      { title: "Input", ids: ["input"] },
      { title: "Mood Picker", ids: ["mood-picker"] },
      { title: "Select", ids: ["select"] },
      { title: "Textarea", ids: ["textarea"] },
    ],
  },
  {
    title: "Navigation",
    families: [
      { title: "Command", ids: ["command"] },
      { title: "Navigation Menu / Adaptive Header", ids: ["adaptive-header"] },
      { title: "Scroll Area / Scrollbar", ids: ["scrollbar"] },
      { title: "Tabs", ids: ["tabs"] },
    ],
  },
  {
    title: "Feedback",
    families: [
      { title: "Badge / Status", ids: ["status"] },
      { title: "Empty", ids: ["empty"] },
      { title: "Progress", ids: ["progress"] },
      { title: "Skeleton", ids: ["skeleton"] },
      { title: "Toast", ids: ["toast"] },
    ],
  },
  {
    title: "Overlays",
    families: [
      { title: "Dialog", ids: ["dialog"] },
      { title: "Popover / Floating Inspector", ids: ["inspector"] },
      { title: "Sheet", ids: ["sheet"] },
    ],
  },
  {
    title: "Data",
    families: [
      { title: "Chart", ids: ["chart"] },
      { title: "Data Table", ids: ["data-table"] },
      { title: "Metric", ids: ["metric"] },
    ],
  },
  {
    title: "Surfaces",
    families: [
      { title: "Card / Tonal Card", ids: ["tonal-card"] },
      { title: "Context Capsule", ids: ["context-capsule"] },
      { title: "Soft Mosaic Tile", ids: ["mosaic-tile"] },
    ],
  },
  { title: "Media", families: [{ title: "Media Surface", ids: ["media"] }] },
  {
    title: "AI",
    families: [
      { title: "Message", ids: ["ai-message"] },
      { title: "Prompt Input / AI Composer", ids: ["ai-composer"] },
    ],
  },
  {
    title: "Atmosphere",
    families: [{ title: "Mood Switcher", ids: ["mood-switcher"] }],
  },
];
const familyCategory = new Map(
  componentHierarchy.flatMap((group) =>
    group.families.flatMap((family) =>
      family.ids.map((id) => [id, group.title] as const),
    ),
  ),
);
const patterns: Entry[] = [
  [
    "editorial-hero",
    "Editorial hero",
    "Editorial",
    "A dominant story paired with an offset live specimen.",
    "Start with a clear headline, then place one supporting surface beside it.",
    "Preserve one h1 and a clear mobile reading order.",
  ],
  [
    "settings",
    "Workspace settings",
    "Product",
    "A compact form within a contextual inspector.",
    "Group related choices and confirm a local save.",
    "Associate errors and labels. Keep focus on the task.",
  ],
  [
    "dashboard",
    "Studio overview",
    "Product",
    "Metrics, a trend, and a compact table.",
    "Use one dominant value and a small set of comparable records.",
    "Provide chart data and semantic table headers.",
  ],
  [
    "ai-conversation",
    "AI conversation",
    "AI",
    "An assistant response and a bounded local composer.",
    "Keep context, speaker identity, and the next action visible.",
    "Announce new messages and preserve input focus.",
  ],
  [
    "file-manager",
    "File collection",
    "Product",
    "A searchable synthetic collection of studio documents.",
    "Combine a labeled filter, clear file names, and an empty state.",
    "Use named controls and a semantic list; never expose real filesystem data.",
  ],
  [
    "search-results",
    "Search and results",
    "Navigation",
    "A bounded catalog query with categories and clear empty feedback.",
    "Keep the query visible and let people reset filters.",
    "Announce result counts and label search fields.",
  ],
  [
    "command-workflow",
    "Command workflow",
    "Navigation",
    "A modal search that takes you to a published catalog entry.",
    "Open the command bar, type, then choose a destination.",
    "Support arrow navigation, Escape, focus trapping, and trigger restoration.",
  ],
  [
    "media-gallery",
    "Media gallery",
    "Editorial",
    "A dominant original botanical study beside smaller context.",
    "Let one media surface anchor the composition.",
    "Keep captions readable and provide useful descriptions.",
  ],
];
const foundations: Entry[] = [
  [
    "color",
    "Color and contrast",
    "Foundations",
    "Eight exact palettes with one semantic contract.",
    "Use semantic roles and the documented contrast corrections.",
    "Use main text on tonal surfaces; text-light is decorative only.",
  ],
  [
    "typography",
    "Typography",
    "Foundations",
    "Lexend Deca, Inclusive Sans, and JetBrains Mono.",
    "Use Lexend Deca for headings, Inclusive Sans for reading, and mono for technical values.",
    "Use responsive scales with readable line lengths.",
  ],
  [
    "shape",
    "Shape",
    "Foundations",
    "Six radii from 6 px details to intentional capsules.",
    "Step down radii inside larger surfaces. Controls use 10 px.",
    "Maintain practical touch targets around 44 px.",
  ],
  [
    "spacing",
    "Spacing",
    "Foundations",
    "A shared scale from 4 px to 128 px.",
    "Use 8–12 px within controls and 64–128 px between editorial sections.",
    "Reflow composition at mobile widths rather than shrinking every element.",
  ],
  [
    "surfaces",
    "Surfaces and elevation",
    "Foundations",
    "Canvas, Low, Surface, High, and Floating tonal roles.",
    "Derive roles from canonical background and container colors. Reserve shadows for floating layers.",
    "Keep readable foreground/background pairs in every mood.",
  ],
  [
    "density",
    "Editorial and Product",
    "Foundations",
    "Two type and spacing contexts with shared anatomy.",
    "Editorial opens the composition; Product contains a focused task.",
    "Keep control behavior and focus treatment consistent.",
  ],
  [
    "motion",
    "Motion",
    "Foundations",
    "A restrained 160–520 ms motion vocabulary.",
    "Use 160 ms for small feedback, 240 ms for overlays, and 520 ms for editorial motion.",
    "Reduced motion removes spatial travel while preserving every state.",
  ],
];
function fromEntries(
  entries: Entry[],
  kind: CatalogKind,
  route: string,
): CatalogItem[] {
  return entries.map(
    ([id, title, category, description, usage, accessibility, states]) => ({
      id,
      title,
      category:
        kind === "component" ? (familyCategory.get(id) ?? category) : category,
      kind,
      description,
      usage,
      accessibility,
      states: states ?? ["default", "focus"],
      href: `${route}#${id}`,
      provenance:
        kind === "component"
          ? "Subtle authored presentation; Base UI and native HTML behavior."
          : "Subtle design contract authored and curated by Arifian, informed by credited references.",
    }),
  );
}
export const catalog: readonly CatalogItem[] = [
  ...fromEntries(components, "component", "/components/"),
  ...fromEntries(patterns, "pattern", "/patterns/"),
  ...fromEntries(foundations, "foundation", "/foundations/"),
  ...moodOrder.map((id) => ({
    id: `mood-${id}`,
    title: moods[id].name,
    kind: "mood" as const,
    category: "Moods",
    description: moods[id].description,
    usage: "Apply semantic tokens to the same component grammar.",
    accessibility:
      id === "rosewood"
        ? "Use text-subtle-readable and status-available-text-aa for corrected readability."
        : "Check text and interactive states against their paired surfaces.",
    states: [moods[id].dark ? "native dark" : "native light"],
    href: `/moods/#${id}`,
    provenance: "Canonical Subtle palette by Arifian.",
    tokens: { ...moods[id].tokens },
  })),
];
export const componentCategories = componentHierarchy.map(
  (group) => group.title,
);
export function getCatalogItem(id: string) {
  return catalog.find((item) => item.id === id);
}
export interface CatalogQuery {
  query?: string;
  kind?: CatalogKind;
  category?: string;
  limit?: number;
  offset?: number;
}
export function listCatalog({
  query = "",
  kind,
  category,
  limit = 12,
  offset = 0,
}: CatalogQuery = {}) {
  const q = query.slice(0, 80).toLocaleLowerCase().trim();
  const matching = catalog.filter(
    (item) =>
      (!kind || item.kind === kind) &&
      (!category || item.category === category) &&
      `${item.title} ${item.description} ${item.category}`
        .toLocaleLowerCase()
        .includes(q),
  );
  const safeLimit = Number.isFinite(limit)
    ? Math.min(12, Math.max(1, Math.floor(limit)))
    : 12;
  const safeOffset = Number.isFinite(offset)
    ? Math.min(1000, Math.max(0, Math.floor(offset)))
    : 0;
  return {
    total: matching.length,
    items: matching.slice(safeOffset, safeOffset + safeLimit),
  };
}
