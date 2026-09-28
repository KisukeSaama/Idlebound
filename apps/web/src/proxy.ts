/**
 * Runs before every page request:
 *  1. Locale routing. Old French URLs (/jouer…) get a permanent redirect to /fr/…; any
 *     other path without a locale prefix is redirected to the visitor's language (explicit
 *     choice in the ib_lang cookie, else Accept-Language). Prefixed paths are never
 *     redirected, so a shared /en/… link always opens in English.
 *  2. Nonce-based Content-Security-Policy, computed per request: only the scripts emitted by
 *     Next (which reads the nonce from this header) run. Every page is rendered dynamically
 *     (root layout), which is required to inject the nonce.
 */
import { LOCALE_COOKIE, resolveLocale } from "@idlebound/game";
import { NextResponse, type NextRequest } from "next/server";
import { LEGACY_PATHS, href, localeFromPath } from "@/i18n/routing";

const isDev = process.env.NODE_ENV !== "production";

/** Request header carrying the locale of the requested page. */
export const LOCALE_HEADER = "x-idlebound-locale";

/** robots.txt, sitemap.xml, manifest.webmanifest, public files: served as-is. */
const FILE_PATH = /\.[a-z0-9]+$/i;

function contentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // style="" attributes set by React cannot carry a nonce.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "media-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join("; ");
}

function localeRedirect(request: NextRequest): NextResponse | null {
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/_next/") || FILE_PATH.test(pathname) || localeFromPath(pathname)) return null;

  const legacy = LEGACY_PATHS[pathname];
  if (legacy) {
    // Query string kept: the reset-password token travels in it.
    return NextResponse.redirect(new URL(`${href("fr", legacy)}${search}`, request.url), 308);
  }

  const locale = resolveLocale(request.cookies.get(LOCALE_COOKIE)?.value, request.headers.get("accept-language"));
  const target = request.nextUrl.clone();
  target.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(target, 307);
  // The answer depends on these headers: caches must not share it across visitors.
  response.headers.set("Vary", "Accept-Language, Cookie");
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export function proxy(request: NextRequest) {
  const redirect = localeRedirect(request);
  if (redirect) return redirect;

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = contentSecurityPolicy(nonce);
  const headers = new Headers(request.headers);
  headers.set("content-security-policy", csp);
  // Lets components without route params (not-found) know the page locale.
  const locale = localeFromPath(request.nextUrl.pathname);
  if (locale) headers.set(LOCALE_HEADER, locale);
  else headers.delete(LOCALE_HEADER);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!api/|_next/static|_next/image|assets/|favicon.png|icon-|og.png).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" }
      ]
    }
  ]
};
