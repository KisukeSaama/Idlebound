import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { secureHeaders } from "hono/secure-headers";
import { sql } from "./db/client";
import { env } from "./env";
import { t } from "./lib/i18n";
import { authRoutes } from "./routes/auth";
import { leaderboardRoutes } from "./routes/leaderboard";
import { saveRoutes } from "./routes/save";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const siteOrigin = new URL(env.PUBLIC_SITE_URL).origin;

export function createApp() {
  const app = new Hono();

  app.use(secureHeaders({ crossOriginResourcePolicy: "same-origin" }));
  app.use(bodyLimit({ maxSize: 512 * 1024, onError: (c) => c.json({ error: t(c).requestTooLarge }, 413) }));

  // Anti-CSRF: state-changing requests must carry the game client's header (impossible to
  // set from another site without a CORS preflight, which the API refuses) and, when the
  // browser says so, come from our own origin.
  app.use(async (c, next) => {
    if (!SAFE_METHODS.has(c.req.method)) {
      if (c.req.header("x-idlebound") !== "1") return c.json({ error: t(c).requestRefused }, 403);
      const origin = c.req.header("origin");
      if (origin && origin !== siteOrigin && env.NODE_ENV === "production") return c.json({ error: t(c).originRefused }, 403);
    }
    await next();
  });

  app.get("/health", async (c) => {
    try {
      await sql`select 1`;
      return c.json({ ok: true });
    } catch {
      return c.json({ ok: false }, 503);
    }
  });

  app.route("/auth", authRoutes);
  app.route("/save", saveRoutes);
  app.route("/leaderboard", leaderboardRoutes);

  app.notFound((c) => c.json({ error: t(c).notFound }, 404));
  app.onError((error, c) => {
    console.error(`[api] ${c.req.method} ${c.req.path}`, error);
    return c.json({ error: t(c).internalError }, 500);
  });

  return app;
}
