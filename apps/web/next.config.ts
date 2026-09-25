import path from "node:path";
import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
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
        // The reset token is in the URL: it must never leak through the Referer header.
        source: "/:locale(fr|en)/reset-password",
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
