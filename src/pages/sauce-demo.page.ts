import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import {
  LoginLocators,
  InventoryLocators,
  CartLocators,
  CheckoutLocators,
} from '../locators/sauce-demo.locators';
import { settings } from '../config/settings';

/**
 * SauceDemo Page Objects
 * Equivalent to Python's pages/sauce_demo_page.py
 */

// ═══════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<this> {
    await this.navigateTo(settings().sauceDemoUrl);
    return this;
  }

  async login(username: string, password: string): Promise<void> {
    // Match Python: fill username, password, click login
    await this.fill(LoginLocators.USERNAME_INPUT, username);
    await this.fill(LoginLocators.PASSWORD_INPUT, password);
    // Login button is an input, not button
    await this.page.locator(LoginLocators.LOGIN_BUTTON).click();
  }

  async loginWithDefaults(): Promise<void> {
    await this.login(settings().sauceUsername, settings().saucePassword);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(LoginLocators.ERROR_MESSAGE);
  }

  async isErrorVisible(): Promise<boolean> {
    return this.isVisible(LoginLocators.ERROR_MESSAGE);
  }
}

// ═══════════════════════════════════════════════════════════════════
// INVENTORY PAGE
// ═══════════════════════════════════════════════════════════════════

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
    return this.getLocator(InventoryLocators.ITEM_NAME).allTextContents();
  }

  async getItemPrices(): Promise<string[]> {
    return this.getLocator(InventoryLocators.ITEM_PRICE).allTextContents();
  }

  async addToCart(index: number): Promise<void> {
    const buttons = this.getLocator(InventoryLocators.ADD_TO_CART_BUTTON);
    await buttons.nth(index).click();
  }

  async addAllToCart(): Promise<void> {
    const buttons = this.getLocator(InventoryLocators.ADD_TO_CART_BUTTON);
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
      await buttons.nth(i).click();
    }
  }

  async getCartBadgeCount(): Promise<number> {
    // Match Python: CART_BADGE = span[data-test="shopping-cart-badge"]
    const badge = this.page.locator(InventoryLocators.CART_BADGE);
    if (!(await badge.isVisible())) {
      return 0;
    }
    const text = (await badge.textContent()) || '0';
    return parseInt(text, 10) || 0;
  }

  async goToCart(): Promise<void> {
    await this.click(InventoryLocators.CART_LINK);
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.getLocator(InventoryLocators.SORT_DROPDOWN).selectOption(option);
  }
}

// ═══════════════════════════════════════════════════════════════════
// CART PAGE
// ═══════════════════════════════════════════════════════════════════

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getItemCount(): Promise<number> {
    return this.count(CartLocators.CART_ITEMS);
  }

  async getItemNames(): Promise<string[]> {
    return this.getLocator(CartLocators.ITEM_NAME).allTextContents();
  }

  async removeItem(index: number): Promise<void> {
    const buttons = this.getLocator(CartLocators.REMOVE_BUTTON);
    await buttons.nth(index).click();
  }

  async checkout(): Promise<void> {
    await this.click(CartLocators.CHECKOUT_BUTTON);
  }

  async continueShopping(): Promise<void> {
    await this.click(CartLocators.CONTINUE_SHOPPING);
  }
}

// ═══════════════════════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════════

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fill(CheckoutLocators.FIRST_NAME, firstName);
    await this.fill(CheckoutLocators.LAST_NAME, lastName);
    await this.fill(CheckoutLocators.POSTAL_CODE, postalCode);
  }

  async continue(): Promise<void> {
    await this.click(CheckoutLocators.CONTINUE_BUTTON);
  }

  async finish(): Promise<void> {
    await this.click(CheckoutLocators.FINISH_BUTTON);
  }

  async getTotal(): Promise<string> {
    return this.getText(CheckoutLocators.TOTAL);
  }

  async isComplete(): Promise<boolean> {
    return this.isVisible(CheckoutLocators.COMPLETE_HEADER);
  }

  async getCompleteMessage(): Promise<string> {
    return this.getText(CheckoutLocators.COMPLETE_HEADER);
  }
}
