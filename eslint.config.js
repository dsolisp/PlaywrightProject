import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import playwright from 'eslint-plugin-playwright';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'playwright-report/**',
      'test-results/**',
      'allure-results/**',
      'allure-report/**',
      '*.config.js',
      '*.config.cjs',
      'scripts/**',
      'k6/**',
    ],
  },
  // Base config for all TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      parser: tsparser,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  // Playwright-specific rules only for .spec.ts files (not .test.ts which use Vitest/Jest)
  {
    files: ['**/*.spec.ts'],
    plugins: {
      playwright: playwright,
    },
    settings: {
      playwright: {
        additionalAssertFunctionNames: ['authenticatedTest'],
      },
    },
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Downgrade some Playwright rules to warnings for this project
      'playwright/no-networkidle': 'warn',
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-wait-for-selector': 'warn',
      'playwright/no-conditional-in-test': 'warn',
      'playwright/no-conditional-expect': 'warn',
      'playwright/no-standalone-expect': 'off', // Custom fixtures are used
    },
  },
  // BDD step files - disable standalone expect rule (expected in step definitions)
  {
    files: ['**/steps/*.ts'],
    plugins: {
      playwright: playwright,
    },
    rules: {
      'playwright/no-standalone-expect': 'off',
    },
  },
];
