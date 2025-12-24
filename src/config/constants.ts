/**
 * Framework Constants
 *
 * This file contains constants used throughout the test framework.
 * Some constants are actively used, others are available for future use
 * (e.g., USER_AGENTS for cross-browser testing, VIEWPORTS for responsive testing).
 */

// ── Browser ──────────────────────────────────────────────────────────

export const BROWSERS = {
  CHROMIUM: 'chromium',
  FIREFOX: 'firefox',
  WEBKIT: 'webkit',
} as const;

/**
 * User agent strings for different browsers and devices.
 * Available for custom browser context configuration and mobile testing.
 */
export const USER_AGENTS = {
  CHROME_WINDOWS:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  CHROME_MAC:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  /** Available for Firefox-specific testing */
  FIREFOX_WINDOWS:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  SAFARI_MAC:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  /** Available for Android mobile testing */
  MOBILE_ANDROID:
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  MOBILE_IOS:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
} as const;

// ── Timeouts (ms) ────────────────────────────────────────────────────

export const TIMEOUTS = {
  DEFAULT: 30000,
  NAVIGATION: 30000,
  ACTION: 10000,
  EXPECT: 5000,
  API: 10000,
  SHORT: 3000,
  LONG: 60000,
  ANIMATION: 500,
} as const;

/**
 * Retry configuration for flaky operations.
 * BACKOFF_MULTIPLIER is available for exponential backoff retry patterns.
 */
// ── Retry ────────────────────────────────────────────────────────────

export const RETRY = {
  MAX_ATTEMPTS: 3,
  DELAY_MS: 1000,
  /** Available for exponential backoff retry patterns */
  BACKOFF_MULTIPLIER: 2,
} as const;

// ── URLs ─────────────────────────────────────────────────────────────

export const URLS = {
  BING: 'https://www.bing.com',
  GOOGLE: 'https://www.google.com',
  SAUCE_DEMO: 'https://www.saucedemo.com',
  JSON_PLACEHOLDER: 'https://jsonplaceholder.typicode.com',
  REQRES: 'https://reqres.in/api',
} as const;

export const API_BASE_URL = URLS.JSON_PLACEHOLDER;

// ── Test Credentials ─────────────────────────────────────────────────

export const CREDENTIALS = {
  SAUCE: {
    STANDARD_USER: { username: 'standard_user', password: 'secret_sauce' },
    LOCKED_USER: { username: 'locked_out_user', password: 'secret_sauce' },
    PROBLEM_USER: { username: 'problem_user', password: 'secret_sauce' },
    PERFORMANCE_USER: { username: 'performance_glitch_user', password: 'secret_sauce' },
  },
} as const;

// ── HTTP Status ──────────────────────────────────────────────────────

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Common viewport sizes for responsive testing.
 * DESKTOP is used by default in settings. LAPTOP available for testing smaller screens.
 */
// ── Viewports ────────────────────────────────────────────────────────

export const VIEWPORTS = {
  DESKTOP: { width: 1920, height: 1080 },
  /** Available for testing on smaller laptop screens */
  LAPTOP: { width: 1366, height: 768 },
  TABLET: { width: 768, height: 1024 },
  MOBILE: { width: 375, height: 667 },
} as const;

// ── Paths ────────────────────────────────────────────────────────────

export const PATHS = {
  SCREENSHOTS: './test-results/screenshots',
  VIDEOS: './test-results/videos',
  TRACES: './test-results/traces',
  TEST_DATA: './test-data',
  REPORTS: './playwright-report',
} as const;
