import { createServer } from "node:net";
import { expect, test } from "bun:test";

type DevConfig = {
  hostname: string;
  port: number;
  maxRequestBodySize: number;
  allowedHosts: string[];
  allowedOrigins: string[];
};
type DevModule = {
  resolveDevApiConfig?: (env?: Record<string, string | undefined>) => DevConfig;
  assertDevApiPortAvailable?: (port: number, hostname?: string) => Promise<void>;
};
const dev = (await import("../apps/api/src/dev")) as unknown as DevModule;

test("local API dev config keeps its documented loopback defaults", () => {
  expect(typeof dev.resolveDevApiConfig).toBe("function");
  if (!dev.resolveDevApiConfig) return;
  const config = dev.resolveDevApiConfig({});
  expect(config.hostname).toBe("127.0.0.1");
  expect(config.port).toBe(3001);
  expect(config.allowedHosts).toEqual(["localhost:3001", "127.0.0.1:3001"]);
});

test("local API port override updates listener, Host and Origin allowlists together", () => {
  expect(typeof dev.resolveDevApiConfig).toBe("function");
  if (!dev.resolveDevApiConfig) return;
  const config = dev.resolveDevApiConfig({ SUBTLE_API_PORT: "33265" });
  expect(config.port).toBe(33265);
  expect(config.allowedHosts).toEqual(["localhost:33265", "127.0.0.1:33265"]);
  expect(config.allowedOrigins).toContain("http://localhost:33265");
  expect(config.allowedOrigins).toContain("http://127.0.0.1:33265");
  expect(config.allowedOrigins).toContain("http://localhost:4321");
});

test("local API rejects invalid ports instead of silently binding another listener", () => {
  const resolveConfig = dev.resolveDevApiConfig;
  expect(typeof resolveConfig).toBe("function");
  if (!resolveConfig) return;
  for (const value of ["0", "65536", "3001oops", "", "-1"]) {
    expect(() => resolveConfig({ SUBTLE_API_PORT: value })).toThrow(
      /SUBTLE_API_PORT/,
    );
  }
});

test("local API port check reports a pre-existing listener and accepts a free port", async () => {
  const assertAvailable = dev.assertDevApiPortAvailable;
  expect(typeof assertAvailable).toBe("function");
  if (!assertAvailable) return;
  const blocker = createServer();
  await new Promise<void>((resolve, reject) => {
    blocker.once("error", reject);
    blocker.listen(0, "127.0.0.1", resolve);
  });
  const address = blocker.address();
  if (!address || typeof address === "string") throw new Error("Missing port");
  await expect(assertAvailable(address.port)).rejects.toThrow(
    `127.0.0.1:${address.port} is already in use`,
  );
  await new Promise<void>((resolve, reject) =>
    blocker.close((error) => (error ? reject(error) : resolve())),
  );
  await expect(assertAvailable(address.port)).resolves.toBeUndefined();
});

type ProductionConfig = {
  hostname: string;
  port: number;
  maxRequestBodySize: number;
  allowedHosts: string[];
  allowedOrigins: string[];
  getIp: (request: Request) => string;
};
type ProductionModule = {
  resolveProductionApiConfig?: (
    env?: Record<string, string | undefined>,
  ) => ProductionConfig;
};
const production = (await import("../apps/api/src/prod")) as unknown as ProductionModule;

test("production API binds loopback and allows only its public API host and frontend origin", () => {
  expect(typeof production.resolveProductionApiConfig).toBe("function");
  if (!production.resolveProductionApiConfig) return;
  const config = production.resolveProductionApiConfig({});
  expect(config.hostname).toBe("127.0.0.1");
  expect(config.port).toBe(33265);
  expect(config.maxRequestBodySize).toBe(16384);
  expect(config.allowedHosts).toContain("subtle-api.arifian.web.id");
  expect(config.allowedHosts).toContain("127.0.0.1:33265");
  expect(config.allowedOrigins).toEqual(["https://subtle.arifian.web.id"]);
});

test("production API validates the trusted reverse-proxy address and port override", () => {
  expect(typeof production.resolveProductionApiConfig).toBe("function");
  if (!production.resolveProductionApiConfig) return;
  const config = production.resolveProductionApiConfig({ SUBTLE_API_PORT: "33266" });
  expect(config.port).toBe(33266);
  expect(config.allowedHosts).toContain("127.0.0.1:33266");
  expect(config.getIp(new Request("http://local", { headers: { "X-Real-IP": "203.0.113.9" } }))).toBe("203.0.113.9");
  expect(config.getIp(new Request("http://local", { headers: { "X-Real-IP": "attacker-value" } }))).toBe("unknown-proxy-peer");
});

test("production API rejects malformed port overrides", () => {
  const resolveConfig = production.resolveProductionApiConfig;
  expect(typeof resolveConfig).toBe("function");
  if (!resolveConfig) return;
  for (const value of ["0", "65536", "33265oops", "", "-1"]) {
    expect(() => resolveConfig({ SUBTLE_API_PORT: value })).toThrow(
      /SUBTLE_API_PORT/,
    );
  }
});
