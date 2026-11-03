// Local QA only. Serve exactly the built public artifact, never the workspace.
import { resolve } from "node:path";
const root = resolve("apps/web/dist");
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: 4321,
  async fetch(req) {
    const url = new URL(req.url);
    const path = resolve(root, `.${decodeURIComponent(url.pathname)}`);
    if (!path.startsWith(`${root}/`) && path !== root)
      return new Response("Forbidden", { status: 403 });
    const file = Bun.file(
      path.endsWith("/") || !url.pathname.split("/").at(-1)?.includes(".")
        ? `${path}/index.html`
        : path,
    );
    return (await file.exists())
      ? new Response(file)
      : new Response("Not found", { status: 404 });
  },
});
console.log(`Local artifact: ${server.url}`);
