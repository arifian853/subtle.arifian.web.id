import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { catalog, getCatalogItem, listCatalog } from "@subtle/catalog";

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
const kind = z.enum(["component", "pattern", "foundation", "mood"]).optional();
export const listingSchema = z
  .object({
    kind,
    category: z.string().max(40).optional(),
    limit: z.number().int().min(1).max(12).optional(),
    offset: z.number().int().min(0).max(1000).optional(),
  })
  .strict();
function result(data: Record<string, unknown>) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data) }],
    structuredContent: data,
  };
}

function registerCatalogTools(server: McpServer) {
  server.registerTool(
    "list_catalog",
    {
      title: "List public catalog",
      description: "List published Subtle catalog metadata.",
      inputSchema: listingSchema,
      annotations,
    },
    (input) => result(listCatalog(input)),
  );
  server.registerTool(
    "search_catalog",
    {
      title: "Search public catalog",
      description:
        "Search published Subtle components, patterns, foundations, and moods.",
      inputSchema: listingSchema.extend({
        query: z.string().max(80).trim().min(1),
      }),
      annotations,
    },
    (input) => result(listCatalog(input)),
  );
  server.registerTool(
    "get_catalog_item",
    {
      title: "Get public catalog item",
      description:
        "Get one published catalog item, including approved mood tokens.",
      inputSchema: z
        .object({ id: z.string().regex(/^[a-z][a-z0-9-]{0,63}$/) })
        .strict(),
      annotations,
    },
    ({ id }) => {
      const item = getCatalogItem(id);
      return item
        ? result({ ...item })
        : {
            isError: true,
            content: [
              {
                type: "text" as const,
                text: "Catalog item not found. Use list_catalog or search_catalog to find a published ID.",
              },
            ],
          };
    },
  );
}

export async function handleMcp(request: Request): Promise<Response> {
  const server = new McpServer({ name: "subtle-catalog", version: "1.0.0" });
  registerCatalogTools(server);
  for (const item of catalog) {
    server.registerResource(
      item.id,
      `subtle://catalog/${item.id}`,
      {
        title: item.title,
        description: item.description,
        mimeType: "application/json",
      },
      (uri) => ({
        contents: [
          {
            uri: uri.href,
            mimeType: "application/json",
            text: JSON.stringify(item),
          },
        ],
      }),
    );
  }
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: 16384,
  });
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request);
    const body = await response.arrayBuffer();
    if (body.byteLength > 65536)
      return Response.json(
        {
          jsonrpc: "2.0",
          id: null,
          error: {
            code: -32603,
            message: "Catalog response exceeds the public output limit.",
          },
        },
        { status: 500 },
      );
    return new Response(body.byteLength ? body : null, {
      status: response.status,
      headers: response.headers,
    });
  } finally {
    await server.close();
  }
}
