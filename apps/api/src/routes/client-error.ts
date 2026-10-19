import { Hono } from "hono";
import { z } from "zod";
import { fail } from "../lib/errors";
import { clientIp, limiter } from "../lib/rate-limit";

/** Reports from one address: a page caught in a loop of errors is heard, then waits. */
const reportIp = limiter(10, 60_000);
/** Every address together: a broken release logs what it breaks, never a flood. */
const reportAll = limiter(600, 60_000);

/**
 * What a page reports of an error it met: what broke and where, nothing about who. The
 * address is used for the rate limit only, never logged; no cookie or account is read.
 */
const reportBody = z.object({
  kind: z.enum(["error", "rejection", "render", "window"]),
  message: z.string().max(500),
  stack: z.string().max(4000).optional(),
  /** The page's path, without its query string. */
  path: z.string().max(200),
  release: z.string().max(64).optional(),
  version: z.string().max(32).optional()
});

/** One line per report: the stack folded so a report never spans the log. */
function line(value: string, max: number): string {
  return value.replace(/\s+/g, " ").slice(0, max);
}

export const clientErrorRoutes = new Hono().post("/", async (c) => {
  if (reportIp.consume(clientIp(c)) > 0 || reportAll.consume("all") > 0) return c.body(null, 204);
  let input: unknown;
  try {
    input = await c.req.json();
  } catch {
    return c.json(fail("invalid_request"), 400);
  }
  const parsed = reportBody.safeParse(input);
  if (!parsed.success) return c.json(fail("invalid_request"), 400);
  const { kind, message, stack, path, release, version } = parsed.data;
  console.warn(`[client] ${kind} ${line(path.split("?")[0], 200)} v${version ?? "?"} ${release ?? "?"}: ${line(message, 500)}${stack ? ` | ${line(stack, 1500)}` : ""}`);
  return c.body(null, 204);
});
