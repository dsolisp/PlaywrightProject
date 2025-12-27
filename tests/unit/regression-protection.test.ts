/**
 * Regression protection tests to catch breaking changes early in CI.
 */
import { describe, test, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Regression Protection Tests', () => {
  const projectRoot = path.resolve(__dirname, '../..');

  describe('Core Modules Importable', () => {
    test('config modules should be importable', async () => {
      await expect(import('../../src/config/constants')).resolves.toBeDefined();
    });

    test('utils modules should be importable', async () => {
      await expect(import('../../src/utils/data-manager')).resolves.toBeDefined();
    });

    test('pages modules should be importable', async () => {
      await expect(import('../../src/pages/base.page')).resolves.toBeDefined();
      await expect(import('../../src/pages/search-engine.page')).resolves.toBeDefined();
    });

    test('locators modules should be importable', async () => {
      await expect(import('../../src/locators/search-engine.locators')).resolves.toBeDefined();
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
    test('src directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src'))).toBe(true);
    });

    test('tests directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'tests'))).toBe(true);
    });

    test('src/pages directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src/pages'))).toBe(true);
    });

    test('src/utils directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src/utils'))).toBe(true);
    });

    test('src/config directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src/config'))).toBe(true);
    });

    test('src/locators directory should exist', () => {
      expect(fs.existsSync(path.join(projectRoot, 'src/locators'))).toBe(true);
    });
  });

  describe('Constants Validation', () => {
    test('essential constants should be defined', async () => {
      const constants = await import('../../src/config/constants');
      expect(constants.BROWSERS).toBeDefined();
      expect(constants.TIMEOUTS).toBeDefined();
      expect(constants.URLS).toBeDefined();
    });

    test('timeouts should have positive values', async () => {
      const { TIMEOUTS } = await import('../../src/config/constants');
      expect(TIMEOUTS.DEFAULT).toBeGreaterThan(0);
      expect(TIMEOUTS.NAVIGATION).toBeGreaterThan(0);
    });
  });

  describe('Data Manager Validation', () => {
    test('DataManager functions should be importable', async () => {
      const dm = await import('../../src/utils/data-manager');
      expect(dm.generateTestData).toBeDefined();
      expect(dm.clearCache).toBeDefined();
    });

    test('DataManager should have required functions', async () => {
      const dm = await import('../../src/utils/data-manager');
      expect(typeof dm.generateTestData).toBe('function');
      expect(typeof dm.clearCache).toBe('function');
    });
  });

  describe('Page Classes Validation', () => {
    test('BasePage should have required methods', async () => {
      const { BasePage } = await import('../../src/pages/base.page');
      expect(BasePage.prototype.navigateTo).toBeDefined();
      expect(BasePage.prototype.reload).toBeDefined();
    });

    test('SearchEnginePage should extend BasePage', async () => {
      const { BasePage } = await import('../../src/pages/base.page');
      const { SearchEnginePage } = await import('../../src/pages/search-engine.page');
      expect(SearchEnginePage.prototype instanceof BasePage).toBe(true);
    });
  });

  describe('Locators Validation', () => {
    test('BingLocators should have required locators', async () => {
      const locators = await import('../../src/locators/search-engine.locators');
      expect(locators.BingLocators).toBeDefined();
      expect(locators.BingLocators.SEARCH_INPUT).toBeDefined();
    });
  });
});
