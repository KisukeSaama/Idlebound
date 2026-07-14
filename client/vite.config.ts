import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: "client",
  base: process.env.GITHUB_PAGES === "true" ? "/Idlebound/" : "/",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3001"
    }
  },
  build: {
    outDir: "../dist/client",
    emptyOutDir: true
  }
});
