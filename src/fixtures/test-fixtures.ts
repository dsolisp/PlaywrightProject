import { test as base, expect } from '@playwright/test';
import { SearchEnginePage } from '../pages/search-engine.page';
import { LoginPage, InventoryPage, CartPage, CheckoutPage } from '../pages/sauce-demo.page';

// Page objects we make available in tests
type CustomFixtures = {
  searchPage: SearchEnginePage;
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
};

// Wire up all our page objects as fixtures
export const test = base.extend<CustomFixtures>({
  searchPage: async ({ page }, use) => {
    await use(new SearchEnginePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
});

export { expect };

// ═══════════════════════════════════════════════════════════════════
// Pre-authenticated fixture - skips the login step
// Use this when you don't care about testing login, just need to be logged in
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
