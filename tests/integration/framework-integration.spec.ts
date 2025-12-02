import { test, expect } from '@playwright/test';
import { settings } from '../../src/config/settings';
import { ErrorClassifier, ErrorCategory, ErrorSeverity } from '../../src/utils/error-classifier';
import { PerformanceMonitor } from '../../src/utils/performance-monitor';
import { generateTestData, clearCache } from '../../src/utils/data-manager';

/**
 * Framework Integration Tests
 * Tests that framework components work together correctly
 * Equivalent to Python's tests/integration/test_framework_core.py
 */

test.describe('Framework Integration Tests', () => {
  test.describe('Error Classifier Integration', () => {
    test('should classify timeout errors correctly', async ({ page }) => {
      const classifier = new ErrorClassifier();

      // Simulate a timeout error
      const timeoutError = new Error('Timeout 30000ms exceeded');
      const classification = classifier.classify(timeoutError);

      expect(classification.category).toBe(ErrorCategory.TIMEOUT);
      expect(classification.severity).toBe(ErrorSeverity.HIGH);
      expect(classification.retryable).toBe(true);
    });

    test('should classify element not found errors', async ({ page }) => {
      const classifier = new ErrorClassifier();

      const elementError = new Error('Element not found: #nonexistent');
      const classification = classifier.classify(elementError);

      expect(classification.category).toBe(ErrorCategory.ELEMENT);
      expect(classification.severity).toBe(ErrorSeverity.MEDIUM);
    });

    test('should classify network errors', async ({ page }) => {
      const classifier = new ErrorClassifier();

      const networkError = new Error('net::ERR_CONNECTION_REFUSED');
      const classification = classifier.classify(networkError);

      expect(classification.category).toBe(ErrorCategory.NETWORK);
      expect(classification.retryable).toBe(true);
    });
  });

  test.describe('Performance Monitor Integration', () => {
    test('should track page load performance', async ({ page }) => {
      const monitor = new PerformanceMonitor();

      monitor.start('page_load');
      await page.goto(settings().sauceDemoUrl);
      const duration = monitor.stop('page_load');

      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThan(30000); // Should load within 30s
    });

    test('should track multiple operations', async ({ page }) => {
      const monitor = new PerformanceMonitor();

      monitor.start('login_flow');
      await page.goto(settings().sauceDemoUrl);

      monitor.start('fill_credentials');
      await page.fill('#user-name', 'standard_user');
      await page.fill('#password', 'secret_sauce');
      const fillDuration = monitor.stop('fill_credentials');

      await page.click('#login-button');
      await page.waitForURL(/inventory/);
      const totalDuration = monitor.stop('login_flow');

      expect(fillDuration).toBeGreaterThan(0);
      expect(totalDuration).toBeGreaterThan(fillDuration);
    });

    test('should get all metrics', async ({ page }) => {
      const monitor = new PerformanceMonitor();

      monitor.start('op1');
      await page.waitForTimeout(50);
      monitor.stop('op1');

      monitor.start('op2');
      await page.waitForTimeout(50);
      monitor.stop('op2');

      const metrics = monitor.getMetrics();
      expect(Object.keys(metrics).length).toBe(2);
      expect(metrics['op1']).toBeGreaterThan(0);
      expect(metrics['op2']).toBeGreaterThan(0);
    });
  });

  test.describe('Data Manager Integration', () => {
    test('should generate and use test data', async ({ page }) => {
      clearCache();

      const userData = generateTestData('user');

      expect(userData.email).toContain('@');
      expect(userData.firstName).toBeTruthy();
      expect(userData.lastName).toBeTruthy();

      // Use generated data in a form
      await page.goto(settings().sauceDemoUrl);
      await page.fill('#user-name', 'standard_user');
      await page.fill('#password', 'secret_sauce');
      await page.click('#login-button');

      // Navigate to checkout
      await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
      await page.click('.shopping_cart_link');
      await page.click('[data-test="checkout"]');

      // Use generated data
      await page.fill('[data-test="firstName"]', userData.firstName);
      await page.fill('[data-test="lastName"]', userData.lastName);
      await page.fill('[data-test="postalCode"]', '12345');

      await page.click('[data-test="continue"]');
      await expect(page).toHaveURL(/checkout-step-two/);
    });
  });

  test.describe('Settings Integration', () => {
    test('should load settings correctly', () => {
      const config = settings();

      expect(config.baseUrl).toBeTruthy();
      expect(config.sauceDemoUrl).toBeTruthy();
      expect(config.timeout).toBeGreaterThan(0);
    });

    test('should use settings in page navigation', async ({ page }) => {
      const config = settings();

      await page.goto(config.sauceDemoUrl);
      await expect(page).toHaveURL(config.sauceDemoUrl);
    });
  });

  test.describe('Combined Framework Flow', () => {
    test('should use all framework components together', async ({ page }) => {
      const monitor = new PerformanceMonitor();
      const classifier = new ErrorClassifier();
      const config = settings();

      // Start monitoring
      monitor.start('full_flow');

      try {
        // Navigate
        monitor.start('navigation');
        await page.goto(config.sauceDemoUrl);
        monitor.stop('navigation');

        // Login
        monitor.start('login');
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.waitForURL(/inventory/);
        monitor.stop('login');

        // Verify
        await expect(page.locator('.inventory_container')).toBeVisible();
      } catch (error) {
        // Classify any errors
        const classification = classifier.classify(error as Error);
        console.error(`Error classified as: ${classification.category}`);
        throw error;
      } finally {
        monitor.stop('full_flow');
        const metrics = monitor.getMetrics();
        console.log('Performance metrics:', metrics);
      }
    });
  });
});
