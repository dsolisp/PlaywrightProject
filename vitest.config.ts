import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Vitest Configuration for Unit Tests
 * Runs unit tests and database tests (non-E2E)
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: '.',
    include: ['tests/unit/**/*.test.ts', 'tests/database/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts', 'lib/**/*.ts', 'e2e/page-objects/**/*.ts'],
      exclude: ['src/types/**', '**/*.d.ts'],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, './lib/config'),
      '@pages': path.resolve(__dirname, './e2e/page-objects'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@fixtures': path.resolve(__dirname, './e2e/fixtures'),
      '@test-data': path.resolve(__dirname, './test-data'),
    },
  },
});
