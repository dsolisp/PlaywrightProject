import { createBdd, DataTable } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { HeaderComponent } from '../../../components/header.component';
import { CheckoutPage } from '../../../pages/sauce-demo/checkout.page';

const { Given, When, Then } = createBdd();

Given('I have items in my cart', async ({ page }) => {
  // Add a product to cart using semantic locator
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  const cartBadge = page.getByTestId('shopping-cart-badge');
  await expect(cartBadge).toHaveText('1');
});

When('I proceed to checkout', async ({ page }) => {
  await new HeaderComponent(page).goToCart();
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
  const checkoutPage = new CheckoutPage(page);
  await expect(checkoutPage.completeHeaderLocator()).toContainText('Thank you');
});

Then('I should see the order total', async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await expect(checkoutPage.totalLabelLocator()).toContainText('$');
});

When('I click continue without entering information', async ({ page }) => {
  await page.getByRole('button', { name: 'Continue' }).click();
});

Then('I should see a checkout error message', async ({ page }) => {
  const errorMessage = page.getByTestId('error');
  await expect(errorMessage).toBeVisible();
});
