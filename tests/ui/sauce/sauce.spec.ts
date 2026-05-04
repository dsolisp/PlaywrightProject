import { test, expect, authenticatedTest } from '../../../fixtures/test.fixture';
import { UserBuilder } from '../../../utils/builders/user.builder';
import { CheckoutBuilder } from '../../../utils/builders/checkout.builder';

// SauceDemo e2e tests. Run specific tags with: npx playwright test --grep @smoke

test.describe('SauceDemo Login Tests @auth @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('should login with valid credentials @smoke', async ({ loginPage, inventoryPage }) => {
    await loginPage.loginWithUser(new UserBuilder().standard().build());
    expect(await inventoryPage.isLoaded()).toBe(true);
  });

  test('should show error for locked out user', async ({ loginPage }) => {
    await loginPage.loginWithUser(new UserBuilder().locked().build());

    expect(await loginPage.isErrorVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });

  test('should show error for invalid credentials', async ({ loginPage }) => {
    await loginPage.loginWithUser(new UserBuilder().invalid().build());

    expect(await loginPage.isErrorVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('do not match');
  });

  test('should show error for empty username', async ({ loginPage }) => {
    await loginPage.login('', 'secret_sauce');

    expect(await loginPage.isErrorVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username is required');
  });

  test('should show error for empty password', async ({ loginPage }) => {
    const user = new UserBuilder().standard().build();
    await loginPage.login(user.username, '');

    expect(await loginPage.isErrorVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Password is required');
  });
});

test.describe('SauceDemo Inventory Tests @cart @regression', () => {
  authenticatedTest('should display 6 products @smoke', async ({ authenticatedPage }) => {
    const itemCount = await authenticatedPage.getItemCount();
    expect(itemCount).toBe(6);
  });

  authenticatedTest('should display product names', async ({ authenticatedPage }) => {
    const names = await authenticatedPage.getItemNames();
    expect(names.length).toBe(6);
    expect(names[0]).toBeTruthy();
  });

  authenticatedTest('should add item to cart and update badge @smoke', async ({ authenticatedPage }) => {
    await authenticatedPage.addToCart(0);
    const badgeCount = await authenticatedPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });

  authenticatedTest('should add multiple items to cart', async ({ authenticatedPage }) => {
    await authenticatedPage.addToCart(0);
    await authenticatedPage.addToCart(1);

    const badgeCount = await authenticatedPage.getCartBadgeCount();
    expect(badgeCount).toBe(2);
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
    const numericPrices = prices.map((p: string) => parseFloat(p.replace('$', '')));
    const sortedPrices = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sortedPrices);
  });
});

test.describe('SauceDemo Checkout Flow @checkout @regression', () => {
  authenticatedTest(
    'should complete full checkout flow',
    async ({ authenticatedPage, cartPage, checkoutPage }) => {
      // Add item
      await authenticatedPage.addToCart(0);
      await authenticatedPage.goToCart();

      // Verify cart
      const cartItems = await cartPage.getItemCount();
      expect(cartItems).toBe(1);

      // Checkout using factory data
      await cartPage.checkout();
      await checkoutPage.fillWithInfo(new CheckoutBuilder().valid().build());
      await checkoutPage.continue();
      await checkoutPage.finish();

      // Verify completion
      expect(await checkoutPage.isComplete()).toBe(true);
      const message = await checkoutPage.getCompleteMessage();
      expect(message).toContain('Thank you');
    },
  );

  authenticatedTest(
    'should allow removing item from cart',
    async ({ authenticatedPage, cartPage }) => {
      // Add item and go to cart
      await authenticatedPage.addToCart(0);
      await authenticatedPage.goToCart();

      // Verify cart has 1 item
      let cartItems = await cartPage.getItemCount();
      expect(cartItems).toBe(1);

      // Remove item
      await cartPage.removeItem(0);

      // Verify cart is empty
      cartItems = await cartPage.getItemCount();
      expect(cartItems).toBe(0);
    },
  );
});
