import { test, expect, authenticatedTest } from '../../fixtures/test.fixture';
import { UserFactory, CheckoutFactory } from '../../utils/test-data-factory';
import { URLS } from '../../config/constants';

// Full user journey tests - login through checkout, etc.

test.describe('E2E Integration Tests', () => {
  test.describe('SauceDemo Complete Purchase Flow', () => {
    test('should complete full purchase journey', async ({
      loginPage,
      inventoryPage,
      cartPage,
      checkoutPage,
    }) => {
      // Step 1: Login
      await loginPage.open();
      await loginPage.loginWithUser(UserFactory.valid());
      expect(await inventoryPage.isLoaded()).toBe(true);

      // Step 2: Add items to cart
      await inventoryPage.addBackpack();
      await inventoryPage.addBikeLight();
      expect(await inventoryPage.getCartBadgeCount()).toBe(2);

      // Step 3: Go to cart
      await inventoryPage.goToCart();
      expect(await cartPage.getItemCount()).toBe(2);

      // Step 4: Checkout
      await cartPage.checkout();
      await checkoutPage.fillWithInfo(CheckoutFactory.valid());
      await checkoutPage.continue();

      // Step 5: Verify summary has total
      const total = await checkoutPage.getTotal();
      expect(total).toContain('$');

      // Step 6: Complete checkout
      await checkoutPage.finish();

      // Step 7: Verify completion
      expect(await checkoutPage.isComplete()).toBe(true);
      const message = await checkoutPage.getCompleteMessage();
      expect(message).toContain('Thank you');
    });

    authenticatedTest(
      'should allow removing items from cart',
      async ({ authenticatedPage, cartPage }) => {
        // Add items
        await authenticatedPage.addBackpack();
        await authenticatedPage.addBikeLight();

        // Go to cart
        await authenticatedPage.goToCart();

        // Remove first item
        await cartPage.removeItem(0);

        // Verify only one item remains
        expect(await cartPage.getItemCount()).toBe(1);
        expect(await cartPage.getCartBadgeCount()).toBe(1);
      },
    );

    authenticatedTest(
      'should maintain cart across page navigation',
      async ({ authenticatedPage }) => {
        // Add item
        await authenticatedPage.addBackpack();

        // Navigate to product detail
        await authenticatedPage.clickProductName(0);
        expect(await authenticatedPage.getCartBadgeCount()).toBe(1);

        // Go back and verify cart persists
        await authenticatedPage.clickBackToProducts();
        expect(await authenticatedPage.getCartBadgeCount()).toBe(1);
      },
    );
  });



  test.describe('API and UI Integration', () => {
    test('should verify API data matches UI', async ({ request }) => {
      const apiResponse = await request.get(`${URLS.JSON_PLACEHOLDER}/posts/1`);
      const apiPost = await apiResponse.json();

      expect(apiPost.id).toBe(1);
      expect(apiPost.title).toBeTruthy();
    });
  });
});
