// All the constants we use across tests. Some of these are used everywhere,
// others (like USER_AGENTS) are here for when you need them.

// ── Browser ──────────────────────────────────────────────────────────

export const BROWSERS = {
  CHROMIUM: 'chromium',
  FIREFOX: 'firefox',
  WEBKIT: 'webkit',
} as const;

// Handy UA strings if you need to spoof a specific browser. Useful when
// testing sites that behave differently based on user agent, or for
// mobile testing scenarios.
export const USER_AGENTS = {
  CHROME_WINDOWS:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  CHROME_MAC:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  FIREFOX_WINDOWS:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  SAFARI_MAC:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  MOBILE_ANDROID:
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
  MOBILE_IOS:
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
} as const;

// ── Timeouts (ms) ────────────────────────────────────────────────────
// These are sensible defaults. Bump them up if you're testing on slow CI or flaky networks.

export const TIMEOUTS = {
  DEFAULT: 30000,
  NAVIGATION: 30000,
  ACTION: 10000,
  EXPECT: 5000,
  API: 10000,
  SHORT: 3000, // quick checks
  LONG: 60000, // slow operations like file uploads
  ANIMATION: 500, // wait for CSS transitions
} as const;

// ── Retry ────────────────────────────────────────────────────────────
// For when things are flaky. BACKOFF_MULTIPLIER is there if you want exponential backoff.

export const RETRY = {
  MAX_ATTEMPTS: 3,
  DELAY_MS: 1000,
  BACKOFF_MULTIPLIER: 2,
} as const;

// ── URLs ─────────────────────────────────────────────────────────────
// All URLs live here. Override them with env vars (BASE_URL, API_BASE_URL, etc.)
// See settings.ts for how these get picked up at runtime.

export const URLS = {
  BING: 'https://www.bing.com', // Default search engine
  SAUCE_DEMO: 'https://www.saucedemo.com', // Great for e-commerce testing practice
  JSON_PLACEHOLDER: 'https://jsonplaceholder.typicode.com', // Fake REST API, always up
  REQRES: 'https://reqres.in/api', // Has auth endpoints if you need them
} as const;

export const API_BASE_URL = URLS.JSON_PLACEHOLDER;

// ── Test Credentials ─────────────────────────────────────────────────
// SauceDemo has several test users with different behaviors. These are public creds.

export const CREDENTIALS = {
  SAUCE: {
    STANDARD_USER: { username: 'standard_user', password: 'secret_sauce' },
    LOCKED_USER: { username: 'locked_out_user', password: 'secret_sauce' },
    PROBLEM_USER: { username: 'problem_user', password: 'secret_sauce' }, // buggy UI
    PERFORMANCE_USER: { username: 'performance_glitch_user', password: 'secret_sauce' }, // slow
  },
} as const;

// ── HTTP Status ──────────────────────────────────────────────────────
// Standard codes for API assertions. Saves you from magic numbers in tests.

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

// ── Viewports ────────────────────────────────────────────────────────
// Common screen sizes. DESKTOP is the default, but swap these around for responsive tests.

export const VIEWPORTS = {
  DESKTOP: { width: 1920, height: 1080 },
  LAPTOP: { width: 1366, height: 768 },
  TABLET: { width: 768, height: 1024 },
  MOBILE: { width: 375, height: 667 }, // iPhone SE
} as const;

// ── Paths ────────────────────────────────────────────────────────────

export const PATHS = {
  SCREENSHOTS: './test-results/screenshots',
  VIDEOS: './test-results/videos',
  TRACES: './test-results/traces',
  TEST_DATA: './test-data',
  REPORTS: './playwright-report',
} as const;
