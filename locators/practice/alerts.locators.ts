import type { Page } from '@playwright/test';

/**
 * AlertsLocators — locators for /alerts.html (ADV-E7, ADV-E8, ADV-E9).
 * Pure locator definitions — zero logic, zero assertions (Law 1 & Law 2).
 * testIdAttribute is set to 'data-test' in playwright.config.ts.
 */
export class AlertsLocators {
  constructor(private readonly page: Page) {}

  get triggerAlert() {
    return this.page.getByTestId('trigger-alert');
  }
  get triggerConfirm() {
    return this.page.getByTestId('trigger-confirm');
  }
  get triggerPrompt() {
    return this.page.getByTestId('trigger-prompt');
  }
  get resultText() {
    return this.page.getByTestId('result-text');
  }
}
