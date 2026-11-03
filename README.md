# Subtle

Subtle is Arifian's Soft Editorial Materialism design-system showcase. It pairs a static Astro site with React specimens and an independent, read-only Elysia MCP API.

The visual authority is [DESIGN.md](DESIGN.md).

## Architecture

This project is organized as a Bun 1.4.2 monorepo:

| Workspace | Description |
| --- | --- |
| `apps/web` | Astro 7, React, and TypeScript static site with hydrated specimens |
| `packages/catalog` | Shared catalog data, design tokens, and generated mood CSS |
| `apps/api` | Independent Elysia service providing read-only MCP and supplemental REST endpoints |

### Build & Deployment

- **Frontend:** Built and published via `netlify.toml`, which configures and deploys only `apps/web/dist`.
- **API:** Deployed separately from the static frontend as an independent service.

## Local Development

Prerequisites: [Bun](https://bun.sh) 1.4.2.

Install workspace dependencies:

```sh
bun install --frozen-lockfile
```

Start the frontend and API services in separate terminals:

```sh
# Start the Astro development server (http://localhost:4321)
bun run dev

# Start the Elysia MCP API server (http://localhost:3001/mcp)
bun run dev:api
```

The API server defaults to port 3001 and can be customized with `SUBTLE_API_PORT=<port>`. Astro commands run under Bun. The static specimens run standalone without requiring an active API connection.

## Scripts

Workspace scripts documented in `package.json`:

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Astro frontend development server |
| `bun run dev:api` | Start the Elysia MCP API development server |
| `bun run build` | Build the static web distribution to `apps/web/dist` |
| `bun run typecheck` | Run Astro checks and TypeScript type verification |
| `bun run test` | Run unit and behavior tests (`tests`) |
| `bun run test:browser` | Run Playwright browser QA across viewports, moods, and accessibility |
| `bun run audit:artifact` | Audit the built static distribution artifact |
| `bun run audit:a11y-dom` | Run DOM accessibility audits |
| `bun run licenses` | Audit workspace dependency licenses |

## Public Catalog MCP API

The API implements the Model Context Protocol (MCP) over standard HTTP transport (`WebStandardStreamableHTTPServerTransport`), providing stateless, read-only access to published design-system catalog metadata.

### MCP Tools

| Tool | Inputs | Result |
| --- | --- | --- |
| `list_catalog` | Optional `kind`, `category`, `limit`, `offset` | Bounded public catalog items |
| `search_catalog` | `query` string and optional filters | Matching public catalog entries |
| `get_catalog_item` | Published item `id` | Catalog item metadata and mood tokens |

### MCP Resources

- Resource URI format: `subtle://catalog/{id}` (e.g., `subtle://catalog/button`)
- Registered, read-only resources exposing catalog definitions.

### REST Endpoints

Supplemental read-only REST endpoints provide direct JSON access:

- `GET /api/catalog`
- `GET /api/catalog/{id}`

### Boundary & Security

- **Read-Only Access:** Exposes only published catalog metadata, tokens, and pattern documentation. No filesystem access, process commands, or write tools.
- **Validation & Limits:** Bounded query parameters, payload size limits, and rate limiting.
- **Origin Validation:** Ingress enforces CORS and origin boundaries.
