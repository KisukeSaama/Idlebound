import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // The web app's "@/..." imports (tsconfig paths), never "@idlebound/...".
    alias: [{ find: /^@\//, replacement: fileURLToPath(new URL("./apps/web/src/", import.meta.url)) }]
  },
  test: {
    include: ["packages/*/src/**/*.test.ts", "apps/api/src/**/*.test.ts", "apps/web/src/**/*.test.ts"],
    environment: "node"
  }
});
