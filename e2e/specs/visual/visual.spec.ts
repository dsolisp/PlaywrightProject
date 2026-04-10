import { test, expect } from '@playwright/test';
import { authenticatedTest } from '../../fixtures/test.fixture';
import { settings } from '../../../lib/config/settings';

// Screenshot comparison tests. Run `npx playwright test --update-snapshots` to update baselines.
// GEMINI Style: Use semantic locators directly

test.describe('Visual Regression Tests', () => {
  test.describe('Bing Visual Tests', () => {
    test('homepage should match baseline', async ({ page }) => {
      await page.goto(settings().baseUrl);
      await page.waitForLoadState('networkidle');

      // Take screenshot and compare with baseline
      await expect(page).toHaveScreenshot('bing-homepage.png', {
        maxDiffPixels: 100,
        threshold: 0.2,
      });
    });

    test('search results should match baseline', async ({ page }) => {
      await page.goto(settings().baseUrl);
      await page.locator('input[name="q"], textarea[name="q"]').fill('playwright');
      await page.keyboard.press('Enter');
      await page.waitForLoadState('networkidle');

      // Mask dynamic content (ads, personalized results)
      await expect(page).toHaveScreenshot('bing-search-results.png', {
        maxDiffPixels: 500, // Allow more diff for dynamic content
        mask: [page.locator('.b_ad'), page.locator('#b_tween')],
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
  });

  // Authenticated visual tests using fixture
  authenticatedTest.describe('SauceDemo Authenticated Visual Tests', () => {
    authenticatedTest(
      'inventory page should match baseline',
      async ({ authenticatedPage, page }) => {
        // authenticatedPage fixture handles login, we just verify we're on inventory
        await expect(authenticatedPage.isLoaded()).resolves.toBe(true);
        await expect(page.locator('.inventory_item').first()).toBeVisible();

        await expect(page).toHaveScreenshot('saucedemo-inventory.png', {
          maxDiffPixels: 100,
        });
      },
    );

    authenticatedTest(
      'product cards should match baseline',
      async ({ authenticatedPage, page }) => {
        await expect(authenticatedPage.isLoaded()).resolves.toBe(true);
        const inventoryItems = page.locator('.inventory_item');
        await expect(inventoryItems.first()).toBeVisible();

        // Screenshot first product card
        await expect(inventoryItems.first()).toHaveScreenshot('saucedemo-product-card.png');
      },
    );

    authenticatedTest(
      'cart with items should match baseline',
      async ({ authenticatedPage, page }) => {
        // Use the page object methods for interactions
        await authenticatedPage.addToCart(0);
        await authenticatedPage.addToCart(1);
        await authenticatedPage.goToCart();

        await expect(page.locator('.cart_list')).toBeVisible();

        await expect(page).toHaveScreenshot('saucedemo-cart.png', {
          maxDiffPixels: 50,
        });
      },
    );
  });

  test.describe('Element Screenshots', () => {
    test('search input should match baseline', async ({ page }) => {
      await page.goto(settings().baseUrl);
      // Bing uses #sb_form_q for search input
      const searchInput = page.locator('#sb_form_q');

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
