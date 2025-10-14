module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Only run unit, api, and db Jest tests. Playwright E2E/visual tests live under src/tests/e2e and are run with Playwright.
  roots: ['<rootDir>/src/tests/unit', '<rootDir>/src/tests/api', '<rootDir>/src/tests/db'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  passWithNoTests: true,
};
