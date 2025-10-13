const tsPlugin = require('@typescript-eslint/eslint-plugin');
const prettierPlugin = require('eslint-plugin-prettier');
const reactPlugin = require('eslint-plugin-react');

module.exports = [
  // JS files (basic recommended)
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { window: true, document: true },
    },
    plugins: { react: reactPlugin },
    rules: {},
  },
  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        // project is optional; some config files (playwright config) are outside src
      },
      globals: { window: true, document: true },
    },
    plugins: { '@typescript-eslint': tsPlugin, prettier: prettierPlugin, react: reactPlugin },
    rules: {
      // spread recommended rules from the plugin
      ...tsPlugin.configs.recommended.rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { 'argsIgnorePattern': '^_', 'varsIgnorePattern': '^_' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
