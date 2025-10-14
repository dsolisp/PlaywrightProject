import js from '@eslint/js';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import css from '@eslint/css';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Ignore generated and report folders to avoid linting artifacts
  {
    ignores: [
      'node_modules/**',
      'coverage/**',
      '**/lcov-report/**',
      'test-results/**',
      'allure-results/**',
      'playwright-report/**',
      'docs/**',
      '*.png',
      'headless-check.png',
    ],
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser },
  },
  // TypeScript support for .ts and .tsx files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: globals.browser,
    },
    plugins: { '@typescript-eslint': tsPlugin, prettier: prettierPlugin, react: pluginReact },
    // Use recommended rules from the imported plugin
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
  pluginReact.configs.flat.recommended,
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
]);
