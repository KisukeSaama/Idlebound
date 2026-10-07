// Single-file API bundle: the production image needs no node_modules.
import { build } from "esbuild";
import { cpSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
await build({
  // The API, and the worker threads that replay journals (see src/replay/pool.ts).
  // The review of presence (node dist/review.js, see src/review-cli.ts) ships beside them.
  entryPoints: { index: "src/index.ts", "replay-worker": "src/replay/worker.ts", review: "src/review-cli.ts" },
  bundle: true,
  platform: "node",
  target: "node24",
  format: "esm",
  outdir: "dist",
  sourcemap: true,
  legalComments: "none",
  // Some CommonJS dependencies call require(): provide it to the ESM bundle.
  banner: { js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);" }
});
cpSync("drizzle", "dist/drizzle", { recursive: true });
console.log("API built into dist/");
