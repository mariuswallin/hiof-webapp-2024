import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  webServer: [
    // {
    //   command: "pnpm run dev",
    //   url: "http://localhost:3999",
    //   reuseExistingServer: !process.env.CI,
    //   cwd: path.resolve(import.meta.dirname, "..", "backend"),
    //   timeout: 120 * 1000,
    //   stdout: "pipe",
    //   stderr: "pipe",
    // },
    // {
    //   command: "pnpm run dev",
    //   url: "http://localhost:5174",
    //   reuseExistingServer: !process.env.CI,
    //   cwd: path.resolve(import.meta.dirname),
    //   stdout: "pipe",
    //   stderr: "pipe",
    //   timeout: 120 * 1000,
    // },
  ],
});

console.log(import.meta.dirname);
