import { createServer } from "node:net";
import { createApi } from "./app";

// This entry point is deliberately local-only. Production hosting is unresolved.
export type DevApiConfig = {
  hostname: "127.0.0.1";
  port: number;
  maxRequestBodySize: number;
  allowedHosts: string[];
  allowedOrigins: string[];
};

export function resolveDevApiConfig(
  env: Record<string, string | undefined> = process.env,
): DevApiConfig {
  const rawPort = env.SUBTLE_API_PORT ?? "3001";
  if (!/^[0-9]+$/.test(rawPort)) {
    throw new RangeError("SUBTLE_API_PORT must be an integer between 1 and 65535");
  }
  const port = Number(rawPort);
  if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
    throw new RangeError("SUBTLE_API_PORT must be an integer between 1 and 65535");
  }
  const hostname = "127.0.0.1" as const;
  return {
    hostname,
    port,
    maxRequestBodySize: 16384,
    allowedHosts: [`localhost:${port}`, `${hostname}:${port}`],
    allowedOrigins: [
      "http://localhost:4321",
      "http://127.0.0.1:4321",
      `http://localhost:${port}`,
      `http://${hostname}:${port}`,
    ],
  };
}

export async function assertDevApiPortAvailable(
  port: number,
  hostname = "127.0.0.1",
): Promise<void> {
  const probe = createServer();
  try {
    await new Promise<void>((resolve, reject) => {
      probe.once("error", reject);
      probe.listen(port, hostname, () => {
        probe.close((error) => (error ? reject(error) : resolve()));
      });
    });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "EADDRINUSE") {
      throw new Error(
        `${hostname}:${port} is already in use; choose another port via SUBTLE_API_PORT.`,
        { cause: error },
      );
    }
    throw error;
  }
}

if (import.meta.main) {
  if (process.env.NODE_ENV === "production")
    throw new Error(
      "This local development entry point cannot run in production. Choose and review the API hosting topology first.",
    );
  const { hostname, port, maxRequestBodySize, allowedHosts, allowedOrigins } =
    resolveDevApiConfig();
  await assertDevApiPortAvailable(port, hostname);
  const app = createApi({ allowedHosts, allowedOrigins }).listen({
    hostname,
    port,
    maxRequestBodySize,
  });
  console.log(`Subtle local catalog: ${app.server?.url}mcp`);
}
