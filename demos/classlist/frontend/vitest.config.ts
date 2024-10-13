import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    exclude: ["./tests/**/*.spec.ts", "node_modules"],
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    globals: true,
    setupFiles: ["./test.setup.ts"],
  },
});
