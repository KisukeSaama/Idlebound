import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { sql } from "./db/client";
import { env } from "./env";
import { purgeExpired } from "./lib/session";
import { runMigrations } from "./migrate";

await runMigrations();
console.log("[api] migrations up to date");

const server = serve({ fetch: createApp().fetch, port: env.API_PORT, hostname: "0.0.0.0" }, (info) => {
  console.log(`[api] listening on :${info.port} (${env.NODE_ENV})`);
});

const runPurge = () => purgeExpired().catch((error) => console.error("[api] periodic purge", error));
void runPurge();
const purge = setInterval(runPurge, 6 * 3600_000);
purge.unref();

function shutdown(signal: string) {
  console.log(`[api] ${signal} received, shutting down…`);
  server.close(() => {
    sql.end({ timeout: 5 }).finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
