import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["client/src/**/*.test.ts", "shared/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html"]
    }
  }
});
