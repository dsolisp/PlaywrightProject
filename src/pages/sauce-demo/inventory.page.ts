import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { InventoryLocators } from '../../locators/sauce-demo.locators';

export class InventoryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async isLoaded(): Promise<boolean> {
    return this.isVisible(InventoryLocators.INVENTORY_CONTAINER);
  }

  async getItemCount(): Promise<number> {
    return this.count(InventoryLocators.INVENTORY_ITEMS);
  }

  async getItemNames(): Promise<string[]> {
    return this.getAllTextContents(InventoryLocators.ITEM_NAME);
  }

  async getItemPrices(): Promise<string[]> {
    return this.getAllTextContents(InventoryLocators.ITEM_PRICE);
  }

  async addToCart(index: number): Promise<void> {
    await this.clickNth(InventoryLocators.ADD_TO_CART_BUTTON, index);
  }

  async addBackpack(): Promise<void> {
    await this.click(InventoryLocators.ADD_BACKPACK_BUTTON);
  }

  async addBikeLight(): Promise<void> {
    await this.click(InventoryLocators.ADD_BIKELIGHT_BUTTON);
  }

  async clickProductName(index = 0): Promise<void> {
    await this.clickNth(InventoryLocators.ITEM_NAME, index);
  }

  async clickBackToProducts(): Promise<void> {
    await this.click(InventoryLocators.BACK_TO_PRODUCTS);
  }

  async addAllToCart(): Promise<void> {
    const itemCount = await this.count(InventoryLocators.ADD_TO_CART_BUTTON);
    for (let i = 0; i < itemCount; i++) {
      await this.clickNth(InventoryLocators.ADD_TO_CART_BUTTON, i);
    }
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.isVisible(InventoryLocators.CART_BADGE))) {
      return 0;
    }
    const text = await this.getText(InventoryLocators.CART_BADGE);
    return parseInt(text, 10) || 0;
  }

  async goToCart(): Promise<void> {
    await this.click(InventoryLocators.CART_LINK);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.selectOption(InventoryLocators.SORT_DROPDOWN, option);
  }
}
