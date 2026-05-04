import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { settings } from '../../../config/settings';

// GEMINI Style: Use semantic locators directly, no imported locator constants

const { Given, When, Then } = createBdd();

Given('I am on the login page', async ({ page }) => {
  await page.goto(settings().sauceDemoUrl);
});

When('I enter username {string}', async ({ page }, username: string) => {
  await page.getByPlaceholder('Username').fill(username);
});

When('I enter password {string}', async ({ page }, password: string) => {
  await page.getByPlaceholder('Password').fill(password);
});

When('I click the login button', async ({ page }) => {
  await page.getByRole('button', { name: 'Login' }).click();
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
    const errorMessage = page.getByTestId('error');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(expectedText);
  },
);
