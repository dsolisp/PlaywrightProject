import { createBdd, DataTable } from 'playwright-bdd';
import { expect } from '@playwright/test';
import {
  InventoryLocators,
  CartLocators,
  CheckoutLocators,
} from '../../../e2e/page-objects/sauce-demo';

const { Given, When, Then } = createBdd();

Given('I have items in my cart', async ({ page }) => {
  // Add a product to cart
  await page.click(InventoryLocators.ADD_BACKPACK_BUTTON);
  const cartBadge = page.locator(InventoryLocators.CART_BADGE);
  await expect(cartBadge).toHaveText('1');
});

When('I proceed to checkout', async ({ page }) => {
  await page.click(InventoryLocators.CART_LINK);
  await expect(page).toHaveURL(/cart/);
  await page.click(CartLocators.CHECKOUT_BUTTON);
  await expect(page).toHaveURL(/checkout-step-one/);
});

When('I enter checkout information:', async ({ page }, dataTable: DataTable) => {
  const data = dataTable.hashes()[0];
  await page.fill(CheckoutLocators.FIRST_NAME, data.firstName);
  await page.fill(CheckoutLocators.LAST_NAME, data.lastName);
  await page.fill(CheckoutLocators.POSTAL_CODE, data.postalCode);
});

When('I continue to overview', async ({ page }) => {
  await page.click(CheckoutLocators.CONTINUE_BUTTON);
  await expect(page).toHaveURL(/checkout-step-two/);
});

When('I finish the checkout', async ({ page }) => {
  await page.click(CheckoutLocators.FINISH_BUTTON);
  await expect(page).toHaveURL(/checkout-complete/);
});

Then('I should see the order confirmation', async ({ page }) => {
  const completeHeader = page.locator(CheckoutLocators.COMPLETE_HEADER);
  await expect(completeHeader).toContainText('Thank you');
});

Then('I should see the order total', async ({ page }) => {
  const total = page.locator(CheckoutLocators.TOTAL);
  await expect(total).toContainText('$');
});

When('I click continue without entering information', async ({ page }) => {
  await page.click(CheckoutLocators.CONTINUE_BUTTON);
});

Then('I should see a checkout error message', async ({ page }) => {
  const errorMessage = page.locator(CheckoutLocators.ERROR_MESSAGE);
  await expect(errorMessage).toBeVisible();
});
