import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import playwright from 'eslint-plugin-playwright';
import globals from 'globals';

export default [
  // Global ignores
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'allure-*/**',
      'test-results/**',
      'playwright-report/**',
      'coverage/**',
      'data/**',
      '.husky/**',
      'tests/bdd/.features-gen/**', // Auto-generated BDD files
    ],
  },

  // Base ESLint rules for JS files
  {
    files: ['**/*.js'],
    ...eslint.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },

  // TypeScript files
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      playwright: playwright,
    },
    rules: {
      // Disable base rule - use TypeScript version
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',

      // Playwright rules
      'playwright/no-wait-for-timeout': 'warn',
      'playwright/no-force-option': 'warn',
      'playwright/prefer-web-first-assertions': 'warn',
    },
  },

  // ── Law 3: Zero raw selectors in spec files ───────────────────────
  {
    files: ['tests/**/*.spec.ts', 'tests/**/*.test.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.object.name="page"][callee.property.name=/^(locator|getByRole|getByText|getByLabel|getByPlaceholder|getByTestId|getByAltText|getByTitle|fill|click|type)$/]',
          message: '❌ Law 3: No raw selectors in specs. Use page object methods instead.',
        },
      ],
    },
  },

  // ── Law 2: No assertions in page objects ─────────────────────────
  {
    files: ['pages/**/*.ts', 'components/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['expect'],
              message: '❌ Law 2: No assertions in pages/components. Return values; let tests assert.',
            },
          ],
        },
      ],
    },
  },

  // ── Law 2: No assertions in locator files ────────────────────────
  {
    files: ['locators/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@playwright/test',
              importNames: ['expect'],
              message: '❌ Law 2: No assertions in locators.',
            },
          ],
        },
      ],
    },
  },
];
