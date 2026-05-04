import type { Page } from '@playwright/test';
import { CartLocators } from '../../locators/sauce-demo/cart.locators';
import { BasePage } from '../base.page';
import { HeaderComponent } from '../../components/header.component';

/**
 * CartPage — Gold Standard.
 * Extends BasePage (1 level, Law 4). Zero assertions inside (Law 2).
 */
export class CartPage extends BasePage {
  private readonly locators: CartLocators;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new CartLocators(page);
    this.header = new HeaderComponent(page);
  }

  // ── Getters ────────────────────────────────────────────────────────

  async getItemCount(): Promise<number> {
    return this.locators.cartItems.count();
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.locators.cartBadge.isVisible())) {
      return 0;
    }
    const text = await this.locators.cartBadge.textContent();
    return parseInt(text ?? '0', 10) || 0;
  }

  async getItemNames(): Promise<string[]> {
    return this.locators.itemNames.allTextContents();
  }

  /** Expose locator so tests can call expect() on it (Law 2). */
  cartItemsLocator() {
    return this.locators.cartItems;
  }

  // ── Actions ────────────────────────────────────────────────────────

  async removeItem(index: number): Promise<void> {
    await this.locators.removeButtons.nth(index).click();
  }

  async checkout(): Promise<void> {
    await this.locators.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.locators.continueShoppingButton.click();
  }
}
