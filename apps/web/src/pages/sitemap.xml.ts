import { pages, site } from "../lib/seo";
import { componentCategories } from "@subtle/catalog";
export function GET() {
  const paths = [
    ...Object.keys(pages),
    ...componentCategories.map(
      (category) => `/components/${category.toLowerCase()}/`,
    ),
  ];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>${site}${path}</loc></url>`).join("")}</urlset>`,
    { headers: { "Content-Type": "application/xml" } },
  );
}
