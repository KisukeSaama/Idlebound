// Single-file API bundle: the production image needs no node_modules.
import { build } from "esbuild";
import { cpSync, rmSync } from "node:fs";

rmSync("dist", { recursive: true, force: true });
await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node24",
  format: "esm",
  outfile: "dist/index.js",
  sourcemap: true,
  legalComments: "none",
  // Some CommonJS dependencies call require(): provide it to the ESM bundle.
  banner: { js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);" }
});
cpSync("drizzle", "dist/drizzle", { recursive: true });
console.log("API built into dist/");
