import { test, expect } from '@playwright/test';
import { settings } from '../../../lib/config/settings';
import { generateTestData } from '../../../lib/utils/test-data-factory';
import {
  LoginLocators,
  InventoryLocators,
  CartLocators,
  CheckoutLocators,
} from '../../page-objects/sauce-demo';

// Make sure all the framework pieces (settings, locators, data factories) play nice together

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

      // Use generated data in a form
      await page.goto(settings().sauceDemoUrl);
      await page.fill(LoginLocators.USERNAME_INPUT, 'standard_user');
      await page.fill(LoginLocators.PASSWORD_INPUT, 'secret_sauce');
      await page.click(LoginLocators.LOGIN_BUTTON);

      // Navigate to checkout
      await page.click(InventoryLocators.ADD_BACKPACK_BUTTON);
      await page.click(InventoryLocators.CART_LINK);
      await page.click(CartLocators.CHECKOUT_BUTTON);

      // Use generated data in checkout form
      await page.fill(CheckoutLocators.FIRST_NAME, userData.firstName);
      await page.fill(CheckoutLocators.LAST_NAME, userData.lastName);
      await page.fill(CheckoutLocators.POSTAL_CODE, userData.zipCode);

      await page.click(CheckoutLocators.CONTINUE_BUTTON);
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

  test.describe('Locators Integration', () => {
    test('should use centralized locators for login flow', async ({ page }) => {
      await page.goto(settings().sauceDemoUrl);

      // Use centralized locators
      await page.fill(LoginLocators.USERNAME_INPUT, 'standard_user');
      await page.fill(LoginLocators.PASSWORD_INPUT, 'secret_sauce');
      await page.click(LoginLocators.LOGIN_BUTTON);

      await expect(page.locator(InventoryLocators.INVENTORY_CONTAINER)).toBeVisible();
    });
  });
});
