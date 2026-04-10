import { test, expect } from '@playwright/test';
import { settings } from '../../../lib/config/settings';
import { generateTestData } from '../../../lib/utils/test-data-factory';

// Make sure all the framework pieces (settings, data factories) play nice together
// GEMINI Style: Use semantic locators directly, no imported locator constants

test.describe('Framework Integration Tests', () => {
  test.describe('Data Factory Integration', () => {
    test('should generate and use test data with factory pattern', async ({ page }) => {
      // Use factory pattern to generate data
      const testData = generateTestData();
      const userData = {
        firstName: testData.firstName(),
        lastName: testData.lastName(),
        email: testData.email(),
        zipCode: testData.zipCode(),
      };

      expect(userData.email).toContain('@');
      expect(userData.firstName).toBeTruthy();
      expect(userData.lastName).toBeTruthy();

      // Use generated data in a form - GEMINI style semantic locators
      await page.goto(settings().sauceDemoUrl);
      await page.getByPlaceholder('Username').fill('standard_user');
      await page.getByPlaceholder('Password').fill('secret_sauce');
      await page.getByRole('button', { name: 'Login' }).click();

      // Navigate to checkout - GEMINI style
      await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
      await page.locator('.shopping_cart_link').click();
      await page.getByRole('button', { name: 'Checkout' }).click();

      // Use generated data in checkout form
      await page.getByPlaceholder('First Name').fill(userData.firstName);
      await page.getByPlaceholder('Last Name').fill(userData.lastName);
      await page.getByPlaceholder('Zip/Postal Code').fill(userData.zipCode);

      await page.getByRole('button', { name: 'Continue' }).click();
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    test('should generate unique data on each call', async () => {
      const testData = generateTestData();

      const email1 = testData.email();
      // Wait 1ms to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 1));
      const email2 = testData.email();

      // Each call should generate a unique value (uses Date.now())
      expect(email1).not.toBe(email2);
    });

    test('should generate valid UUID', async () => {
      const testData = generateTestData();
      const uuid = testData.uuid();

      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(uuid).toMatch(uuidRegex);
    });
  });

  test.describe('Settings Integration', () => {
    test('should load settings correctly', () => {
      const config = settings();

      expect(config.baseUrl).toBeTruthy();
      expect(config.sauceDemoUrl).toBeTruthy();
      expect(config.defaultTimeout).toBeGreaterThan(0);
    });

    test('should use settings in page navigation', async ({ page }) => {
      const config = settings();

      await page.goto(config.sauceDemoUrl);
      await expect(page).toHaveURL(config.sauceDemoUrl);
    });
  });

  test.describe('Semantic Locators Integration', () => {
    test('should use semantic locators for login flow', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);

      // GEMINI style - use semantic locators
      await page.getByPlaceholder('Username').fill('standard_user');
      await page.getByPlaceholder('Password').fill('secret_sauce');
      await page.getByRole('button', { name: 'Login' }).click();

      // Verify inventory is visible
      await expect(page.locator('.inventory_item').first()).toBeVisible();
    });
  });
});
