import { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { CartLocators } from './cart.locators';
import { InventoryLocators } from './inventory.locators';

/**
 * Cart Page Object
 * Handles shopping cart interactions
 */
export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getItemCount(): Promise<number> {
    return this.count(CartLocators.CART_ITEMS);
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.isVisible(InventoryLocators.CART_BADGE))) {
      return 0;
    }
    const text = await this.getText(InventoryLocators.CART_BADGE);
    return parseInt(text, 10) || 0;
  }

  async getItemNames(): Promise<string[]> {
    return this.getAllTextContents(CartLocators.ITEM_NAME);
  }

  async removeItem(index: number): Promise<void> {
    await this.clickNth(CartLocators.REMOVE_BUTTON, index);
  }

  async checkout(): Promise<void> {
    await this.click(CartLocators.CHECKOUT_BUTTON);
  }

  async continueShopping(): Promise<void> {
    await this.click(CartLocators.CONTINUE_SHOPPING);
  }
}
