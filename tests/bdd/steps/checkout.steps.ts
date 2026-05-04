import { createBdd, DataTable } from 'playwright-bdd';
import { expect } from '@playwright/test';

// GEMINI Style: Use semantic locators directly, no imported locator constants

const { Given, When, Then } = createBdd();

Given('I have items in my cart', async ({ page }) => {
  // Add a product to cart using semantic locator
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  const cartBadge = page.getByTestId('shopping-cart-badge');
  await expect(cartBadge).toHaveText('1');
});

When('I proceed to checkout', async ({ page }) => {
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart/);
  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page).toHaveURL(/checkout-step-one/);
});

When('I enter checkout information:', async ({ page }, dataTable: DataTable) => {
  const data = dataTable.hashes()[0];
  await page.getByPlaceholder('First Name').fill(data.firstName);
  await page.getByPlaceholder('Last Name').fill(data.lastName);
  await page.getByPlaceholder('Zip/Postal Code').fill(data.postalCode);
});

When('I continue to overview', async ({ page }) => {
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page).toHaveURL(/checkout-step-two/);
});

When('I finish the checkout', async ({ page }) => {
  await page.getByRole('button', { name: 'Finish' }).click();
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
  await page.getByRole('button', { name: 'Continue' }).click();
});

Then('I should see a checkout error message', async ({ page }) => {
  const errorMessage = page.getByTestId('error');
  await expect(errorMessage).toBeVisible();
});
