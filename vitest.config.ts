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
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'tests/bdd/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: [
        'config/**/*.ts',
        'pages/**/*.ts',
        'locators/**/*.ts',
        'utils/**/*.ts',
        'fixtures/**/*.ts',
      ],
      exclude: ['**/*.d.ts'],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, './config'),
      '@pages': path.resolve(__dirname, './pages'),
      '@utils': path.resolve(__dirname, './utils'),
      '@fixtures': path.resolve(__dirname, './fixtures'),
      '@test-data': path.resolve(__dirname, './test-data'),
    },
  },
});
