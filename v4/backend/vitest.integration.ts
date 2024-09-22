import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    exclude: ["./src/**/*.test.ts"],
    include: ["./src/**/*.test.integration.ts"],
    reporters: ["html", "verbose"],
    outputFile: "./.vitest/html",
    alias: {
      "@/": new URL("./src/", import.meta.url).pathname,
    },
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    testTimeout: 60_000,
    teardownTimeout: 60_000,
  },
});
