import { Page, Locator, expect } from '@playwright/test';

/**
 * Cart Page Object - GEMINI Style
 * Uses semantic locators (getByRole, getByTestId)
 */
export class CartPage {
  readonly page: Page;

  // Cart elements
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly cartBadge: Locator;

  // Buttons
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly removeButtons: Locator;

  constructor(page: Page) {
    this.page = page;

    // Cart items
    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.cartBadge = page.getByTestId('shopping-cart-badge');

    // Buttons - use getByRole for semantic access
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.removeButtons = page.getByRole('button', { name: /remove/i });
  }

  // ── Assertions ─────────────────────────────────────────────────────

  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(count);
  }

  // ── Getters ────────────────────────────────────────────────────────

  async getItemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.cartBadge.isVisible())) {
      return 0;
    }
    const text = await this.cartBadge.textContent();
    return parseInt(text ?? '0', 10) || 0;
  }

  async getItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  // ── Actions ────────────────────────────────────────────────────────

  async removeItem(index: number): Promise<void> {
    await this.removeButtons.nth(index).click();
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }
}
