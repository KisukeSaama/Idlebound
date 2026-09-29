import path from "node:path";
import type { NextConfig } from "next";

/**
 * The release (commit) this build comes from, set by the CI image build; empty elsewhere. A
 * page compares it with the server's to move to a newer release (src/game/newRelease.ts).
 */
const release = process.env.IDLEBOUND_RELEASE ?? "";

const config: NextConfig = {
  output: "standalone",
  // Not deploymentId: with Turbopack it loads every chunk twice and the game never starts.
  env: { IDLEBOUND_RELEASE: release },
  // Monorepo: file tracing starts at the repo root so @idlebound/game is bundled.
  outputFileTracingRoot: path.resolve(process.cwd(), "../.."),
  transpilePackages: ["@idlebound/game"],
  poweredByHeader: false,
  reactStrictMode: true,
  // Images are already optimized to WebP (assets-src/optimize.py): no sharp at runtime.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "X-Frame-Options", value: "DENY" }
          // Content-Security-Policy: set by src/proxy.ts (per-request nonce).
        ]
      },
      {
        // Reset and confirmation tokens are in the URL: they must never leak through the
        // Referer header nor stay in a cache.
        source: "/:locale(fr|en)/:page(reset-password|verify-email)",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }, { key: "Cache-Control", value: "no-store" }]
      },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }]
      }
    ];
  }
};

export default config;
