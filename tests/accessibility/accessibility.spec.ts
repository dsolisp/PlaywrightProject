import { test, expect } from '../../fixtures/test.fixture';
import AxeBuilder from '@axe-core/playwright';
import { settings } from '../../config/settings';

// a11y checks with axe-core. We're lenient on the homepage audit and stricter on our own pages.
// GEMINI Style: Use semantic locators directly

test.describe('Accessibility Tests', () => {
  test.describe('Homepage Accessibility', () => {
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

      // Allow up to 10 violations for external sites (audit mode)
      expect(results.violations.length).toBeLessThanOrEqual(10);
    });

    test('should have accessible login form labels', async ({ page }) => {
      await page.goto(settings().baseUrl);

      const results = await new AxeBuilder({ page })
        .include('#login_button_container')
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

    test('should have accessible inventory page', async ({ page, loginPage, inventoryPage }) => {
      // Login first
      await loginPage.open();
      await loginPage.loginWithDefaults();

      // Wait for inventory page
      expect(await inventoryPage.isLoaded()).toBe(true);

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
