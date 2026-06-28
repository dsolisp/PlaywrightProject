import { test, expect } from '../../../fixtures/test.fixture';

test.use({ storageState: undefined });

/**
 * Challenge — add a product by title; changing the product name should be a one-line edit.
 * Law 3: all locators accessed via page-object methods — no raw page.* calls in specs.
 *
 * https://www.saucedemo.com/
 * Change ONLY the PRODUCT_TITLE constant to switch products without any other modification.
 */
test('basic test — add product to cart by product name', async ({ loginPage, inventoryPage }) => {
  const PRODUCT_TITLE = 'Sauce Labs Fleece Jacket'; // ← one-line change to switch product

  await loginPage.open();
  await loginPage.login('standard_user', 'secret_sauce');

  await inventoryPage.addToCartByProductName(PRODUCT_TITLE);

  await expect(inventoryPage.header.cartBadgeLocator()).toHaveText('1');
});
