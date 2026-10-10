import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:3001";
// Chrome is available locally; CI installs matching Playwright engines.
const chrome = process.env.CI ? {} : { channel: "chrome" };

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : 4,
  reporter: [["list"], ["html", { open: "never" }]],
  use: { baseURL, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], ...chrome, viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { ...devices["iPhone 13"], defaultBrowserType: "chromium", ...chrome } },
    ...(process.env.CROSS_BROWSER ? [
      { name: "webkit", use: { ...devices["Desktop Safari"] } },
      { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    ] : []),
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3001",
    url: baseURL,
    reuseExistingServer: false,
  },
});
