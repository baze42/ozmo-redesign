import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: /browser\.spec\.mjs/,
  use: {
    trace: "on-first-retry"
  },
  projects: [
    { name: "Desktop Chrome", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1100 } } },
    { name: "Tablet Safari", use: { ...devices["iPad Pro 11"] } },
    { name: "Mobile Safari", use: { ...devices["iPhone 13"] } }
  ]
});
