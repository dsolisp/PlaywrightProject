import type { Page } from '@playwright/test';

/**
 * HeaderLocators — selectors for the SauceDemo global header.
 * Pure selector definitions only — zero logic, zero assertions (Law 1 & Law 2).
 */
export class HeaderLocators {
  constructor(private readonly page: Page) {}

  /** Shopping cart icon / link */
  get cartLink() { return this.page.locator('.shopping_cart_link'); }

  /** Badge showing the number of items in the cart */
  get cartBadge() { return this.page.getByTestId('shopping-cart-badge'); }

  /** Burger menu open button */
  get menuButton() { return this.page.getByRole('button', { name: 'Open Menu' }); }

  /** Burger menu close button */
  get menuCloseButton() { return this.page.getByRole('button', { name: 'Close Menu' }); }

  /** "All Items" nav link inside the burger menu */
  get allItemsLink() { return this.page.getByRole('link', { name: 'All Items' }); }

  /** "About" nav link inside the burger menu */
  get aboutLink() { return this.page.getByRole('link', { name: 'About' }); }

  /** "Logout" nav link inside the burger menu */
  get logoutLink() { return this.page.getByRole('link', { name: 'Logout' }); }

  /** "Reset App State" nav link inside the burger menu */
  get resetAppLink() { return this.page.getByRole('link', { name: 'Reset App State' }); }

  /** Page title text (e.g. "Products", "Your Cart") */
  get pageTitle() { return this.page.getByTestId('title'); }
}
