/**
 * Proxy to the Hono API. The browser only talks to the web container (the only one exposed
 * through Traefik); the API stays on the internal network. The URL is read at runtime, not
 * at build time, so the same image serves dev and prod.
 */
import { LOCALE_COOKIE, resolveLocale } from "@idlebound/game";
import type { NextRequest } from "next/server";
import { messages } from "@/i18n/messages";
import { ownRelease, RELEASE_HEADER } from "@/lib/release";

export const dynamic = "force-dynamic";

const FORWARDED_REQUEST_HEADERS = ["content-type", "cookie", "x-idlebound", "origin", "user-agent", "x-forwarded-for", "cf-connecting-ip", "accept", "accept-language"];
const FORWARDED_RESPONSE_HEADERS = ["content-type", "set-cookie", "retry-after", "cache-control", "vary"];
/** Above the API limit (512 KB): refused here, without loading everything in memory. */
const MAX_BODY_BYTES = 600 * 1024;
const UPSTREAM_TIMEOUT_MS = 15_000;

/** The few errors produced by the proxy itself, in the language of the request. */
function errors(request: NextRequest) {
  return messages(resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get("accept-language"))).hud.errors;
}

/** Every answer tells the page which release serves it: an older page moves to it (see game/newRelease.ts). */
function stamped(response: Response): Response {
  const release = ownRelease();
  if (release) response.headers.set(RELEASE_HEADER, release);
  return response;
}

/** Reads the body, stopping as soon as the limit is exceeded (missing or lying Content-Length). */
async function readBody(request: NextRequest): Promise<ArrayBuffer | null> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return null;
  if (!request.body) return new ArrayBuffer(0);
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_BODY_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const body = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body.buffer;
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const base = process.env.INTERNAL_API_BASE_URL ?? "http://localhost:8000";
  const { path } = await context.params;
  const target = new URL(`${base.replace(/\/$/, "")}/${path.map(encodeURIComponent).join("/")}`);
  target.search = request.nextUrl.search;

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const body = hasBody ? await readBody(request) : undefined;
  if (body === null) return stamped(Response.json({ error: errors(request).tooLarge }, { status: 413 }));

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS)
    });
  } catch {
    return stamped(Response.json({ error: errors(request).unreachable }, { status: 502 }));
  }

  const responseHeaders = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    if (name === "set-cookie") {
      for (const cookie of upstream.headers.getSetCookie()) responseHeaders.append("set-cookie", cookie);
    } else {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
  }
  return stamped(new Response(upstream.body, { status: upstream.status, headers: responseHeaders }));
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as DELETE };
