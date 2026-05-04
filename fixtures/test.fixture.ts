import { test as base, expect } from '@playwright/test';
import {
  LoginPage,
  InventoryPage,
  CartPage,
  CheckoutPage,
  AlertsPage,
  DropdownPage,
  IframesPage,
  WindowsPage,
  SelectorsPage,
} from '../pages';
import { URLS } from '../config/constants';

// Page objects available in tests
type CustomFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  // Practice App pages
  alertsPage: AlertsPage;
  dropdownPage: DropdownPage;
  iframesPage: IframesPage;
  windowsPage: WindowsPage;
  selectorsPage: SelectorsPage;
};

// Wire up all page objects as fixtures
export const test = base.extend<CustomFixtures>({
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
  // Practice App fixtures
  alertsPage: async ({ page }, use) => {
    await use(new AlertsPage(page));
  },
  dropdownPage: async ({ page }, use) => {
    await use(new DropdownPage(page));
  },
  iframesPage: async ({ page }, use) => {
    await use(new IframesPage(page));
  },
  windowsPage: async ({ page }, use) => {
    await use(new WindowsPage(page));
  },
  selectorsPage: async ({ page }, use) => {
    await use(new SelectorsPage(page));
  },
});

export { expect };

// ═══════════════════════════════════════════════════════════════════
// Pre-authenticated fixture — uses storageState from .auth/sauce.json (ADR-009).
// The browser project already loaded the saved session; just navigate to inventory.
// ═══════════════════════════════════════════════════════════════════

type AuthenticatedFixtures = CustomFixtures & {
  authenticatedPage: InventoryPage;
};

export const authenticatedTest = test.extend<AuthenticatedFixtures>({
  authenticatedPage: async ({ page, inventoryPage }, use) => {
    // storageState is already injected by the browser project — go straight to inventory
    await page.goto(`${URLS.SAUCE_DEMO}/inventory.html`);
    await use(inventoryPage);
  },
});
