import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["./src/**/*.test.ts"],
    exclude: ["./src/**/*.test.integration.ts"],
    reporters: ["html", "verbose"],
    outputFile: "./.vitest/html",
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
  },
});
