import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { settings } from '../../../lib/config/settings';
import { LoginLocators, InventoryLocators } from '../../../e2e/page-objects/sauce-demo';

const { Given, When, Then } = createBdd();

Given('I am on the login page', async ({ page }) => {
  await page.goto(settings().sauceDemoUrl);
});

When('I enter username {string}', async ({ page }, username: string) => {
  await page.fill(LoginLocators.USERNAME_INPUT, username);
});

When('I enter password {string}', async ({ page }, password: string) => {
  await page.fill(LoginLocators.PASSWORD_INPUT, password);
});

When('I click the login button', async ({ page }) => {
  await page.click(LoginLocators.LOGIN_BUTTON);
});

Then('I should be on the inventory page', async ({ page }) => {
  await expect(page).toHaveURL(/inventory/);
});

Then('I should see products displayed', async ({ page }) => {
  const products = page.locator(InventoryLocators.INVENTORY_ITEMS);
  await expect(products.first()).toBeVisible();
  const count = await products.count();
  expect(count).toBeGreaterThan(0);
});

Then(
  'I should see an error message containing {string}',
  async ({ page }, expectedText: string) => {
    const errorMessage = page.locator(LoginLocators.ERROR_MESSAGE);
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(expectedText);
  },
);
