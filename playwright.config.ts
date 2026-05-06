import { defineConfig, devices } from '@playwright/test';
import { URLS, TIMEOUTS } from './config/constants';

const AUTH_FILE = '.auth/sauce.json';

export default defineConfig({
  testDir: './tests',
  testIgnore: ['**/unit/**', '**/bdd/**'],
  timeout: TIMEOUTS.DEFAULT,
  expect: {
    timeout: TIMEOUTS.EXPECT,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    ['allure-playwright'],
    ['json', { outputFile: 'data/results/playwright-results.json' }],
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    baseURL: process.env.BASE_URL || URLS.SAUCE_DEMO,
    actionTimeout: TIMEOUTS.ACTION,
    navigationTimeout: TIMEOUTS.NAVIGATION,
    testIdAttribute: 'data-test',
    ignoreHTTPSErrors: true,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  },
  projects: [
    // ── Setup project: runs once, saves auth state (ADR-009) ──────────
    {
      name: 'setup',
      testMatch: 'auth/*.setup.ts',
    },

    // ── Default CI runs Chromium only ─────────────────────────────────
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: AUTH_FILE,
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ],
        },
      },
      dependencies: ['setup'],
    },
  ],
});
