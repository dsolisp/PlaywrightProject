import type { Page } from '@playwright/test';

/**
 * DropdownLocators — locators for /dropdown.html (ADV-E1, ADV-E2).
 * Pure locator definitions — zero logic, zero assertions (Law 1 & Law 2).
 */
export class DropdownLocators {
  constructor(private readonly page: Page) {}

  get staticDropdown()  { return this.page.getByTestId('static-dropdown'); }
  get staticStatus()    { return this.page.getByTestId('static-status'); }
  get dynamicDropdown() { return this.page.getByTestId('dynamic-dropdown'); }
  get dynamicStatus()   { return this.page.getByTestId('dynamic-status'); }
}
