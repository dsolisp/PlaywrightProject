import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

const SAUCE_DEMO_URL = 'https://www.saucedemo.com';

Given('I am on the login page', async ({ page }) => {
  await page.goto(SAUCE_DEMO_URL);
});

When('I enter username {string}', async ({ page }, username: string) => {
  await page.fill('#user-name', username);
});

When('I enter password {string}', async ({ page }, password: string) => {
  await page.fill('#password', password);
});

When('I click the login button', async ({ page }) => {
  await page.click('#login-button');
});

Then('I should be on the inventory page', async ({ page }) => {
  await expect(page).toHaveURL(/inventory/);
});

Then('I should see products displayed', async ({ page }) => {
  const products = page.locator('.inventory_item');
  await expect(products.first()).toBeVisible();
  const count = await products.count();
  expect(count).toBeGreaterThan(0);
});

Then(
  'I should see an error message containing {string}',
  async ({ page }, expectedText: string) => {
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(expectedText);
  },
);
