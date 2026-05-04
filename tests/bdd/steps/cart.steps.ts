import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { settings } from '../../../config/settings';

// GEMINI Style: Use semantic locators directly, no imported locator constants

const { Given, When, Then } = createBdd();

// Product name to data-test attribute mapping (for getByTestId)
const productDataTestMap: Record<string, string> = {
  'Sauce Labs Backpack': 'sauce-labs-backpack',
  'Sauce Labs Bike Light': 'sauce-labs-bike-light',
  'Sauce Labs Bolt T-Shirt': 'sauce-labs-bolt-t-shirt',
  'Sauce Labs Fleece Jacket': 'sauce-labs-fleece-jacket',
  'Sauce Labs Onesie': 'sauce-labs-onesie',
  'Test.allTheThings() T-Shirt': 'test.allthethings()-t-shirt',
};

Given('I am logged in as {string}', async ({ page }, username: string) => {
  await page.goto(settings().sauceDemoUrl);
  await page.getByPlaceholder('Username').fill(username);
  await page.getByPlaceholder('Password').fill(settings().saucePassword);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL(/inventory/);
});

When('I add {string} to the cart', async ({ page }, productName: string) => {
  const dataTest = productDataTestMap[productName] || productName.toLowerCase().replace(/ /g, '-');
  await page.getByTestId(`add-to-cart-${dataTest}`).click();
});

Then('the cart badge should show {string}', async ({ page }, count: string) => {
  const cartBadge = page.getByTestId('shopping-cart-badge');
  await expect(cartBadge).toHaveText(count);
});

Given('I have added {string} to the cart', async ({ page }, productName: string) => {
  const dataTest = productDataTestMap[productName] || productName.toLowerCase().replace(/ /g, '-');
  await page.getByTestId(`add-to-cart-${dataTest}`).click();
});

When('I remove {string} from the cart', async ({ page }, productName: string) => {
  const dataTest = productDataTestMap[productName] || productName.toLowerCase().replace(/ /g, '-');
  await page.getByTestId(`remove-${dataTest}`).click();
});

Then('the cart should be empty', async ({ page }) => {
  const cartBadge = page.getByTestId('shopping-cart-badge');
  await expect(cartBadge).not.toBeVisible();
});

When('I go to the cart', async ({ page }) => {
  await page.locator('.shopping_cart_link').click();
  await expect(page).toHaveURL(/cart/);
});

Then('I should see {string} in the cart', async ({ page }, productName: string) => {
  const cartItem = page.locator('.cart_item .inventory_item_name', {
    hasText: productName,
  });
  await expect(cartItem).toBeVisible();
});
