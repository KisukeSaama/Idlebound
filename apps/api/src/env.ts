import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  API_PORT: z.coerce.number().int().default(8080),
  DATABASE_URL: z.string().min(1).default("postgres://idlebound:idlebound@localhost:5432/idlebound"),
  PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  /** Secure cookie: on by default as soon as the site is served over HTTPS. */
  COOKIE_SECURE: z.enum(["true", "false"]).optional(),
  /** Header holding the real client IP, set by the edge proxy (Cloudflare). */
  CLIENT_IP_HEADER: z.string().default("cf-connecting-ip"),
  /** Edge proxy ranges (comma-separated CIDRs); Cloudflare's by default. */
  EDGE_PROXY_CIDRS: z.string().optional(),
  /** Number of trusted proxies that append an entry to X-Forwarded-For. */
  TRUSTED_PROXY_COUNT: z.coerce.number().int().min(0).default(1),
  /** smtp(s)://user:pass@host:port; without it, e-mails are written to the logs. */
  SMTP_URL: z.string().optional(),
  MAIL_FROM: z.string().default("Idlebound <no-reply@kisukesaama.com>")
});

const parsed = schema.parse(process.env);

export const env = {
  ...parsed,
  COOKIE_SECURE: parsed.COOKIE_SECURE ? parsed.COOKIE_SECURE === "true" : parsed.PUBLIC_SITE_URL.startsWith("https:")
};
export type Env = typeof env;
