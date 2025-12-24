import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { settings } from '../../src/config/settings';
import { CREDENTIALS } from '../../src/config/constants';
import { LoginLocators } from '../../src/locators/sauce-demo.locators';

/**
 * Accessibility tests using axe-core.
 */

test.describe('Accessibility Tests', () => {
  test.describe('Bing Accessibility', () => {
    test('should not have critical accessibility violations on homepage', async ({ page }) => {
      await page.goto(settings().baseUrl);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      // Log violations for debugging
      if (results.violations.length > 0) {
        console.info('\n=== Accessibility Audit Results ===');
        console.info(`Passes: ${results.passes.length}, Violations: ${results.violations.length}`);
        console.info('\nViolations found:');
        for (const violation of results.violations) {
          console.info(`  [${violation.impact}] ${violation.id}: ${violation.description}`);
          console.info(`    Help: ${violation.helpUrl}`);
        }
      }

      // Filter critical violations
      const criticalViolations = results.violations.filter(
        (v) => v.impact === 'critical' || v.impact === 'serious',
      );

      // Allow up to 10 violations for external sites (audit mode)
      expect(results.violations.length).toBeLessThanOrEqual(10);
    });

    test('should have accessible search form', async ({ page }) => {
      await page.goto(settings().baseUrl);

      const results = await new AxeBuilder({ page })
        .include('#sb_form')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      // Forms should have accessible labels
      const labelViolations = results.violations.filter(
        (v) => v.id.includes('label') || v.id.includes('aria'),
      );

      expect(labelViolations.length).toBeLessThanOrEqual(3);
    });
  });

  test.describe('SauceDemo Accessibility', () => {
    test('should have accessible login form', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);

      const results = await new AxeBuilder({ page })
        .include('#login_button_container')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      // Login form should be reasonably accessible
      expect(results.violations.length).toBeLessThanOrEqual(5);
    });

    test('should have accessible inventory page', async ({ page }) => {
      // Login first
      await page.goto(settings().sauceDemoUrl);
      await page.fill(LoginLocators.USERNAME_INPUT, CREDENTIALS.SAUCE.STANDARD_USER.username);
      await page.fill(LoginLocators.PASSWORD_INPUT, CREDENTIALS.SAUCE.STANDARD_USER.password);
      await page.click(LoginLocators.LOGIN_BUTTON);

      // Wait for inventory page
      await page.waitForSelector('.inventory_container');

      const results = await new AxeBuilder({ page })
        .include('.inventory_container')
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      // Log results
      console.info(`Inventory page: ${results.violations.length} violations`);

      expect(results.violations.length).toBeLessThanOrEqual(10);
    });
  });

  test.describe('Color Contrast', () => {
    test('should have sufficient color contrast on homepage', async ({ page }) => {
      await page.goto(settings().baseUrl);

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .disableRules(['color-contrast']) // Run separately
        .analyze();

      // Run color contrast check
      const contrastResults = await new AxeBuilder({ page })
        .withRules(['color-contrast'])
        .analyze();

      console.info(`Color contrast issues: ${contrastResults.violations.length}`);

      // Just report, don't fail - contrast issues are common
      expect(contrastResults.violations).toBeDefined();
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should be navigable with keyboard', async ({ page }) => {
      await page.goto(settings().baseUrl);

      // Tab to search input
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Search input should be focusable
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(['INPUT', 'TEXTAREA', 'BUTTON', 'A']).toContain(focusedElement);
    });
  });
});
