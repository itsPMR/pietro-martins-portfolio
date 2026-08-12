import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 7_500,
  },
  fullyParallel: true,
  outputDir: "test-results",
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-webkit",
      use: { ...devices["iPhone 13"] },
    },
  ],
  reporter: [["list"], ["html", { open: "never" }]],
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port 3100",
    port: 3100,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
