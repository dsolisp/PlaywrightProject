const fs = require('fs');
const path = require('path');

// Dynamically include only existing test roots so Jest validation doesn't fail
const possibleRoots = ['src/tests/unit', 'src/tests/api', 'src/tests/db'];
const cwd = process.cwd();
const roots = possibleRoots
  .map((p) => path.join(cwd, p))
  .filter((abs) => fs.existsSync(abs))
  .map((abs) => `<rootDir>/${path.relative(cwd, abs).replace(/\\/g, '/')}`);

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Only run unit, api, and db Jest tests. Playwright E2E/visual tests live under src/tests/e2e and are run with Playwright.
  roots: roots.length ? roots : ['<rootDir>/src/tests/unit'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  passWithNoTests: true,
};
