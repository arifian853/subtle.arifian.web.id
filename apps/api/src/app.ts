import { Elysia } from "elysia";
import { z } from "zod";
import { getCatalogItem, listCatalog } from "@subtle/catalog";
import { handleMcp, listingSchema } from "./mcp";
const restSchema = listingSchema.extend({
  query: z.string().max(80).optional(),
});

export interface ApiOptions {
  allowedHosts?: readonly string[];
  allowedOrigins?: readonly string[];
  rateLimit?: number;
  maxTrackedIps?: number;
  getIp?: (request: Request) => string;
  now?: () => number;
}
export function createApi(options: ApiOptions = {}) {
  const hosts = new Set(
    options.allowedHosts ?? ["localhost:3001", "127.0.0.1:3001"],
  );
  const origins = new Set(
    options.allowedOrigins ?? [
      "http://localhost:4321",
      "http://127.0.0.1:4321",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
  );
  const buckets = new Map<string, { count: number; expires: number }>();
  const rateLimit = Math.min(120, Math.max(1, options.rateLimit ?? 60));
  const maxTrackedIps = Math.min(
    4096,
    Math.max(1, options.maxTrackedIps ?? 4096),
  );
  return new Elysia({ name: "subtle-public-catalog" })
    .onRequest(({ request, set, server }) => {
      set.headers["X-Content-Type-Options"] = "nosniff";
      set.headers["Cache-Control"] = "no-store";
      set.headers["Vary"] = "Origin";
      const url = new URL(request.url);
      const origin = request.headers.get("Origin");
      if (
        !hosts.has(url.host) ||
        !hosts.has(request.headers.get("Host") ?? url.host) ||
        (origin !== null && !origins.has(origin))
      )
        return new Response("Origin or Host is not allowed.", { status: 403 });
      if (origin) {
        set.headers["Access-Control-Allow-Origin"] = origin;
        set.headers["Access-Control-Expose-Headers"] = "MCP-Protocol-Version";
      }
      const time = options.now?.() ?? Date.now();
      // Bun socket IPs are default; deployments may inject a trusted proxy resolver.
      const ip = (
        options.getIp?.(request) ??
        server?.requestIP(request)?.address ??
        "unknown-peer"
      ).slice(0, 128);
      for (const [key, value] of buckets)
        if (value.expires <= time) buckets.delete(key);
      let bucket = buckets.get(ip);
      if (!bucket) {
        if (buckets.size >= maxTrackedIps)
          return new Response("Catalog capacity reached. Try again shortly.", {
            status: 503,
            headers: { "Retry-After": "60" },
          });
        bucket = { count: 0, expires: time + 60000 };
        buckets.set(ip, bucket);
      }
      if (++bucket.count > rateLimit)
        return new Response("Request limit reached. Try again shortly.", {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((bucket.expires - time) / 1000)),
          },
        });
      if (url.pathname === "/mcp") {
        if (request.method === "OPTIONS")
          return new Response(null, {
            status: 204,
            headers: {
              "Access-Control-Allow-Methods": "POST, OPTIONS",
              "Access-Control-Allow-Headers":
                "Content-Type, MCP-Protocol-Version, Accept",
              "Access-Control-Max-Age": "600",
            },
          });
        if (request.method !== "POST")
          return new Response("Stateless MCP accepts POST only.", {
            status: 405,
            headers: { Allow: "POST, OPTIONS" },
          });
        if (
          !/^application\/json(?:;|$)/i.test(
            request.headers.get("Content-Type") ?? "",
          )
        )
          return new Response("Use application/json.", { status: 415 });
      }
      if (url.pathname.startsWith("/api/") && request.method !== "GET")
        return new Response("Catalog reads use GET.", {
          status: 405,
          headers: { Allow: "GET" },
        });
    })
    .onError(
      ({ code }) =>
        new Response(
          code === "NOT_FOUND"
            ? "Catalog route not found."
            : "Catalog request could not be completed.",
          { status: code === "NOT_FOUND" ? 404 : 500 },
        ),
    )
    .all("/mcp", ({ request }) => handleMcp(request), { parse: "none" })
    .get("/api/catalog", ({ request }) => {
      const params = new URL(request.url).searchParams;
      const input: Record<string, unknown> = Object.fromEntries(params);
      for (const key of ["limit", "offset"])
        if (params.has(key)) input[key] = Number(params.get(key));
      if ([...params.keys()].some((key) => params.getAll(key).length > 1))
        return Response.json(
          { error: "Use one value per parameter." },
          { status: 400 },
        );
      const validated = restSchema.safeParse(input);
      return validated.success
        ? Response.json(listCatalog(validated.data))
        : Response.json(
            {
              error:
                "Invalid catalog query. Query: 80 characters; limit: 1–12; offset: 0–1000.",
            },
            { status: 400 },
          );
    })
    .get("/api/catalog/:id", ({ params }) => {
      const item = /^[a-z][a-z0-9-]{0,63}$/.test(params.id)
        ? getCatalogItem(params.id)
        : undefined;
      return item
        ? Response.json(item)
        : Response.json({ error: "Catalog item not found." }, { status: 404 });
    });
}
