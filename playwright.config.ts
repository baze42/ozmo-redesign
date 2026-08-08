import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command:
      "env -u FORCE_COLOR -u NO_COLOR npx astro preview stop >/dev/null 2>&1 || true; env -u FORCE_COLOR -u NO_COLOR npm run build && env -u FORCE_COLOR -u NO_COLOR npx astro preview --background --host 127.0.0.1 && trap 'env -u FORCE_COLOR -u NO_COLOR npx astro preview stop >/dev/null 2>&1 || true' EXIT INT TERM; while true; do sleep 1; done",
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
