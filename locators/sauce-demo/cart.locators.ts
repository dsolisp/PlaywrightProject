import type { Page } from '@playwright/test';

export class CartLocators {
  constructor(private readonly page: Page) {}

  get cartItems() {
    return this.page.locator('.cart_item');
  }
  get itemNames() {
    return this.page.locator('.inventory_item_name');
  }
  get cartBadge() {
    return this.page.getByTestId('shopping-cart-badge');
  }
  get checkoutButton() {
    return this.page.getByRole('button', { name: 'Checkout' });
  }
  get continueShoppingButton() {
    return this.page.getByRole('button', { name: 'Continue Shopping' });
  }
  get removeButtons() {
    return this.page.getByRole('button', { name: /remove/i });
  }
}
