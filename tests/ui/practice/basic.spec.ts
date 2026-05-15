import { test, expect } from '@playwright/test'

test('basic test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await expect(page).toHaveTitle('Swag Labs');
  await page.getByTestId('username').fill('standard_user');
  await expect(page).toHaveTitle('Swag Labs');
  await page.getByTestId('password').fill('secret_sauce');
  await expect(page).toHaveTitle('Swag Labs');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveTitle('Swag Labs');

  //loop example
  const items = page.getByText('Add to cart');
  for (const item of await items.all()) {
    await page.getByRole('button', { name: 'Add to cart' }).first().click();
  }
  await expect(page.getByTestId('cart-button')).toHaveText('6');


});
