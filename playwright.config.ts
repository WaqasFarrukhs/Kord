import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e', fullyParallel: true, retries: 0,
  use: { baseURL: 'http://127.0.0.1:8081', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-web', use: { ...devices['Pixel 7'], defaultBrowserType: 'chromium' } },
  ],
  webServer: [
    { command: 'pnpm dev:api', url: 'http://127.0.0.1:3000/api/v1/health', env: { DATABASE_URL: 'postgresql://test:test@127.0.0.1:5432/test', WEB_ORIGINS: 'http://127.0.0.1:8081' }, reuseExistingServer: !process.env.CI },
    { command: 'pnpm --filter @kord/client web --port 8081', url: 'http://127.0.0.1:8081', env: { EXPO_PUBLIC_API_URL: 'http://127.0.0.1:3000', CI: '1' }, reuseExistingServer: !process.env.CI, timeout: 120000 },
  ],
});
