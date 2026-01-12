import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { settings } from '../../../lib/config/settings';
import {
  LoginLocators,
  InventoryLocators,
  CartLocators,
} from '../../../e2e/page-objects/sauce-demo';

const { Given, When, Then } = createBdd();

// Product name to data-test attribute mapping
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
  await page.fill(LoginLocators.USERNAME_INPUT, username);
  await page.fill(LoginLocators.PASSWORD_INPUT, settings().saucePassword);
  await page.click(LoginLocators.LOGIN_BUTTON);
  await expect(page).toHaveURL(/inventory/);
});

When('I add {string} to the cart', async ({ page }, productName: string) => {
  const dataTest = productDataTestMap[productName] || productName.toLowerCase().replace(/ /g, '-');
  await page.click(`button[data-test="add-to-cart-${dataTest}"]`);
});

Then('the cart badge should show {string}', async ({ page }, count: string) => {
  const cartBadge = page.locator(InventoryLocators.CART_BADGE);
  await expect(cartBadge).toHaveText(count);
});

Given('I have added {string} to the cart', async ({ page }, productName: string) => {
  const dataTest = productDataTestMap[productName] || productName.toLowerCase().replace(/ /g, '-');
  await page.click(`button[data-test="add-to-cart-${dataTest}"]`);
});

When('I remove {string} from the cart', async ({ page }, productName: string) => {
  const dataTest = productDataTestMap[productName] || productName.toLowerCase().replace(/ /g, '-');
  await page.click(`button[data-test="remove-${dataTest}"]`);
});

Then('the cart should be empty', async ({ page }) => {
  const cartBadge = page.locator(InventoryLocators.CART_BADGE);
  await expect(cartBadge).not.toBeVisible();
});

When('I go to the cart', async ({ page }) => {
  await page.click(InventoryLocators.CART_LINK);
  await expect(page).toHaveURL(/cart/);
});

Then('I should see {string} in the cart', async ({ page }, productName: string) => {
  const cartItem = page.locator(`${CartLocators.CART_ITEMS} ${CartLocators.ITEM_NAME}`, {
    hasText: productName,
  });
  await expect(cartItem).toBeVisible();
});
