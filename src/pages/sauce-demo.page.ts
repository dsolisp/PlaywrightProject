import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import {
  LoginLocators,
  InventoryLocators,
  CartLocators,
  CheckoutLocators,
} from '../locators/sauce-demo.locators';
import { settings } from '../config/settings';

// Sauce Demo pages

// ── Login ──────────────────────────────────────────────────────────

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<this> {
    await this.navigateTo(settings().sauceDemoUrl);
    return this;
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(LoginLocators.USERNAME_INPUT, username);
    await this.fill(LoginLocators.PASSWORD_INPUT, password);
    await this.click(LoginLocators.LOGIN_BUTTON);
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

// ── Inventory ──────────────────────────────────────────────────────

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

// ── Cart ───────────────────────────────────────────────────────────

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getItemCount(): Promise<number> {
    return this.count(CartLocators.CART_ITEMS);
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

// ── Checkout ───────────────────────────────────────────────────────

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
