import { Page, Locator, expect } from '@playwright/test';

/**
 * Inventory Page Object - GEMINI Style
 * Uses semantic locators (getByRole, getByText, getByTestId)
 */
export class InventoryPage {
  readonly page: Page;

  // Container & List
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;

  // Product elements
  readonly itemNames: Locator;
  readonly itemPrices: Locator;

  // Cart
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  // Sorting
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;

    // Use getByTestId for containers (no semantic alternative)
    this.inventoryContainer = page.getByTestId('inventory-container');
    this.inventoryItems = page.locator('.inventory_item'); // No test-id available

    // Product elements
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');

    // Cart - use locator for cart link (it's an anchor with class, no accessible name)
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');

    // Sorting dropdown
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  // ── Assertions ─────────────────────────────────────────────────────

  async expectLoaded(): Promise<void> {
    await expect(this.inventoryItems.first()).toBeVisible();
  }

  // ── Getters ────────────────────────────────────────────────────────

  async isLoaded(): Promise<boolean> {
    return this.inventoryItems.first().isVisible();
  }

  async getItemCount(): Promise<number> {
    return this.inventoryItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return this.itemPrices.allTextContents();
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10) || 0;
  }

  // ── Actions ────────────────────────────────────────────────────────

  async addToCart(index: number): Promise<void> {
    // Use getByRole for buttons with dynamic names
    const addButtons = this.page.getByRole('button', { name: /add to cart/i });
    await addButtons.nth(index).click();
  }

  async addBackpack(): Promise<void> {
    await this.page
      .getByRole('button', { name: 'Add to cart', exact: false })
      .filter({
        has: this.page.locator('[data-test="add-to-cart-sauce-labs-backpack"]'),
      })
      .or(this.page.getByTestId('add-to-cart-sauce-labs-backpack'))
      .click();
  }

  async addBikeLight(): Promise<void> {
    await this.page.getByTestId('add-to-cart-sauce-labs-bike-light').click();
  }

  async clickProductName(index = 0): Promise<void> {
    await this.itemNames.nth(index).click();
  }

  async clickBackToProducts(): Promise<void> {
    await this.page.getByRole('button', { name: 'Back to products' }).click();
  }

  async addAllToCart(): Promise<void> {
    const addButtons = this.page.getByRole('button', { name: /add to cart/i });
    const count = await addButtons.count();
    for (let i = 0; i < count; i++) {
      await addButtons.nth(i).click();
    }
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }
}
