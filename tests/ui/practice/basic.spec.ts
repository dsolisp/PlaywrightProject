import { test, expect } from '@playwright/test'

test.use({ storageState: undefined });

test('basic test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await expect(page).toHaveTitle('Swag Labs');
  await page.getByTestId('username').fill('standard_user');
  await expect(page).toHaveTitle('Swag Labs');
  await page.getByTestId('password').fill('secret_sauce');
  await expect(page).toHaveTitle('Swag Labs');
  await page.getByTestId('login-button').click();
  await expect(page).toHaveTitle('Swag Labs');

  await page.getByText('Sauce Labs Fleece Jacket').nth(0).locator('../../../..').getByText('Add to cart').click()


  //loop example
  //while ((await page.getByRole('button', { name: 'Add to cart' }).count()) > 0) {
  //await page.getByRole('button', { name: 'Add to cart' }).first().click();
//}

  await expect(page.getByTestId('shopping-cart-link')).toHaveText('1');


});


/*

https://www.saucedemo.com/
Challenge
Verify that a product item is added to the shopping cart from the product list 
(Use the PRODUCT TITLE as part of your parameter or filtering)
Changes:
Change ONLY the product title from one to another (i.e. SauceLabs Backpack to SauceLabs Bike Light) in your script and execute it, should work without issues, must be a one-line change
*/