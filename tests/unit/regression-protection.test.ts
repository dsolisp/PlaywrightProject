/**
 * Regression protection tests to catch breaking changes early in CI.
 * Updated for new project structure with e2e/ and lib/ directories.
 */
import { describe, test, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Regression Protection Tests', () => {
  const projectRoot = path.resolve(__dirname, '../..');

  describe('Core Modules Importable', () => {
    test('config modules should be importable', async () => {
      await expect(import('../../lib/config/constants')).resolves.toBeDefined();
    });

    test('utils modules should be importable', async () => {
      await expect(import('../../lib/utils/test-data-factory')).resolves.toBeDefined();
    });

    test('page objects should be importable', async () => {
      await expect(import('../../e2e/page-objects/base.page')).resolves.toBeDefined();
      await expect(
        import('../../e2e/page-objects/search-engine/search.page'),
      ).resolves.toBeDefined();
    });

    test('locators should be importable', async () => {
      await expect(
        import('../../e2e/page-objects/search-engine/search.locators'),
      ).resolves.toBeDefined();
    });
  });

  describe('Essential Files Exist', () => {
    test('package.json should exist', () => {
      const packagePath = path.join(projectRoot, 'package.json');
      expect(fs.existsSync(packagePath)).toBe(true);
    });

    test('package.json should contain playwright dependency', () => {
      const packagePath = path.join(projectRoot, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
      const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      expect(allDeps['@playwright/test']).toBeDefined();
    });

    test('playwright.config.ts should exist', () => {
      const configPath = path.join(projectRoot, 'playwright.config.ts');
      expect(fs.existsSync(configPath)).toBe(true);
    });

    test('tsconfig.json should exist', () => {
      const tsconfigPath = path.join(projectRoot, 'tsconfig.json');
      expect(fs.existsSync(tsconfigPath)).toBe(true);
    });
  });

  describe('Directory Structure', () => {
    test('e2e directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'e2e'))).toBe(true);
    });

    test('tests directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'tests'))).toBe(true);
    });

    test('e2e/page-objects directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'e2e/page-objects'))).toBe(true);
    });

    test('src/utils directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src/utils'))).toBe(true);
    });

    test('lib/config directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'lib/config'))).toBe(true);
    });

    test('e2e/fixtures directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'e2e/fixtures'))).toBe(true);
    });
  });

  describe('Constants Validation', () => {
    test('essential constants should be defined', async () => {
      const constants = await import('../../lib/config/constants');
      expect(constants.TIMEOUTS).toBeDefined();
      expect(constants.URLS).toBeDefined();
      expect(constants.HTTP_STATUS).toBeDefined();
    });

    test('timeouts should have positive values', async () => {
      const { TIMEOUTS } = await import('../../lib/config/constants');
      expect(TIMEOUTS.DEFAULT).toBeGreaterThan(0);
      expect(TIMEOUTS.NAVIGATION).toBeGreaterThan(0);
    });
  });

  describe('Test Data Factory Validation', () => {
    test('Factory functions should be importable', async () => {
      const factory = await import('../../lib/utils/test-data-factory');
      expect(factory.generateTestData).toBeDefined();
      expect(factory.UserFactory).toBeDefined();
      expect(factory.CheckoutFactory).toBeDefined();
    });

    test('generateTestData should return required generators', async () => {
      const { generateTestData } = await import('../../lib/utils/test-data-factory');
      const gen = generateTestData();
      expect(typeof gen.email).toBe('function');
      expect(typeof gen.username).toBe('function');
    });
  });

  describe('Page Classes Validation', () => {
    test('BasePage should have required methods', async () => {
      const { BasePage } = await import('../../e2e/page-objects/base.page');
      expect(BasePage.prototype.navigateTo).toBeDefined();
      expect(BasePage.prototype.reload).toBeDefined();
    });

    test('SearchEnginePage should extend BasePage', async () => {
      const { BasePage } = await import('../../e2e/page-objects/base.page');
      const { SearchEnginePage } = await import('../../e2e/page-objects/search-engine/search.page');
      expect(SearchEnginePage.prototype instanceof BasePage).toBe(true);
    });
  });

  describe('Locators Validation', () => {
    test('SearchLocators should have required locators', async () => {
      const locators = await import('../../e2e/page-objects/search-engine/search.locators');
      expect(locators.SearchLocators).toBeDefined();
      expect(locators.SearchLocators.SEARCH_INPUT).toBeDefined();
    });
  });
});
