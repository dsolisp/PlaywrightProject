import type { Page } from '@playwright/test';

export class InventoryLocators {
  constructor(private readonly page: Page) {}

  get inventoryContainer() {
    return this.page.getByTestId('inventory-container');
  }
  get inventoryItems() {
    return this.page.locator('.inventory_item');
  }
  get itemNames() {
    return this.page.locator('.inventory_item_name');
  }
  get itemPrices() {
    return this.page.locator('.inventory_item_price');
  }
  get cartLink() {
    return this.page.locator('.shopping_cart_link');
  }
  get cartBadge() {
    return this.page.getByTestId('shopping-cart-badge');
  }
  get sortDropdown() {
    return this.page.getByTestId('product-sort-container');
  }

  // Dynamic locators
  get addToCartButtons() {
    return this.page.getByRole('button', { name: /add to cart/i });
  }
  get backToProductsButton() {
    return this.page.getByRole('button', { name: 'Back to products' });
  }
  get addToCartBackpackButton() {
    return this.page.getByTestId('add-to-cart-sauce-labs-backpack');
  }
  get addToCartBikeLightButton() {
    return this.page.getByTestId('add-to-cart-sauce-labs-bike-light');
  }

  /** Add-to-cart button within the inventory item whose title matches `name`. */
  addToCartButtonForProduct(name: string) {
    return this.inventoryItems
      .filter({ has: this.page.getByText(name, { exact: true }) })
      .getByRole('button', { name: /add to cart/i });
  }
}
