import type { Page } from '@playwright/test';
import { BasePage } from '../base.page';
import { AlertsLocators } from '../../locators/practice/alerts.locators';
import { URLS } from '../../config/constants';

/**
 * AlertsPage — Gold Standard POM for /alerts.html (ADV-E7, ADV-E8, ADV-E9).
 * Extends BasePage (1 level, Law 4). Zero assertions inside (Law 2).
 * All selectors live in AlertsLocators (Law 1).
 */
export class AlertsPage extends BasePage {
  private readonly locators: AlertsLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new AlertsLocators(page);
  }

  // ── Navigation ────────────────────────────────────────────────────────
  async open(): Promise<this> {
    await this.page.goto(`${URLS.PRACTICE_APP}/alerts.html`);
    return this;
  }

  // ── Getters — return Locators; tests do the asserting (Law 2) ─────────
  triggerAlertButton()   { return this.locators.triggerAlert; }
  triggerConfirmButton() { return this.locators.triggerConfirm; }
  triggerPromptButton()  { return this.locators.triggerPrompt; }
  resultText()           { return this.locators.resultText; }
}
