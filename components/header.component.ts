import type { Page } from '@playwright/test';
import { BaseComponent } from './base.component';
import { HeaderLocators } from '../locators/components/header.locators';

/**
 * HeaderComponent — encapsulates the SauceDemo global header widget.
 * Composed into page objects via constructor injection (ADR-005).
 * Never inherited. Zero assertions inside (Law 2).
 */
export class HeaderComponent extends BaseComponent {
  private readonly locators: HeaderLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new HeaderLocators(page);
  }

  // ── Getters ────────────────────────────────────────────────────────

  async getPageTitle(): Promise<string> {
    return (await this.locators.pageTitle.textContent()) ?? '';
  }

  async getCartBadgeCount(): Promise<number> {
    if (!(await this.locators.cartBadge.isVisible())) {
      return 0;
    }
    const text = await this.locators.cartBadge.textContent();
    return parseInt(text ?? '0', 10) || 0;
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return this.locators.cartBadge.isVisible();
  }

  /** Expose locators for test-level assertions (Law 2). */
  pageTitleLocator() {
    return this.locators.pageTitle;
  }
  cartBadgeLocator() {
    return this.locators.cartBadge;
  }

  // ── Actions ────────────────────────────────────────────────────────

  async goToCart(): Promise<void> {
    await this.locators.cartLink.click();
  }

  async openMenu(): Promise<void> {
    await this.locators.menuButton.click();
  }

  async closeMenu(): Promise<void> {
    await this.locators.menuCloseButton.click();
  }

  async logout(): Promise<void> {
    await this.openMenu();
    await this.locators.logoutLink.click();
  }

  async goToAllItems(): Promise<void> {
    await this.openMenu();
    await this.locators.allItemsLink.click();
  }

  async resetAppState(): Promise<void> {
    await this.openMenu();
    await this.locators.resetAppLink.click();
    await this.closeMenu();
  }
}
