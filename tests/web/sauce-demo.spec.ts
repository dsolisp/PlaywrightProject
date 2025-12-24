import { test, expect } from '../../src/fixtures/test-fixtures';
import { authenticatedTest } from '../../src/fixtures/test-fixtures';
import { UserFactory, CheckoutFactory } from '../../src/utils/test-data-factory';

// SauceDemo e2e tests. Run specific tags with: npx playwright test --grep @smoke

test.describe('SauceDemo Login Tests @auth @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('should login with valid credentials @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.loginWithUser(UserFactory.valid());
    expect(await inventoryPage.isLoaded()).toBe(true);
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.loginWithUser(UserFactory.locked());

    expect(await loginPage.isErrorVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.loginWithUser(UserFactory.invalid());

    expect(await loginPage.isErrorVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('do not match');
  });

  test('should show error for empty username', async ({ loginPage }) => {
    const emptyUser = UserFactory.empty();
    await loginPage.login(emptyUser.username, 'secret_sauce');

    expect(await loginPage.isErrorVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('should show error for empty password', async ({ loginPage }) => {
    const validUser = UserFactory.valid();
    await loginPage.login(validUser.username, '');

    expect(await loginPage.isErrorVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Password is required');
  });
});

test.describe('SauceDemo Inventory Tests @cart @regression', () => {
  authenticatedTest('should display products @smoke', async ({ authenticatedPage }) => {
    const itemCount = await authenticatedPage.getItemCount();
    expect(itemCount).toBe(6);
  });

  authenticatedTest('should display product names', async ({ authenticatedPage }) => {
    const names = await authenticatedPage.getItemNames();
    expect(names.length).toBe(6);
    expect(names[0]).toBeTruthy();
  });

  authenticatedTest('should display product prices', async ({ authenticatedPage }) => {
    const prices = await authenticatedPage.getItemPrices();
    expect(prices.length).toBe(6);
    expect(prices[0]).toMatch(/\$\d+\.\d{2}/);
  });

  authenticatedTest('should add item to cart @smoke', async ({ authenticatedPage }) => {
    await authenticatedPage.addToCart(0);
    const badgeCount = await authenticatedPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });

  authenticatedTest('should add multiple items to cart', async ({ authenticatedPage }) => {
    await authenticatedPage.addToCart(0);
    await authenticatedPage.addToCart(1);
    await authenticatedPage.addToCart(2);

    const badgeCount = await authenticatedPage.getCartBadgeCount();
    expect(badgeCount).toBe(3);
  });

  authenticatedTest('should sort products by name A-Z', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('az');
    const names = await authenticatedPage.getItemNames();
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  authenticatedTest('should sort products by price low to high', async ({ authenticatedPage }) => {
    await authenticatedPage.sortBy('lohi');
    const prices = await authenticatedPage.getItemPrices();
    const numericPrices = prices.map((p) => parseFloat(p.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sortedPrices);
  });
});

test.describe('SauceDemo Checkout Flow @checkout @regression', () => {
  authenticatedTest(
    'should complete checkout @smoke',
    async ({ authenticatedPage, cartPage, checkoutPage }) => {
      // Add item
      await authenticatedPage.addToCart(0);
      await authenticatedPage.goToCart();

      // Verify cart
      const cartItems = await cartPage.getItemCount();
      expect(cartItems).toBe(1);

      // Checkout using factory data
      await cartPage.checkout();
      await checkoutPage.fillWithInfo(CheckoutFactory.valid());
      await checkoutPage.continue();
      await checkoutPage.finish();

      // Verify completion
      expect(await checkoutPage.isComplete()).toBe(true);
      const message = await checkoutPage.getCompleteMessage();
      expect(message).toContain('Thank you');
    },
  );
});
