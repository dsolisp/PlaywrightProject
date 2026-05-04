import type { Page } from '@playwright/test';
import { InventoryLocators } from '../../locators/sauce-demo/inventory.locators';
import { BasePage } from '../base.page';
import { HeaderComponent } from '../../components/header.component';

/**
 * InventoryPage — Gold Standard.
 * Extends BasePage (1 level, Law 4). Zero assertions inside (Law 2).
 * Raw selectors moved to InventoryLocators (Law 1).
 */
export class InventoryPage extends BasePage {
  private readonly locators: InventoryLocators;
  readonly header: HeaderComponent;

  constructor(page: Page) {
    super(page);
    this.locators = new InventoryLocators(page);
    this.header = new HeaderComponent(page);
  }

  // ── Getters ────────────────────────────────────────────────────────

  async isLoaded(): Promise<boolean> {
    return this.locators.inventoryItems.first().isVisible();
  }

  async getItemCount(): Promise<number> {
    return this.locators.inventoryItems.count();
  }

  async getItemNames(): Promise<string[]> {
    return this.locators.itemNames.allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return this.locators.itemPrices.allTextContents();
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.locators.cartBadge.isVisible())) {
      return 0;
    }
    const text = await this.locators.cartBadge.textContent();
    return parseInt(text ?? '0', 10) || 0;
  }

  /** Expose locator so tests can call expect() on it (Law 2). */
  inventoryItemsLocator() {
    return this.locators.inventoryItems;
  }

  // ── Actions ────────────────────────────────────────────────────────

  async addToCart(index: number): Promise<void> {
    await this.locators.addToCartButtons.nth(index).click();
  }

  async addBackpack(): Promise<void> {
    await this.locators.addToCartBackpackButton.click();
  }

  async addBikeLight(): Promise<void> {
    await this.locators.addToCartBikeLightButton.click();
  }

  async clickProductName(index = 0): Promise<void> {
    await this.locators.itemNames.nth(index).click();
  }

  async clickBackToProducts(): Promise<void> {
    await this.locators.backToProductsButton.click();
  }

  async addAllToCart(): Promise<void> {
    const addButtons = this.locators.addToCartButtons;
    const count = await addButtons.count();
    for (let i = 0; i < count; i++) {
      await addButtons.nth(i).click();
    }
  }

  async goToCart(): Promise<void> {
    await this.header.goToCart();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.locators.sortDropdown.selectOption(option);
  }
}
