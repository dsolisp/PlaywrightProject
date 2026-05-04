import type { Page } from '@playwright/test';

/**
 * WindowsLocators — locators for /windows.html and /windows/new.html (ADV-E5, ADV-E6).
 * Pure locator definitions — zero logic, zero assertions (Law 1 & Law 2).
 */
export class WindowsLocators {
  constructor(private readonly page: Page) {}

  // ── /windows.html ──────────────────────────────────────────────────────
  get openTabLink() {
    return this.page.getByTestId('open-new-tab-link');
  }
  get openTabJs() {
    return this.page.getByTestId('open-new-tab-js');
  }

  // ── /windows/new.html ──────────────────────────────────────────────────
  get newWindowHeading() {
    return this.page.getByTestId('new-window-heading');
  }
  get newWindowBody() {
    return this.page.getByTestId('new-window-body');
  }
}
