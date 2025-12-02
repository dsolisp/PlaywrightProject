import { createBdd, DataTable } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('I have items in my cart', async ({ page }) => {
  // Add a product to cart
  await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('1');
});

When('I proceed to checkout', async ({ page }) => {
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/cart/);
  await page.click('[data-test="checkout"]');
  await expect(page).toHaveURL(/checkout-step-one/);
});

When('I enter checkout information:', async ({ page }, dataTable: DataTable) => {
  const data = dataTable.hashes()[0];
  await page.fill('[data-test="firstName"]', data.firstName);
  await page.fill('[data-test="lastName"]', data.lastName);
  await page.fill('[data-test="postalCode"]', data.postalCode);
});

When('I continue to overview', async ({ page }) => {
  await page.click('[data-test="continue"]');
  await expect(page).toHaveURL(/checkout-step-two/);
});

When('I finish the checkout', async ({ page }) => {
  await page.click('[data-test="finish"]');
  await expect(page).toHaveURL(/checkout-complete/);
});

Then('I should see the order confirmation', async ({ page }) => {
  const completeHeader = page.locator('.complete-header');
  await expect(completeHeader).toContainText('Thank you');
});

Then('I should see the order total', async ({ page }) => {
  const total = page.locator('.summary_total_label');
  await expect(total).toContainText('$');
});

When('I click continue without entering information', async ({ page }) => {
  await page.click('[data-test="continue"]');
});

Then('I should see a checkout error message', async ({ page }) => {
  const errorMessage = page.locator('[data-test="error"]');
  await expect(errorMessage).toBeVisible();
});
