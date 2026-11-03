import { expect, test } from "bun:test";
const base = "http://localhost:3001";
export function rpc(
  method: string,
  params?: unknown,
  id: number | undefined = 1,
) {
  return new Request(`${base}/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      "MCP-Protocol-Version": "2025-11-25",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      ...(id === undefined ? {} : { id }),
      method,
      ...(params === undefined ? {} : { params }),
    }),
  });
}
test("official Web Standard transport initializes stateless MCP on Bun through Elysia without a listener", async () => {
  const { createApi } = await import("../apps/api/src/app");
  const response = await createApi().handle(
    rpc("initialize", {
      protocolVersion: "2025-11-25",
      capabilities: {},
      clientInfo: { name: "synthetic-client", version: "1" },
    }),
  );
  expect(response.status).toBe(200);
  const body = await response.json();
  expect(body.result.serverInfo.name).toBe("subtle-catalog");
  expect(body.result.protocolVersion).toBe("2025-11-25");
  expect(response.headers.has("Mcp-Session-Id")).toBe(false);
});
test("MCP lists and reads finite public resources without accepting filesystem or arbitrary URL resources", async () => {
  const { createApi } = await import("../apps/api/src/app");
  const app = createApi();
  const listed = await (await app.handle(rpc("resources/list"))).json();
  expect(listed.result.resources.length).toBeGreaterThan(40);
  expect(
    listed.result.resources.every((resource: { uri: string }) =>
      resource.uri.startsWith("subtle://catalog/"),
    ),
  ).toBe(true);
  const read = await (
    await app.handle(rpc("resources/read", { uri: "subtle://catalog/button" }))
  ).json();
  expect(JSON.parse(read.result.contents[0].text).id).toBe("button");
  expect(read.result.contents[0].mimeType).toBe("application/json");
  for (const uri of [
    "file:///etc/passwd",
    "https://example.com/private",
    "subtle://catalog/missing",
  ]) {
    const error = await (
      await app.handle(rpc("resources/read", { uri }))
    ).json();
    expect(error.error.code).toBe(-32602);
  }
});
test("MCP rejects oversized queries, invalid schemas, extra fields, arbitrary IDs, unknown methods and mutation names", async () => {
  const { createApi } = await import("../apps/api/src/app");
  const app = createApi();
  for (const args of [
    { query: "x".repeat(81) },
    { query: "button", limit: 13 },
    { query: "button", limit: -1 },
    { query: "button", offset: 1001 },
    { query: "button", category: "x".repeat(41) },
    { query: "button", kind: "secret" },
    { query: "button", file: "/etc/passwd" },
  ]) {
    const response = await (
      await app.handle(
        rpc("tools/call", { name: "search_catalog", arguments: args }),
      )
    ).json();
    expect(response.result?.isError ?? !!response.error).toBe(true);
  }
  const invalidId = await (
    await app.handle(
      rpc("tools/call", {
        name: "get_catalog_item",
        arguments: { id: "../.env" },
      }),
    )
  ).json();
  expect(invalidId.result?.isError ?? !!invalidId.error).toBe(true);
  for (const name of ["write_file", "delete_catalog_item", "fetch_url"]) {
    const body = await (
      await app.handle(rpc("tools/call", { name, arguments: {} }))
    ).json();
    expect(body.error?.code ?? body.result?.isError).toBeTruthy();
  }
  const unknown = await (await app.handle(rpc("private/read", {}))).json();
  expect(unknown.error.code).toBe(-32601);
});
test("HTTP boundary enforces Origin/Host, method, media type, streamed body size and bounded responses", async () => {
  const { createApi } = await import("../apps/api/src/app");
  const app = createApi();
  const hostileOrigin = rpc("tools/list");
  hostileOrigin.headers.set("Origin", "https://hostile.example");
  expect((await app.handle(hostileOrigin)).status).toBe(403);
  const hostileHost = rpc("tools/list");
  hostileHost.headers.set("Host", "hostile.example");
  expect((await app.handle(hostileHost)).status).toBe(403);
  const wrongUrl = new Request("http://hostile.example/mcp", rpc("tools/list"));
  expect((await app.handle(wrongUrl)).status).toBe(403);
  const allowed = rpc("tools/list");
  allowed.headers.set("Origin", "http://localhost:4321");
  const allowedResponse = await app.handle(allowed);
  expect(allowedResponse.status).toBe(200);
  expect(allowedResponse.headers.get("Access-Control-Allow-Origin")).toBe(
    "http://localhost:4321",
  );
  expect(
    (await app.handle(new Request(`${base}/mcp`, { method: "DELETE" }))).status,
  ).toBe(405);
  const wrongType = rpc("tools/list");
  wrongType.headers.set("Content-Type", "text/plain");
  expect((await app.handle(wrongType)).status).toBe(415);
  const oversized = new Request(`${base}/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: " ".repeat(16385),
  });
  expect((await app.handle(oversized)).status).toBe(413);
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(17000));
      controller.close();
    },
  });
  expect(
    (
      await app.handle(
        new Request(`${base}/mcp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, text/event-stream",
          },
          body: stream,
        }),
      )
    ).status,
  ).toBe(413);
  const malformed = new Request(`${base}/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: "{bad",
  });
  expect((await (await app.handle(malformed)).json()).error.code).toBe(-32700);
  for (const kind of ["component", "pattern", "foundation", "mood"]) {
    const output = await app.handle(
      rpc("tools/call", {
        name: "list_catalog",
        arguments: { kind, limit: 12 },
      }),
    );
    const text = await output.text();
    expect(new TextEncoder().encode(text).length).toBeLessThanOrEqual(65536);
    expect(
      JSON.parse(text).result.structuredContent.items.length,
    ).toBeLessThanOrEqual(12);
  }
});
test("per-peer-IP limits ignore spoofed forwarding headers and bound the limiter memory", async () => {
  const { createApi } = await import("../apps/api/src/app");
  let ip = "synthetic-peer-one";
  let time = 1000;
  const app = createApi({
    rateLimit: 2,
    maxTrackedIps: 2,
    getIp: () => ip,
    now: () => time,
  });
  expect((await app.handle(rpc("tools/list"))).status).toBe(200);
  const spoofed = rpc("tools/list");
  spoofed.headers.set("X-Forwarded-For", "different-ip");
  expect((await app.handle(spoofed)).status).toBe(200);
  const limited = await app.handle(rpc("tools/list"));
  expect(limited.status).toBe(429);
  expect(limited.headers.get("Retry-After")).toBe("60");
  ip = "synthetic-peer-two";
  expect((await app.handle(rpc("tools/list"))).status).toBe(200);
  ip = "synthetic-peer-three";
  expect((await app.handle(rpc("tools/list"))).status).toBe(503);
  time += 60001;
  expect((await app.handle(rpc("tools/list"))).status).toBe(200);
});
test("typed REST supplement shares bounded public reads, rejects mutation methods and maps missing items", async () => {
  const { createApi } = await import("../apps/api/src/app");
  const app = createApi();
  const list = await app.handle(
    new Request(`${base}/api/catalog?kind=component&limit=2`),
  );
  expect(list.status).toBe(200);
  expect((await list.json()).items).toHaveLength(2);
  const item = await app.handle(new Request(`${base}/api/catalog/button`));
  expect((await item.json()).id).toBe("button");
  expect(
    (await app.handle(new Request(`${base}/api/catalog/missing`))).status,
  ).toBe(404);
  expect(
    (
      await app.handle(
        new Request(`${base}/api/catalog?query=${"x".repeat(81)}`),
      )
    ).status,
  ).toBe(400);
  expect(
    (await app.handle(new Request(`${base}/api/catalog?limit=1000`))).status,
  ).toBe(400);
  expect(
    (
      await app.handle(
        new Request(`${base}/api/catalog`, { method: "POST", body: "{}" }),
      )
    ).status,
  ).toBe(405);
});
test("official MCP client completes initialize, notification, tools and resource reads over the Web transport", async () => {
  const { Client } =
    await import("../apps/api/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js");
  const { StreamableHTTPClientTransport } =
    await import("../apps/api/node_modules/@modelcontextprotocol/sdk/dist/esm/client/streamableHttp.js");
  const { createApi } = await import("../apps/api/src/app");
  const app = createApi();
  const client = new Client({ name: "synthetic-interop-client", version: "1" });
  const transport = new StreamableHTTPClientTransport(new URL(`${base}/mcp`), {
    fetch: (input, init) => app.handle(new Request(input, init)),
  });
  await client.connect(transport);
  expect((await client.listTools()).tools).toHaveLength(3);
  const result = await client.callTool({
    name: "get_catalog_item",
    arguments: { id: "button" },
  });
  expect(result.isError).not.toBe(true);
  expect((await client.listResources()).resources.length).toBeGreaterThan(40);
  const read = await client.readResource({
    uri: "subtle://catalog/mood-beige",
  });
  const content = read.contents[0]!;
  expect(
    "text" in content && JSON.parse(content.text).tokens["--bg-main"],
  ).toBe("#FAF8F5");
  await client.close();
});
test("MCP lists only read-only catalog tools and executes list, search and get against the shared public catalog", async () => {
  const { createApi } = await import("../apps/api/src/app");
  const app = createApi();
  const listing = await (await app.handle(rpc("tools/list"))).json();
  expect(
    listing.result.tools.map((tool: { name: string }) => tool.name).sort(),
  ).toEqual(["get_catalog_item", "list_catalog", "search_catalog"]);
  for (const tool of listing.result.tools) {
    expect(tool.annotations.readOnlyHint).toBe(true);
    expect(tool.annotations.destructiveHint).toBe(false);
    expect(tool.annotations.openWorldHint).toBe(false);
  }
  const listed = await (
    await app.handle(
      rpc("tools/call", {
        name: "list_catalog",
        arguments: { kind: "component", limit: 2 },
      }),
    )
  ).json();
  expect(listed.result.structuredContent.items).toHaveLength(2);
  const searched = await (
    await app.handle(
      rpc("tools/call", {
        name: "search_catalog",
        arguments: { query: "Layered Sheet" },
      }),
    )
  ).json();
  expect(searched.result.structuredContent.items[0].id).toBe("sheet");
  const item = await (
    await app.handle(
      rpc("tools/call", {
        name: "get_catalog_item",
        arguments: { id: "mood-rosewood" },
      }),
    )
  ).json();
  expect(
    item.result.structuredContent.tokens["--status-available-text-aa"],
  ).toBe("#477552");
  const missing = await (
    await app.handle(
      rpc("tools/call", {
        name: "get_catalog_item",
        arguments: { id: "unknown-item" },
      }),
    )
  ).json();
  expect(missing.result.isError).toBe(true);
  expect(missing.result.content[0].text).toContain("not found");
  expect(JSON.stringify([listing, listed, searched, item])).not.toMatch(
    /\/home\/|sourcePath|\.env|password|api_key/i,
  );
});
