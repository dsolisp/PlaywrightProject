import { test, expect, authenticatedTest } from '../../../fixtures/test.fixture';
import { settings } from '../../../config/settings';

// Screenshot comparison tests. Run `npx playwright test --update-snapshots` to update baselines.
// Law 3: all locators accessed via POM methods — no raw page.locator() in specs.

test.describe('Visual Regression Testing @visual', () => {

  test.describe('Login Page — Visual States', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.open();
    });

    test('should match baseline for default login page', async ({ loginPage, page }) => {
      await expect(loginPage.loginButtonLocator()).toBeVisible();
      await expect(page).toHaveScreenshot('login-page-default-state.png');
    });

    test('should match baseline for login error state', async ({ loginPage, page }) => {
      await loginPage.loginButtonLocator().click();
      await expect(loginPage.errorMessageLocator()).toBeVisible();
      await expect(page).toHaveScreenshot('login-page-error-state.png');
    });

    test('should match baseline for login form component only', async ({ loginPage }) => {
      await expect(loginPage.loginWrapperLocator()).toHaveScreenshot('login-form-component.png');
    });
  });

  authenticatedTest.describe('Inventory Page — Full Page Capture', () => {
    authenticatedTest.beforeEach(async ({ page }) => {
      await page.goto('/inventory.html');
    });

    authenticatedTest('should match baseline for inventory page full scroll', async ({ authenticatedPage, page }) => {
      await expect(authenticatedPage.inventoryItemsLocator().first()).toBeVisible();
      await expect(page).toHaveScreenshot('inventory-page-full.png', { fullPage: true });
    });

    authenticatedTest('should match baseline ignoring cart badge (dynamic content)', async ({ page }) => {
      await expect(page).toHaveScreenshot('inventory-page-clean.png', {
        mask: [page.locator('.shopping_cart_badge')]
      });
    });
  });

  test.describe('Responsive Layout — Cross-Device', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.open();
    });

    test('should match baseline for mobile view (iPhone X)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await expect(page).toHaveScreenshot('login-page-mobile.png');
    });

    test('should match baseline for tablet view (iPad)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(page).toHaveScreenshot('login-page-tablet.png');
    });

    test('should match baseline for desktop view (1920x1080)', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(page).toHaveScreenshot('login-page-desktop.png');
    });
  });

  authenticatedTest.describe('Advanced Snapshot Comparisons', () => {
    authenticatedTest.beforeEach(async ({ page }) => {
      await page.goto('/inventory.html');
    });

    authenticatedTest('should allow minor differences with 10% threshold', async ({ page }) => {
      await expect(page).toHaveScreenshot('inventory-flexible-comparison.png', { maxDiffPixelRatio: 0.10 });
    });

    authenticatedTest('should detect even tiny differences with strict 1% threshold', async ({ page }) => {
      await expect(page).toHaveScreenshot('inventory-strict-comparison.png', { maxDiffPixelRatio: 0.01 });
    });
  });

  test.describe('Component Visual Snapshots', () => {
    test.beforeEach(async ({ loginPage }) => {
      await loginPage.open();
    });

    test('should match baseline for login button component', async ({ loginPage }) => {
      await expect(loginPage.loginButtonLocator()).toHaveScreenshot('login-button-component.png');
    });

    test('should match baseline for username input field', async ({ loginPage }) => {
      await expect(loginPage.usernameInputLocator()).toHaveScreenshot('username-input-component.png');
    });

    test('should match baseline for login logo', async ({ loginPage }) => {
      await expect(loginPage.loginLogoLocator()).toHaveScreenshot('login-logo-component.png');
    });
  });
});
