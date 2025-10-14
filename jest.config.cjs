/* eslint-env node */
// Jest configuration for unit tests (ts-jest)

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Run tests under src/tests; Playwright E2E/visual tests live under src/tests/e2e and are run with Playwright.
  roots: ['<rootDir>/src/tests'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  // Ignore Playwright E2E tests (they are run with `npx playwright test`)
  testPathIgnorePatterns: ['<rootDir>/src/tests/e2e/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  passWithNoTests: true,
};
