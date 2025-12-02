import { test, expect } from '@playwright/test';
import { settings } from '../../src/config/settings';

/**
 * Visual Regression Tests
 * Equivalent to Python's tests/visual/test_visual_regression.py
 *
 * Uses Playwright's built-in screenshot comparison
 */

test.describe('Visual Regression Tests', () => {
  test.describe('DuckDuckGo Visual Tests', () => {
    test('homepage should match baseline', async ({ page }) => {
      await page.goto(settings().baseUrl);
      await page.waitForLoadState('networkidle');

      // Take screenshot and compare with baseline
      await expect(page).toHaveScreenshot('duckduckgo-homepage.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    });

    test('search results should match baseline', async ({ page }) => {
      await page.goto(settings().baseUrl);
      await page.fill('input[name="q"]', 'playwright');
      await page.click('button[type="submit"]');
      await page.waitForLoadState('networkidle');

      // Mask dynamic content
      await expect(page).toHaveScreenshot('duckduckgo-search-results.png', {
        maxDiffPixels: 500, // Allow more diff for dynamic content
        mask: [page.locator('[data-testid="result-extras-url-link"]')],
      });
    });
  });

  test.describe('SauceDemo Visual Tests', () => {
    test('login page should match baseline', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('saucedemo-login.png', {
        maxDiffPixels: 50,
      });
    });

    test('inventory page should match baseline', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);
      await page.fill('#user-name', 'standard_user');
      await page.fill('#password', 'secret_sauce');
      await page.click('#login-button');
      await page.waitForSelector('.inventory_container');

      await expect(page).toHaveScreenshot('saucedemo-inventory.png', {
        maxDiffPixels: 100,
      });
    });

    test('product cards should match baseline', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);
      await page.fill('#user-name', 'standard_user');
      await page.fill('#password', 'secret_sauce');
      await page.click('#login-button');
      await page.waitForSelector('.inventory_item');

      // Screenshot first product card
      const firstItem = page.locator('.inventory_item').first();
      await expect(firstItem).toHaveScreenshot('saucedemo-product-card.png');
    });

    test('cart with items should match baseline', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);
      await page.fill('#user-name', 'standard_user');
      await page.fill('#password', 'secret_sauce');
      await page.click('#login-button');

      // Add items to cart
      await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
      await page.click('button[data-test="add-to-cart-sauce-labs-bike-light"]');

      // Go to cart
      await page.click('.shopping_cart_link');
      await page.waitForSelector('.cart_list');

      await expect(page).toHaveScreenshot('saucedemo-cart.png', {
        maxDiffPixels: 50,
      });
    });
  });

  test.describe('Element Screenshots', () => {
    test('search input should match baseline', async ({ page }) => {
      await page.goto(settings().baseUrl);
      const searchInput = page.locator('input[name="q"]');

      await expect(searchInput).toHaveScreenshot('search-input.png');
    });

    test('login button should match baseline', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);
      const loginButton = page.locator('#login-button');

      await expect(loginButton).toHaveScreenshot('login-button.png');
    });
  });

  test.describe('Responsive Visual Tests', () => {
    test('mobile viewport should match baseline', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(settings().sauceDemoUrl);
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('saucedemo-mobile.png', {
        maxDiffPixels: 100,
      });
    });

    test('tablet viewport should match baseline', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(settings().sauceDemoUrl);
      await page.waitForLoadState('networkidle');

      await expect(page).toHaveScreenshot('saucedemo-tablet.png', {
        maxDiffPixels: 100,
      });
    });
  });
});
