import { defineConfig } from 'vitest/config';
import path from 'path';

/**
 * Vitest Configuration for Unit Tests
 * Equivalent to Python's pytest for unit tests
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    root: '.',
    include: ['tests/unit/**/*.test.ts', 'tests/database/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'src/**', '**/src/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/types/**', '**/*.d.ts'],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, './src/config'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@locators': path.resolve(__dirname, './src/locators'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@fixtures': path.resolve(__dirname, './src/fixtures'),
      '@test-data': path.resolve(__dirname, './test-data'),
    },
  },
});
