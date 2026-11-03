export const site = "https://subtle.arifian.web.id";
export const pages = {
  "/": [
    "Soft Editorial Materialism",
    "Explore Subtle, a design system by Arifian. Eight moods share expressive typography, tonal surfaces, and considered interactions for stories and software.",
  ],
  "/foundations/": [
    "Foundations",
    "Work with the Subtle foundations: canonical mood colors, semantic surfaces, typography, shape, spacing, elevation, and accessible contrast.",
  ],
  "/components/": [
    "Components",
    "Explore the canonical Subtle components. Try accessible controls, layered overlays, data, media, and AI conversation specimens in all eight moods.",
  ],
  "/patterns/": [
    "Patterns",
    "Compose Subtle components into editorial heroes, focused workspaces, settings, search, file management, media galleries, and AI conversations.",
  ],
  "/motion/": [
    "Motion",
    "Try the Subtle motion vocabulary: responsive controls, quiet overlays, tonal transitions, and a reduced-motion treatment that keeps every state clear.",
  ],
  "/moods/": [
    "Eight moods",
    "Find your Subtle mood: Beige, Forest, Teal, Slate, Lavender, Rosewood, Graphite, and Sky Night. Change atmosphere while preserving one visual grammar.",
  ],
  "/about/": [
    "About Subtle",
    "Subtle is Soft Editorial Materialism by Arifian. Learn about its design principles, original compositions, accessible primitives, and source provenance.",
  ],
} as const;
export function seo(path: keyof typeof pages) {
  const [title, description] = pages[path];
  return {
    title: `${title} | Subtle`,
    description,
    canonical: `${site}${path}`,
    image: undefined,
  };
}
export function categorySeo(category: string) {
  return {
    title: `${category} components | Subtle`,
    description: `Try the Subtle ${category.toLowerCase()} components with accessible interactions, synthetic examples, and all eight moods. Each family shares one visual grammar.`,
    canonical: `${site}/components/${category.toLowerCase()}/`,
    image: undefined,
  };
}
