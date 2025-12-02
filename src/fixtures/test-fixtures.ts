import { test as base, expect } from '@playwright/test';
import { SearchEnginePage } from '../pages/search-engine.page';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages/sauce-demo.page';

/**
 * Custom Test Fixtures
 * Equivalent to Python's conftest.py fixtures
 */

// Define custom fixtures type
type CustomFixtures = {
  searchPage: SearchEnginePage;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

// Extend base test with custom fixtures
export const test = base.extend<CustomFixtures>({
  // Search engine page fixture
  searchPage: async ({ page }, use) => {
    const searchPage = new SearchEnginePage(page);
    await use(searchPage);
  },

  // SauceDemo fixtures
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },
});

// Re-export expect
export { expect };

// ═══════════════════════════════════════════════════════════════════
// AUTHENTICATED FIXTURES
// ═══════════════════════════════════════════════════════════════════

type AuthenticatedFixtures = CustomFixtures & {
  authenticatedPage: InventoryPage;
};

export const authenticatedTest = test.extend<AuthenticatedFixtures>({
  authenticatedPage: async ({ loginPage, inventoryPage }, use) => {
    await loginPage.open();
    await loginPage.loginWithDefaults();
    await use(inventoryPage);
  },
});
