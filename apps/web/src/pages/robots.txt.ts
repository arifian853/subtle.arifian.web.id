import { site } from "../lib/seo";
export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`,
    { headers: { "Content-Type": "text/plain" } },
  );
}
