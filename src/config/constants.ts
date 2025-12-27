// All the constants we use across tests.

// ── Browser ──────────────────────────────────────────────────────────

export const BROWSERS = {
  CHROMIUM: 'chromium',
  FIREFOX: 'firefox',
  WEBKIT: 'webkit',
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
