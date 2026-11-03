import { isIP } from "node:net";
import { createServer } from "node:net";
import { createApi } from "./app";

const API_HOST = "subtle-api.arifian.web.id";
const FRONTEND_ORIGIN = "https://subtle.arifian.web.id";

export type ProductionApiConfig = {
  hostname: "127.0.0.1";
  port: number;
  maxRequestBodySize: number;
  allowedHosts: string[];
  allowedOrigins: string[];
  getIp: (request: Request) => string;
};

export function trustedProxyAddress(request: Request): string {
  const value = request.headers.get("X-Real-IP")?.trim() ?? "";
  return isIP(value) ? value : "unknown-proxy-peer";
}

export function resolveProductionApiConfig(
  env: Record<string, string | undefined> = process.env,
): ProductionApiConfig {
  const rawPort = env.SUBTLE_API_PORT ?? "33265";
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
    allowedHosts: [API_HOST, `localhost:${port}`, `${hostname}:${port}`],
    allowedOrigins: [FRONTEND_ORIGIN],
    getIp: trustedProxyAddress,
  };
}

export async function assertProductionApiPortAvailable(
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
      throw new Error(`${hostname}:${port} is already in use; choose another SUBTLE_API_PORT.`, {
        cause: error,
      });
    }
    throw error;
  }
}

if (import.meta.main) {
  if (process.env.NODE_ENV !== "production") {
    throw new Error("The production API entry point requires NODE_ENV=production.");
  }
  const config = resolveProductionApiConfig();
  await assertProductionApiPortAvailable(config.port, config.hostname);
  const app = createApi(config).listen({
    hostname: config.hostname,
    port: config.port,
    maxRequestBodySize: config.maxRequestBodySize,
  });
  console.log(`Subtle catalog API listening on ${app.server?.url}`);
}
