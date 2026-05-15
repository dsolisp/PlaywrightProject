// All the constants we use across tests.
// NOTE: Credentials / factories live in utils/test-data-factory.ts (UserFactory, etc.)

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

export const URLS = {
  SAUCE_DEMO: 'https://www.saucedemo.com',
  JSON_PLACEHOLDER: 'https://jsonplaceholder.typicode.com',
  SWAPI: 'https://swapi.dev/api',
  REQRES: 'https://reqres.in/api',
  PRACTICE_APP: process.env.PRACTICE_BASE_URL ?? 'http://localhost:8080',
} as const;

export const API_BASE_URL = URLS.JSON_PLACEHOLDER;

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

// ── Viewports ────────────────────────────────────────────────────────

export const VIEWPORTS = {
  DESKTOP: { width: 1920, height: 1080 },
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
  DB: 'app.db',
} as const;
